from flask_restful import Resource
from controllers import UserController, StakeholderController
from views.routes import auth_required

class GetAllStakeholdersResource(Resource):
    @auth_required
    def get(self, user_id):
        try:
            stakeholders = StakeholderController.get_all_stakeholders()

            if not stakeholders:
                return {"status": "success", "data": []}, 200

            return {"status": "success", "data": [stakeholder.get_data() for stakeholder in stakeholders]}, 200
        except Exception as e:
            HTTP_code = getattr(e, "HTTP_code", 400)
            return {"status": "error", "message": str(e)}, HTTP_code

class UpdatePasswordResource(Resource):
    @auth_required
    def post(self, user_id: int):
        parser = reqparse.RequestParser()
        parser.add_argument("current_password", type=str, required=True, help="password is required")
        parser.add_argument("new_password", type=str, required=True, help="password is required")

        try:
            args = parser.parse_args()
            UserController.change_password(user_id, args['new_password'])
            return {'status': 'updated'}, 200
        except Exception as e:
            HTTP_code = getattr(e, 'HTTP_code', None)
            return {'status': 'error', 'code': str(e)}, HTTP_code if HTTP_code else 400

class EditProfileResource(Resource):
    @auth_required
    def put(self, user_id: int):
        parser = reqparse.RequestParser()
        parser.add_argument("first_name", type=str, required=True, help="first_name is required")
        parser.add_argument("last_name", type=str, required=True, help="last_name is required")
        parser.add_argument("email", type=str, required=True, help="email is required")
        parser.add_argument("phone_number", type=str, required=False)
        parser.add_argument("organization_name", type=str, required=False)

        try:
            args = parser.parse_args()
            UserController.edit_profile(user_id, args['email'], args['first_name'], args['last_name'], args.get('phone_number'), args.get('organization_name'))
            return {'status': 'updated'}, 200
        except Exception as e:
            HTTP_code = getattr(e, 'HTTP_code', None)
            return {'status': 'error', 'code': str(e)}, HTTP_code if HTTP_code else 400

class GetUserProfile(Resource):
    @auth_required
    def get(self, user_id: int):
        try:
            profile = UserController.get_profile(user_id)
            return profile
        except Exception as e:
            HTTP_code = getattr(e, 'HTTP_code', None)
            return {'status': 'error', 'code': str(e)}, HTTP_code if HTTP_code else 400
