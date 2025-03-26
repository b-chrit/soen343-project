from flask_restful import Resource, reqparse
from controllers    import UserController, OrganizerController, AttendeeController, AdminController, StakeholderController

class LoginResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(    "email",    type=str, required=True, help="Email is required")
        parser.add_argument(    "password", type=str, required=True, help="Password is required")
        
        try:
            args = parser.parse_args()

            token, user_type = UserController.login( args['email'], args['password'] )

            return { 'token' : token, 'user_type' : user_type }, 200
        
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
        
class RegisterResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(    "email",                type=str, required=True, help="Email is required")
        parser.add_argument(    "password",             type=str, required=True, help="Password is required")
        parser.add_argument(    "first_name",           type=str, required=True, help="first_name is required")
        parser.add_argument(    "last_name",            type=str, required=True, help="last_name is required")
        parser.add_argument(    "organization_name",    type=str, required=False)
        parser.add_argument(    "phone_number",         type=str, required=False)
        parser.add_argument(    "user_type",            type=str, required=True, help='User_type required')

        try:
            args = parser.parse_args()
            
            email       : str = args['email']
            password    : str = args['password']
            first_name  : str = args['first_name']
            last_name   : str = args['last_name']
            user_type   : str = args['user_type']

            match user_type:

                case 'organizer':

                    organization_name   : str = args.get('organization_name')
                    phone_number        : str = args.get('phone_number')

                    if not organization_name or not phone_number:
                        raise Exception('Missing organization_name or phone_number')
                    
                    OrganizerController.create_organizer(email, password, first_name, last_name, organization_name, phone_number)

                    return {'status': f'{user_type.capitalize()} registered successfully'}, 201
                
                case 'attendee':

                    AttendeeController.create_attendee(email, password, first_name, last_name)
                    return {'status': f'{user_type.capitalize()} registered successfully'}, 201
                
                case 'admin':
                    AdminController.create_admin(email, password, first_name, last_name)
                    return {'status': f'{user_type.capitalize()} registered successfully'}, 201
                case 'stakeholder':
                    StakeholderController.create_stakeholder(email, password, first_name, last_name)
                    return {'status': f'{user_type.capitalize()} registered successfully'}, 201

                case _:
                    raise Exception('invalid_user_type')
                
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400

