from flask_sqlalchemy   import SQLAlchemy
import stripe
import dotenv
import os

class Controller:

    stripe_public_key   : str = None
    JWT_secret_key      : str = None
    database_uri        : str = None
    db                  : SQLAlchemy = None

    def __init_stripe():
        stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
        Controller.stripe_public_key = os.getenv('STRIPE_PUBLIC_KEY')
    
    def __init_JWT():
        Controller.JWT_secret_key = os.getenv('JWT_SECRET_KEY')
    
    def __init_database():
        Controller.database_uri = os.getenv('DATABASE_URI')
        #Base.metadata.create_all(engine)

    def initialize_database( app ):
        print('bb')
        Controller.db = SQLAlchemy(app)

    def initialize():
        dotenv.load_dotenv()

        Controller.__init_stripe()
        Controller.__init_JWT()
        Controller.__init_database()