from flask_jwt_extended import JWTManager, jwt_required
from controllers        import UserController
from models             import User
from functools          import wraps


def auth_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user : User = UserController.authentication()
        if not user:
            ...
        return f(args[0], user.id, **kwargs)
    return decorated_function

def admin_only(f):
    
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user : User = UserController.authentication()
        if not user or user.get_type() != "admin":
            ...
        return f(args[0], user.id, **kwargs)
    return decorated_function

def attendee_only(f):
    
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user : User = UserController.authentication()
        if not user or user.get_type() not in ["attendee", "admin"]:
            ...
        return f(args[0], user.id, **kwargs)
    return decorated_function

def organizer_only(f):
    
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user : User = UserController.authentication()
        if not user or  user.get_type() not in ["organizer", "admin"]:
            ...
        return f(args[0],user.id, **kwargs)
    return decorated_function

def stakeholder_only(f):
    
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user: User = UserController.authentication()
        if not user or user.get_type() not in ["stakeholder", "admin"]:
            return {'message': 'Unauthorized'}, 403
        return f(args[0], user.id, **kwargs)
    return decorated_function
