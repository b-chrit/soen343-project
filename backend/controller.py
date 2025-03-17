from models.users.admin import Admin
from models import Registration
from flask import Flask, request, jsonify  # Import required modules
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS  # To enable Cross-Origin Resource Sharing (CORS)
from dotenv import load_dotenv  # Load environment variables
from models.users import User, Organizer
from models.users.attendee import Attendee  # Added import for Attendee
from models.users.stakeholder import Stakeholder
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

@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()

    # Required fields common to all users
    required_fields = ['email', 'password', 'first_name', 'last_name', 'user_type']

    # Validate missing fields
    missing = [field for field in required_fields if field not in data]
    if missing:
        return {'error': 'Missing required fields', 'missing': missing}, 400

    # Extract and normalize fields
    email = data['email']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']
    user_type = data['user_type'].strip().lower()

    # Normalize 'administrator' to 'admin'
    if user_type == 'administrator':
        user_type = 'admin'

    valid_user_types = ['attendee', 'organizer', 'stakeholder', 'admin']

    # Validate user type
    if user_type not in valid_user_types:
        return {'error': 'Invalid user_type provided'}, 400

    with SQLSession() as session:
        # Check if the email is already registered
        existing_user = User.find(session, email=email)
        if existing_user:
            return {'error': 'Email already registered'}, 409

        # Initialize user based on type
        if user_type == 'attendee':
            new_user = Attendee(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
        
        elif user_type == 'organizer':
            # Additional required fields for Organizer
            organizer_fields = ['organization_name', 'phone_number']
            missing_organizer_fields = [field for field in organizer_fields if field not in data]

            if missing_organizer_fields:
                return {
                    'error': 'Missing required fields for organizer',
                    'missing': missing_organizer_fields
                }, 400

            organization_name = data['organization_name']
            phone_number = data['phone_number']

            new_user = Organizer(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                organization_name=organization_name,
                phone_number=phone_number
            )

        elif user_type == 'stakeholder':
            new_user = Stakeholder(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

        elif user_type == 'admin':
            new_user = Admin(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

        else:
            return {'error': 'Unhandled user_type'}, 500  # This should never happen

        # Add the user to the database
        User.add(session, new_user)

    return {'status': f'{user_type.capitalize()} registered successfully'}, 201

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
            user_id = user.get_id()
            user_type = user.get_type()  # Grab the user_type from the User object
            token = create_access_token(identity=f'{user_id}')

            return {
                'token': token,
                'user_type': user_type
            }, 200

        return {'error': 'invalid_credentials'}, 401


# ----------------------- 
# ✅ Get Profile 
# ----------------------- 
@app.route("/profile", methods=["GET"])
@jwt_required()  # JWT is required to access this endpoint
def profile():
    user_id = int(get_jwt_identity())  # Get the user ID from the JWT token

    with SQLSession() as session:
        # Fetch user details from the 'User' model
        user = User.find(session, user_id=user_id)  # Fetch data for the logged-in user

        if not user:
            return {'error': 'User not found'}, 404

        # Return the user's first name, last name, email, and ID without exposing the password
        return {
            'id': user.get_id(),
            'first_name': user.get_first_name(),
            'last_name': user.get_last_name(),
            'email': user.get_email(),
        }, 200

# ----------------------- 
# ✅ Update Password 
# ----------------------- 
@app.route("/update_password", methods=["POST"])
@jwt_required()  # JWT is required to access this endpoint
def update_password():
    user_id = int(get_jwt_identity())  # Get the user ID from the JWT token

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    # Ensure that all fields are provided
    if not all([current_password, new_password, confirm_password]):
        return {'error': 'Missing fields'}, 400

    # Ensure the new passwords match
    if new_password != confirm_password:
        return {'error': 'New passwords do not match'}, 400

    with SQLSession() as session:
        # Fetch user details from the 'User' model
        user = User.find(session, user_id=user_id)

        if not user:
            return {'error': 'User not found'}, 404

        # Verify the current password
        if not user.check_password(current_password):
            return {'error': 'Current password is incorrect'}, 401

        # Update the password with the new one
        user.set_password(new_password)
        session.commit()

        return {'status': 'Password updated successfully'}, 200

# ----------------------- 
# ✅ Update Profile (First Name, Last Name, Email)
# ----------------------- 
@app.route("/update_profile", methods=["PUT"])
@jwt_required()  # JWT is required to access this endpoint
def update_profile():
    user_id = int(get_jwt_identity())  # Get the user ID from the JWT token

    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')

    # Ensure that all fields are provided
    if not all([first_name, last_name, email]):
        return {'error': 'Missing fields'}, 400

    with SQLSession() as session:
        # Fetch user details from the 'User' model
        user = User.find(session, user_id=user_id)

        if not user:
            return {'error': 'User not found'}, 404

        # Update the profile with the new details
        user.set_first_name(first_name)
        user.set_last_name(last_name)
        user.set_email(email)

        session.commit()

        return {'status': 'Profile updated successfully'}, 200


# ----------------------- 
# ✅ Get Event (For All Users)
# ----------------------- 
@app.route("/get_event", methods=["GET"])
@jwt_required()  # JWT is required to access this endpoint
def get_event():
    event_data = []
    user_id = int(get_jwt_identity())

    with SQLSession() as session:
        # Check if the user is an organizer first
        organizer = Organizer.find(session, user_id)

        if organizer and organizer.get_type() == 'organizer':
            event_id = organizer.get_event_id()
            if event_id:
                event = Event.find(session, event_id=event_id)
                if event:
                    organizer_name = f"{organizer.get_first_name()} {organizer.get_last_name()}"
                    sponsor_name = None

                    if event.get_sponsor():
                        sponsor = Stakeholder.find(session, user_id=event.get_sponsor())
                        if sponsor:
                            sponsor_name = f"{sponsor.get_first_name()} {sponsor.get_last_name()}"

                    event_data.append({
                        'id': event.get_id(),
                        'title': event.get_title(),
                        'location': event.get_location(),
                        'category': event.get_category(),
                        'description': event.get_description(),
                        'start': str(event.get_start()),
                        'end': str(event.get_end()),
                        'organizer_name': organizer_name,
                        'sponsor_name': sponsor_name
                    })

            # ✅ Return even if empty
            return jsonify(event_data), 200

        # If user is attendee or admin, return all public events
        public_events = Event.find(session)

        if public_events:
            for event in public_events:
                organizer = Organizer.find(session, user_id=event.get_organizer())
                organizer_name = f"{organizer.get_first_name()} {organizer.get_last_name()}"
                sponsor_name = None

                if event.get_sponsor():
                    sponsor = Stakeholder.find(session, user_id=event.get_sponsor())
                    if sponsor:
                        sponsor_name = f"{sponsor.get_first_name()} {sponsor.get_last_name()}"

                event_data.append({
                    'id': event.get_id(),
                    'title': event.get_title(),
                    'location': event.get_location(),
                    'category': event.get_category(),
                    'description': event.get_description(),
                    'start': str(event.get_start()),
                    'end': str(event.get_end()),
                    'organizer_name': organizer_name,
                    'sponsor_name': sponsor_name
                })

        # ✅ Return 200 OK, even if event_data is an empty list
        return jsonify(event_data), 200

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
    

@app.route('/register_attendee_for_event', methods=['POST'])
@jwt_required()
def register_attendee_for_event():
    data = request.get_json()

    # Check if event_id is provided
    if 'event_id' not in data:
        return {'error': 'Missing event_id'}, 400

    event_id = data['event_id']

    # Get the user (attendee) ID from the JWT
    user_id = int(get_jwt_identity())

    with SQLSession() as session:
        # Find the attendee
        attendee = Attendee.find(session, user_id=user_id)
        if not attendee:
            return {'error': 'Attendee not found'}, 404

        # Find the event
        event = Event.find(session, event_id=event_id)
        if not event:
            return {'error': 'Event not found'}, 404

        # Check if the attendee is already registered for this event
        registration = session.query(Registration).filter_by(attendee_id=user_id, event_id=event_id).first()
        if registration:
            return {'error': 'Attendee already registered for this event'}, 409

        # Register the attendee for the event
        registration = Registration(attendee_id=user_id, event_id=event_id)
        session.add(registration)
        session.commit()

    return {'status': 'Registration successful'}, 201


@app.route('/get_registered_events', methods=['GET'])
@jwt_required()
def get_registered_events():
    user_id = int(get_jwt_identity())

    with SQLSession() as session:
        registrations = session.query(Registration).filter_by(attendee_id=user_id).all()

        if not registrations:
            # Return an empty list instead of 404
            return jsonify([]), 200

        event_data = []
        for registration in registrations:
            event = Event.find(session, event_id=registration.event_id)
            if event:
                organizer = Organizer.find(session, user_id=event.get_organizer())
                organizer_name = f"{organizer.get_first_name()} {organizer.get_last_name()}"

                sponsor_name = None
                if event.get_sponsor():
                    sponsor = Stakeholder.find(session, user_id=event.get_sponsor())
                    if sponsor:
                        sponsor_name = f"{sponsor.get_first_name()} {sponsor.get_last_name()}"

                event_data.append({
                    'id': event.get_id(),
                    'title': event.get_title(),
                    'location': event.get_location(),
                    'category': event.get_category(),
                    'description': event.get_description(),
                    'start': str(event.get_start()),
                    'end': str(event.get_end()),
                    'organizer_name': organizer_name,
                    'sponsor_name': sponsor_name
                })

        return jsonify(event_data), 200

@app.route('/cancel_registration_for_event', methods=['POST'])
@jwt_required()
def cancel_registration_for_event():
    data = request.get_json()

    # Check if event_id is provided
    if 'event_id' not in data:
        return {'error': 'Missing event_id'}, 400

    event_id = data['event_id']

    # Get the user (attendee) ID from the JWT
    user_id = int(get_jwt_identity())

    with SQLSession() as session:
        # Find the attendee
        attendee = Attendee.find(session, user_id=user_id)
        if not attendee:
            return {'error': 'Attendee not found'}, 404

        # Find the event
        event = Event.find(session, event_id=event_id)
        if not event:
            return {'error': 'Event not found'}, 404

        # Find the registration to cancel
        registration = session.query(Registration).filter_by(attendee_id=user_id, event_id=event_id).first()
        if not registration:
            return {'error': 'Attendee is not registered for this event'}, 404

        # Cancel the registration (delete the record)
        session.delete(registration)
        session.commit()

    return {'status': 'Registration canceled successfully'}, 200

@app.route('/check_registration', methods=['GET'])
@jwt_required()
def check_registration():
    user_id = get_jwt_identity()  # Get user ID from JWT token
    event_id = request.args.get('event_id')  # Get event_id from query parameters

    # Ensure event_id is provided and convert it to an integer
    if not event_id:
        return jsonify({"error": "Missing event_id"}), 400

    try:
        event_id = int(event_id)  # Ensure event_id is an integer
    except ValueError:
        return jsonify({"error": "Invalid event_id format"}), 400

    # Use SQLSession to query the database
    with SQLSession() as session:
        # Check if the user is registered for the event
        registration = session.query(Registration).filter_by(attendee_id=user_id, event_id=event_id).first()

        if registration:
            return jsonify({"status": "success", "is_registered": True}), 200
        else:
            return jsonify({"status": "success", "is_registered": False}), 200

# ----------------------- 
# ✅ Delete User Endpoint (Admin Only)
# -----------------------
# Deletes a user account by user_id.
# Requires: Admin JWT token in Authorization header.
# Method: DELETE
# Route: /delete_user
# Request body: { "user_id": int }
# Response: 200 on success, 403 if unauthorized, 404 if user not found.
@app.route("/delete_user", methods=["DELETE"])
@jwt_required()  # JWT is required (Admin access only)
def delete_user():
    # Get the ID of the user making the request (should be admin)
    admin_id = int(get_jwt_identity())

    # Get the request body data
    data = request.get_json()

    # ✅ Ensure user_id is provided in the request
    if not data or 'user_id' not in data:
        return {'error': 'Missing user_id'}, 400

    user_to_delete_id = data['user_id']

    with SQLSession() as session:
        # ✅ Verify the requester is an admin
        admin = User.find(session, user_id=admin_id)
        if not admin or admin.get_type() != 'admin':
            return {'error': 'Access denied'}, 403

        # ✅ Find the user to delete by user_id
        user_to_delete = User.find(session, user_id=user_to_delete_id)
        if not user_to_delete:
            return {'error': 'User not found'}, 404

        # ✅ Optional: Prevent the admin from deleting their own account
        if user_to_delete.get_id() == admin_id:
            return {'error': 'Admins cannot delete themselves'}, 400

        # ✅ Delete the user account
        session.delete(user_to_delete)
        session.commit()

        return {'status': 'User deleted successfully'}, 200

    

# -----------------------
# ✅ Get All Users Endpoint
# -----------------------
# Returns all users except admins.
# Requires: Admin JWT token in Authorization header.
# Method: GET
# Route: /get_all_users
# Response: 200 with user list, 403 if not admin.
@app.route("/get_all_users", methods=["GET"])
@jwt_required()  # Ensure only authenticated users can access
def get_all_users():
    user_id = int(get_jwt_identity())

    with SQLSession() as session:
        # Check if the requester is an admin
        admin = User.find(session, user_id=user_id)
        if not admin or admin.get_type() != 'admin':
            return {'error': 'Access denied'}, 403

        # Fetch all users
        users = User.find(session)

        user_data = []
        for user in users:
            if user.get_type() == 'admin':  # ✅ Skip admins
                continue
            user_data.append({
                'id': user.get_id(),
                'first_name': user.get_first_name(),
                'last_name': user.get_last_name(),
                'email': user.get_email(),
                'type': user.get_type()
            })

        return jsonify(user_data), 200
    
# -----------------------
# ✅ Delete Event Endpoint
# -----------------------
# Deletes an event by event_id.
# Requires: JWT token (Organizer or Admin).
# Method: DELETE
# Route: /delete_event
# Request body: { "event_id": int }
# Response: 200 on success, 403 if unauthorized, 404 if not found.
@app.route("/delete_event", methods=["DELETE"])
@jwt_required()  # JWT is required to delete events
def delete_event():
    user_id = int(get_jwt_identity())

    data = request.get_json()
    
    # Ensure event_id is provided in the request body
    if not data or 'event_id' not in data:
        return {'error': 'Missing event_id'}, 400

    event_id = data['event_id']

    with SQLSession() as session:
        # Find the event by event_id
        event = Event.find(session, event_id=event_id)
        if not event:
            return {'error': 'Event not found'}, 404

        # Get the requesting user
        user = User.find(session, user_id=user_id)
        if not user:
            return {'error': 'User not found'}, 404

        # ✅ Check if the user is authorized to delete the event
        is_admin = user.get_type() == 'admin'
        is_organizer_and_owner = user.get_type() == 'organizer' and event.get_organizer() == user_id

        if not is_admin and not is_organizer_and_owner:
            return {'error': 'Unauthorized to delete this event'}, 403

        # ✅ Delete the event
        session.delete(event)
        session.commit()

    return {'status': 'Event deleted successfully'}, 200

# -------------------------------------------------
# ✅ Run the App
# -------------------------------------------------
if __name__ == "__main__":
    # Run Flask app on port 5003
    app.run(debug=True, port=5003)
