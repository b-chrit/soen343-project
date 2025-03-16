from __future__         import annotations
from models             import SQLSession
from models.event       import Event
from models.users.user  import User
from sqlalchemy         import Column, Integer, String, ForeignKey
from sqlalchemy.orm     import relationship
from datetime           import datetime


class Organizer(User):
    __tablename__ = 'organizers'

    id                  = Column(Integer, ForeignKey('users.id'), primary_key=True)
    __phone_number      = Column(String, nullable=False)
    __organization_name = Column(String, nullable=False)
    __event_id          = Column(Integer, ForeignKey('events.id'), unique=True, nullable=True)  # One-to-One via ForeignKey

    __mapper_args__ = {"polymorphic_identity": "organizer"}



    @staticmethod
    def add( organizer : Organizer):
        session = SQLSession()
        session.add(organizer)
        session.commit()
        session.close()
            

    def __init__(self, email : str, password : str, first_name : str, last_name : str, organization_name : str, phone_number : str) -> Organizer:
        
        super().__init__(email, password, first_name, last_name)
        self.__organization_name    = organization_name
        self.__phone_number         = phone_number

    def set_phone_number( self, phone_number : str ) -> None:
        self.__phone_number = phone_number
    
    def set_organization_name( self, organization_name : str ) -> None:
        self.__organization_name = organization_name

    
    def get_id( self ) -> int:
        return self.id
    
    def get_event_id( self ) -> int:
        return self.__event_id

    def get_phone_number( self ) -> str:
        return self.__phone_number
    
    def get_organization_name( self ) -> str:
        return self.__organization_name

    def create_event(self, session, title: str, start: datetime, end: datetime, category: str, description: str, location: str, sponsor_id: int):
        new_event = Event(
            title=title, 
            start=start, 
            end=end, 
            category=category, 
            description=description, 
            location=location, 
            organizer_id=self.id, 
            sponsor_id=sponsor_id  # Pass the sponsor_id here
        )
        session.add(new_event)
        session.commit()
        self.__event_id = new_event.get_id()
        session.commit()
