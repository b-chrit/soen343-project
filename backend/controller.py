from flask import Flask, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restful import Resource, Api
from flask_cors import CORS
from dotenv import load_dotenv
from models.users import User, Organizer
from models import Event
import os
from models.config import SQLSession
from datetime import datetime



load_dotenv()
app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False 

CORS(app)
jwt = JWTManager(app)


@app.route('/')
def index():
    return { 'status': 'ok' }, 200

@app.route('/login', methods=['POST'])
def login():
    data            : dict   = request.get_json()

    required_data = {
        'email'     : None,
        'password'  : None,
    }

    data_json       : dict = request.get_json()

    if not required_data.keys() <= data_json.keys():
        missing_keys = list(required_data.keys() - data_json.keys())
        return {'error': 'Missing required fields', 'missing': missing_keys}, 400
    
    for data in required_data:
                required_data[data] = data_json[data]


    with SQLSession() as session:
        user : User = User.auth(session, required_data['email'], required_data['password'])
        
        if user:
            user_id = user.get_id()
            token = create_access_token(identity=f'{user_id}')
            return { 'token' : token }, 200

        return { 'error': 'invalid_credentials' }, 401

@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id : int = int(get_jwt_identity())
    return {'id':user_id}


@app.route("/get_event", methods=["GET"])
@jwt_required()
def get_event():
    event_data  : dict  = {}
    user_id     : int   = int(get_jwt_identity())

    with SQLSession() as session:
        organizer : Organizer = Organizer.find(session, user_id)
        if organizer:
            if organizer.get_type() == 'organizer':
                event_id : int = organizer.get_event_id()
                if event_id:
                    event : Event = Event.find(session, event_id=event_id)
                    print(event)
                    event_data['title']         = event.get_title()
                    event_data['location']      = event.get_location()
                    event_data['category']      = event.get_category()
                    event_data['description']   = event.get_description()
                    event_data['start']         = str(event.get_start())
                    event_data['end']           = str(event.get_end())
                return event_data, 200
            return {'error': 'Forbidden'},403
        return {'error': 'Not Authenticated'},401

@app.route("/create_event", methods=["POST"])
@jwt_required()
def create_event():
    user_id : int = int(get_jwt_identity())

    required_data = {
        "title"         : None,
        "start"         : None,
        "end"           : None,
        "category"      : None,
        "location"      : None,
        "description"   : None
    }

    data_json           : dict   = request.get_json()

    if not required_data.keys() <= data_json.keys():
        missing_keys = list(required_data.keys() - data_json.keys())
        return {'error': 'Missing required fields', 'missing': missing_keys}, 400
    
    try:
        for data in required_data:
            required_data[data] = data_json[data]
        required_data['start']  = datetime.strptime(required_data['start'], "%Y-%m-%d %H:%M:%S.%f")
        required_data['end']    = datetime.strptime(required_data['end'], "%Y-%m-%d %H:%M:%S.%f")
    except:
        return {'error': 'Invalid datetime format'}, 400


    with SQLSession() as session:
        organizer : Organizer = Organizer.find(session, user_id)
        if organizer:
            if organizer.get_type() == 'organizer':
                organizer.create_event(
                    session, 
                    title       = required_data['title'], 
                    start       = required_data['start'],
                    end         = required_data['end'],
                    category    = required_data['category'],
                    description = required_data['description'],
                    location    = required_data['location']
                )
                return {'status': 'success'}, 201
            return {'error': 'Forbidden'},403
        return {'error': 'Not Authenticated'},401
app.run(debug = True, port=5003)