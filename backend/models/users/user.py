from    __future__      import annotations
from    sqlalchemy      import Column, Integer, String
from    models          import Base, SQLSession
# from    models.users.organizer    import Organizer
import  bcrypt

class User(Base):
    __tablename__ = 'users'

    id            = Column(Integer,   primary_key = True, autoincrement   = True)
    __email         = Column(String,    unique      = True, nullable        = False)
    __password      = Column(String,    nullable    = False)
    __first_name    = Column(String,    nullable    = False)
    __last_name     = Column(String,    nullable    = False)

    __user_type     = Column(String) 
    
    __mapper_args__ = {"polymorphic_identity": "user", "polymorphic_on": __user_type}


    def __init__(self, email : str, password : str, first_name : str, last_name : str):
        self.__email        = email
        self.__first_name   = first_name
        self.__last_name    = last_name
        self.set_password(password)


    def set_password(self, plain_text_password: str) -> None:
        hashed = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
        self.__password = hashed.decode('utf-8')
    
    def check_password(self, plain_text_password: str) -> bool:
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), self.__password.encode('utf-8'))

    def set_email(self, email : str) -> None:
        self.__email = email

    def set_first_name(self, first_name : str) -> None:
        self.__first_name = first_name

    def set_last_name(self, last_name : str) -> None:
        self.__last_name = last_name


    def get_id(self) -> int:
        return self.id
    
    def get_first_name(self) -> str:
        return self.__first_name
    
    def get_last_name(self) -> str:
        return self.__last_name
    
    def get_email(self) -> str:
        return self.__email
    
    def get_type(self) -> str:
        return self.__user_type


    @staticmethod
    def add(session, user : User):
        session.add(user)
        session.commit()

    @staticmethod
    def find(session, user_id: int = -1, email : str = None) -> list[User] | User | None:
        
        query = session.query(User)
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
    def auth(session, email : str, password : str) -> User | None:
        user : User = User.find(session, email = email)
        if user:
            if user.check_password(password):
                return user
                 