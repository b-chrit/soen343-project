from flask_sqlalchemy   import SQLAlchemy
from google.oauth2 import service_account
from googleapiclient.discovery import build
import stripe
import dotenv
import os

class Controller:

    stripe_public_key   : str = None
    JWT_secret_key      : str = None
    database_uri        : str = None
    service             = None
    db                  : SQLAlchemy = None

    def __init_stripe():
        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
        Controller.stripe_public_key = os.getenv('STRIPE_PUBLIC_KEY')
    
    def __init_JWT():
        Controller.JWT_secret_key = os.getenv('JWT_SECRET_KEY')
    
    def __init_database():
        Controller.database_uri = os.getenv('DATABASE_URI')
    
    def __init_google():
        SCOPES = ['https://www.googleapis.com/auth/calendar']
        CREDENTIALS = os.getenv('GOOGLE_CREDENTIALS_LOCATION')
        credentials = service_account.Credentials.from_service_account_file(CREDENTIALS, scopes=SCOPES)                                                                
        Controller.service = build('calendar', 'v3', credentials=credentials)


    def initialize_database( app ):
        Controller.db = SQLAlchemy(app)

    def initialize():
        dotenv.load_dotenv()

        Controller.__init_stripe()
        Controller.__init_JWT()
        Controller.__init_google()
        Controller.__init_database()