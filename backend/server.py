from flask import Flask, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
import connector
import os


load_dotenv()
app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')


CORS(app)
jwt = JWTManager(app)
@app.route('/')
def index():
    return { 'status': 'ok' }, 200

@app.route('/login', methods=['POST'])
def login():
    data            = request.get_json()
    email           = data.get("email")
    password        = data.get("password")
    account_type    = data.get("account_type")

    status = 'bad_request'

    if email != None and password != None and account_type != None:
        user_id, status = connector.auth(account_type, email, password)
        if user_id > 0:
            token = create_access_token(identity=f'{account_type}_{user_id}')
            return {
                'status'    : 'ok',
                'token'     : token 
            }, 200
        
    if status == 'invalid_email_password':
        return { 'status': status }, 401
    
    return { 'status' : status }, 400

@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    return "null"

app.run(debug = True, port=5003)