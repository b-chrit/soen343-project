from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity
from models import User, Organizer


class UserController:

    def login( email : str, password : str):

        user : User = User.auth(email, password)

        if user:
            user_id = user.get_id()
            user_type = user.get_type()  # Grab the user_type from the User object
            token = create_access_token(identity=f'{user_id}')
            
            return token, user_type
    
    
    def authentication() -> User:
        user_id = int(get_jwt_identity())
        return User.find(user_id)
    
    def get_users():
        users       : list[User] = User.find()
        users_data  : list[dict] = []

        for user in users:
            users_data.append(user.get_data())
            
        return users_data

    def get_user(user_id):
        user : User = User.find( user_id = user_id)
        return user.get_data()
    
    def delete_user( user_id : int ):
        User.remove(user_id)

    def change_password( user_id : int, password : str):
        user : User = User.find(user_id=user_id)

        if not user:
            raise User.UserError.NotFound()
        
        user.set_password(password)
    
    def get_profile(user_id : int):
        user : User = User.find(user_id=user_id)

        if not user:
            raise User.UserError.NotFound()
        
        return user.get_data()

    def edit_profile(user_id : int, email : str, first_name : str, last_name : str, phone_number : str = None, organization_name : str = None):

        if phone_number and organization_name:
            user : Organizer = Organizer.find(user_id=user_id)
            if not user:
                User.UserError.NotFound()

            user.set_organization_name(organization_name)
            user.set_phone_number(phone_number)
        else:
            user : User = User.find(user_id=user_id)
            if not user:
                User.UserError.NotFound()

        
        user.set_email(email)
        user.set_first_name(first_name)
        user.set_last_name(last_name)
        
