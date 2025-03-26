from __future__ import annotations
from models import db

import bcrypt

class User(db.Model):

    class UserError(Exception):

        class NotFound(Exception):
            HTTP_code = 404
            def __init__(self, message : str = "user_not_found"):
                super().__init__(message)

        class AlreadyExists(Exception):
            HTTP_code = 400
            def __init__(self, message = "user_already_exists"):
                super().__init__(message)

    __tablename__ = 'users'

    id              = db.Column(db.Integer, primary_key=True, autoincrement=True)
    __email         = db.Column("email", db.String, unique=True, nullable=False)
    __password      = db.Column("password", db.String, nullable=False)
    __last_name     = db.Column("last_name", db.String, nullable=False)
    __first_name    = db.Column("first_name", db.String, nullable=False)
    __user_type     = db.Column("user_type", db.String)

    __mapper_args__ = {"polymorphic_identity": "user", "polymorphic_on": __user_type}

    def __init__(self, email: str, password: str, first_name: str, last_name: str):
        self.__email = email
        self.__first_name = first_name
        self.__last_name = last_name
        self.set_password(password)

    def get_data(self) -> dict:
        data : dict = {
            'id'            : self.id,
            'email'         : self.__email,
            'first_name'    : self.__first_name,
            'last_name'     : self.__last_name,
            'user_type'     : self.__user_type
        }
        return data

    
    
    def get_email(self) -> str:
        return self.__email

    
    def set_email(self, value: str) -> None:
        self.__email = value
        db.session.commit()

    
    def get_first_name(self) -> str:
        return self.__first_name

   
    def set_first_name(self, value: str) -> None:
        self.__first_name = value
        db.session.commit()


    
    def get_last_name(self) -> str:
        return self.__last_name


    def set_last_name(self, value: str) -> None:
        self.__last_name = value
        db.session.commit()

    def get_password(self) -> str:
        return self.__password

    def set_password(self, plain_text__password: str) -> None:

        hashed = bcrypt.hashpw(plain_text__password.encode('utf-8'), bcrypt.gensalt())
        self.__password = hashed.decode('utf-8')
        db.session.commit()

    def check_password(self, plain_text__password: str) -> bool:
       
        return bcrypt.checkpw(plain_text__password.encode('utf-8'), self.__password.encode('utf-8'))

    
    def get_id(self) -> int:
        return self.id

    def get_type(self) -> str:
        return self.__user_type

    @staticmethod
    def add(user: User) -> int:

        existing_user : User = db.session.query(User).filter(User._User__email == user.get_email()).first()
        if existing_user:
            raise User.UserError.AlreadyExists()
        db.session.add(user)
        db.session.commit()
        return user.id
    
    def remove( user_id : int ):
        existing_user : User = db.session.query(User).filter(User.id == user_id).first()
        if not existing_user:
            raise User.UserError.NotFound()
        
        db.session.delete(existing_user)
        db.session.commit()

    @staticmethod
    def find(user_id: int = -1, email: str = None) -> User | list[User] | None:
        
        query = db.session.query(User)
        if user_id > 0:
            query = query.filter(User.id == user_id)
        if email:
            query = query.filter(User.__email == email)
        if user_id == -1 and email is None:
            users = query.all()  
            return users
        user = query.first()
        return user

    @staticmethod
    def auth(email: str, password: str) -> User | None:
        
        user = User.find(email=email)
        if user:
            if user.check_password(password):
                return user
