from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager

from views.payment_route import PublicKeyResource
from views.attendee_route import RegisterToEventResource, CheckRegistration, GetRegisteredEventsResource, CancelRegistration
from views.authentication_route import LoginResource, RegisterResource
from views.event_route import CreateEventResource, GetEventResource, DeleteEventResource, EditEventResource, GetAnalyticsResource
from views.admin_route import GetUsersResource, DeleteUserResource
from views.organizer_route import GetOrganizerEventResource, RequestSponsorshipResource
from views.user_routes import UpdatePasswordResource, GetUserProfile, EditProfileResource, GetAllStakeholdersResource
from views.stakeholder_route import CheckSponsorshipResource, SponsorEventResource, CancelSponsorshipResource

from controllers import Controller
from models import db

app = Flask(__name__)

Controller.initialize()

app.config['SQLALCHEMY_DATABASE_URI'] = Controller.database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["JWT_SECRET_KEY"] = Controller.JWT_secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False


CORS(app, origins="http://localhost:3000")  
JWTManager(app)
api = Api(app)
db.init_app(app)

with app.app_context():
    
    api.add_resource(LoginResource, '/login')
    api.add_resource(RegisterResource, '/register')
    
    api.add_resource(UpdatePasswordResource, '/user/reset_password')
    api.add_resource(GetUserProfile, '/user/get_profile')
    api.add_resource(EditProfileResource, '/user/edit_profile')
    api.add_resource(PublicKeyResource, '/payment/get_key')

    api.add_resource(GetRegisteredEventsResource, '/attendee/get_events')

    api.add_resource(GetEventResource, '/event/get')
    api.add_resource(EditEventResource, '/event/edit')
    api.add_resource(CreateEventResource, '/event/create')
    api.add_resource(RegisterToEventResource, '/event/register')
    api.add_resource(CancelRegistration, '/event/deregister')
    api.add_resource(DeleteEventResource, '/event/delete_event')
    api.add_resource(CheckRegistration, '/event/check_registration')

    api.add_resource(GetAnalyticsResource, '/event/analytics')

    api.add_resource(GetUsersResource, '/admin/get_users')
    api.add_resource(DeleteUserResource, '/admin/delete_user')

    api.add_resource(GetOrganizerEventResource, '/organizer/get_event')
    api.add_resource(RequestSponsorshipResource, '/organizer/request_sponsorship')
    


    api.add_resource(SponsorEventResource, '/stakeholder/sponsor_event')
    api.add_resource(CancelSponsorshipResource, '/stakeholder/cancel_sponsorship')
    api.add_resource(CheckSponsorshipResource, '/stakeholder/check_sponsorship')
    api.add_resource(GetAllStakeholdersResource, '/stakeholder/get_all')

if __name__ == "__main__":
    app.run(debug=True, port=5003)
