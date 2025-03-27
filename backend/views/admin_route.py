from flask_restful import Resource, reqparse
from controllers    import UserController, EventController
from views.routes   import admin_only

class DeleteUserResource(Resource):
    @admin_only
    def delete(self, user_id : int):

        parser = reqparse.RequestParser()
        parser.add_argument( "user_id", type=int, required=False, help="user_id is required" )
        try:
            print('yip')
            args = parser.parse_args()
            print(args)
            UserController.delete_user(args['user_id'])

            return {'status' : 'deleted'}, 200

        except Exception as e:
            print(e)
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
        
class GetUsersResource(Resource):
    @admin_only
    def get(self, user_id : int):
        try:
            users : list[dict] = UserController.get_users()
            return users
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
        