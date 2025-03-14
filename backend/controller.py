from flask import Flask, request, jsonify  # Import required modules
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS  # To enable Cross-Origin Resource Sharing (CORS)
from dotenv import load_dotenv  # Load environment variables
from models.users import User, Organizer
from models.users.attendee import Attendee  # Added import for Attendee
from models import Event
import os
from models.config import SQLSession
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Set up JWT secret key and token expiration settings
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

# Enable CORS for frontend requests coming from localhost:3000 (React app)
CORS(app, origins="http://localhost:3000")  

# Initialize JWT Manager
jwt = JWTManager(app)

# -------------------------------------------------
# ✅ Routes
# -------------------------------------------------

# Health Check Route - Check if the server is running
@app.route('/')
def index():
    return {'status': 'ok'}, 200

# ----------------------- 
# ✅ Attendee Registration 
# ----------------------- 
@app.route('/register_attendee', methods=['POST'])
def register_attendee():
    data = request.get_json()

    required_fields = ['email', 'password', 'first_name', 'last_name']

    # Check if all required fields are present in the data
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return {'error': 'Missing required fields', 'missing': missing}, 400

    # Extract data and create a new Attendee
    email = data['email']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']

    # DB operations: Check if the email already exists
    with SQLSession() as session:
        existing_user = User.find(session, email=email)
        if existing_user:
            return {'error': 'Email already registered'}, 409

        # Create and add attendee to the database
        attendee = Attendee(email=email, password=password, first_name=first_name, last_name=last_name)
        Attendee.add(session, attendee)

    return {'status': 'Attendee registered successfully'}, 201

# ----------------------- 
# ✅ Login Endpoint 
# ----------------------- 
@app.route('/login', methods=['POST'])
def login():
    required_data = {'email': None, 'password': None}
    data_json = request.get_json()

    # Check if the required fields are present
    if not required_data.keys() <= data_json.keys():
        missing_keys = list(required_data.keys() - data_json.keys())
        return {'error': 'Missing required fields', 'missing': missing_keys}, 400

    # Authenticate the user
    for data in required_data:
        required_data[data] = data_json[data]

    with SQLSession() as session:
        user = User.auth(session, required_data['email'], required_data['password'])

        if user:
            # Generate a JWT token for the user upon successful login
            user_id = user.get_id()
            token = create_access_token(identity=f'{user_id}')
            return {'token': token}, 200

        return {'error': 'invalid_credentials'}, 401

# ----------------------- 
# ✅ Get Profile 
# ----------------------- 
@app.route("/profile", methods=["GET"])
@jwt_required()  # JWT is required to access this endpoint
def profile():
    # Get the user ID from the JWT token
    user_id = int(get_jwt_identity())
    return {'id': user_id}

# ----------------------- 
# ✅ Get Event (For All Users)
# ----------------------- 
@app.route("/get_event", methods=["GET"])
@jwt_required()  # JWT is required to access this endpoint
def get_event():
    event_data = []
    user_id = int(get_jwt_identity())

    # Fetch the events
    with SQLSession() as session:
        # Try to get the organizer first
        organizer = Organizer.find(session, user_id)

        if organizer:
            if organizer.get_type() == 'organizer':
                # Return events associated with the organizer
                event_id = organizer.get_event_id()
                if event_id:
                    event = Event.find(session, event_id=event_id)
                    if event:
                        event_data.append({
                            'title': event.get_title(),
                            'location': event.get_location(),
                            'category': event.get_category(),
                            'description': event.get_description(),
                            'start': str(event.get_start()),
                            'end': str(event.get_end()),
                            'organizer_id': event.get_organizer(),  # Added organizer_id
                            'sponsor_id': event.get_sponsor()       # Added sponsor_id
                        })
                return jsonify(event_data), 200

        # If the user is an attendee or admin, fetch all public events
        public_events = Event.find(session)  # Fetching all events, could be optimized by adding a condition for public events only
        if public_events:
            for event in public_events:
                event_data.append({
                    'title': event.get_title(),
                    'location': event.get_location(),
                    'category': event.get_category(),
                    'description': event.get_description(),
                    'start': str(event.get_start()),
                    'end': str(event.get_end()),
                    'organizer_id': event.get_organizer(),  # Added organizer_id
                    'sponsor_id': event.get_sponsor()       # Added sponsor_id
                })
            return jsonify(event_data), 200

        return jsonify({'error': 'No events found'}), 404

# ----------------------- 
# ✅ Create Event (Organizer Only)
# ----------------------- 
@app.route("/create_event", methods=["POST"])
@jwt_required()
def create_event():
    user_id = int(get_jwt_identity())

    required_data = {
        "title": None,
        "start": None,
        "end": None,
        "category": None,
        "location": None,
        "description": None
    }

    data_json = request.get_json()

    # Check if all required fields are provided
    if not required_data.keys() <= data_json.keys():
        missing_keys = list(required_data.keys() - data_json.keys())
        return {'error': 'Missing required fields', 'missing': missing_keys}, 400

    try:
        for data in required_data:
            required_data[data] = data_json[data]
        required_data['start'] = datetime.strptime(required_data['start'], "%Y-%m-%d %H:%M:%S.%f")
        required_data['end'] = datetime.strptime(required_data['end'], "%Y-%m-%d %H:%M:%S.%f")
    except Exception as e:
        return {'error': f'Invalid datetime format: {str(e)}'}, 400

    # Check if the user is an organizer and create the event
    with SQLSession() as session:
        organizer = Organizer.find(session, user_id)
        if organizer:
            if organizer.get_type() == 'organizer':
                organizer.create_event(
                    session,
                    title=required_data['title'],
                    start=required_data['start'],
                    end=required_data['end'],
                    category=required_data['category'],
                    description=required_data['description'],
                    location=required_data['location']
                )
                return {'status': 'success'}, 201
            return {'error': 'Forbidden'}, 403
        return {'error': 'Not Authenticated'}, 401

# -------------------------------------------------
# ✅ Run the App
# -------------------------------------------------
if __name__ == "__main__":
    # Run Flask app on port 5003
    app.run(debug=True, port=5003)
