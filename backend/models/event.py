from __future__ import annotations

from models import db
from .users.attendee import Attendee

from models.relationship import event_attendees
from datetime import datetime

class Event(db.Model):

    class EventError(Exception):
        
        class Full(Exception):
            HTTP_code : str = 400
            def __init__(self, message = "event_full"):
                super().__init__(message)

        class NotFound(Exception):
            HTTP_Code : str = 404
            def __init__(self, message = "event_not_found"):
                super().__init__(message)

    
    __tablename__ = 'events'

    id                  = db.Column(db.Integer,     primary_key=True, autoincrement=True)
    __title             = db.Column('title', db.String,      nullable=False)
    __start             = db.Column('start', db.DateTime,    nullable=False)
    __end               = db.Column('end', db.DateTime,    nullable=False)
    __category          = db.Column('category', db.String,      nullable=False)
    __description       = db.Column('description', db.String,      nullable=False)
    __location          = db.Column('location', db.String,      nullable=False)

    __capacity          = db.Column('capacity', db.Integer,     nullable=False, default = 100)
    __event_type        = db.Column('event_type', db.String,      nullable=False, default = "In-person")
    __registration_fee  = db.Column('registration_fee', db.Float,       nullable=False, default = 0.00)

    __organizer_id      = db.Column('organizer_id', db.Integer,     db.ForeignKey('organizers.id'), nullable=False)
    __sponsor_id        = db.Column('sponsor_id', db.Integer,     db.ForeignKey('stakeholders.id'), nullable=True)

    registrations     = db.relationship('Attendee', secondary='event_attendees', back_populates='events')

    # Relationships
    #sponsor = db.relationship("Stakeholder", backref="sponsored_events", uselist=False)

    # Constructor
    def __init__( self, title: str, start: datetime, end: datetime, category: str, description: str, location: str, registration_fee : float, organizer_id: int, sponsor_id: int = None, capacity: int = 100, event_type: str = "In-person", registrations: int = 0 ):
        
        self.__title            = title
        self.__start            = start
        self.__end              = end
        self.__category         = category
        self.__description      = description
        self.__location         = location
        self.__organizer_id     = organizer_id
        self.__sponsor_id       = sponsor_id
        self.__capacity         = capacity
        self.__event_type       = event_type
        self.__registration_fee = registration_fee



    @staticmethod
    def find_all_by_organizer(organizer_id: int) -> list[Event]:
        return db.session.query(Event).filter(Event.__organizer_id == organizer_id).all()


    @staticmethod
    def find(event_id: int = -1, user_id: int = -1) -> list[Event] | Event | None:
        query = db.session.query(Event)

        if user_id > 0:
            query = query.filter(Event.__organizer_id == user_id)
        if event_id > 0:
            query = query.filter(Event.id == event_id)

        if user_id == -1 and event_id == -1:
            return query.all()

        return query.first()

    
    @staticmethod
    def add(event : Event) -> None:
        db.session.add(event)
        db.session.commit()

    @staticmethod
    def remove( event_id : int ):
        event : Event = Event.find(event_id=event_id)

        if not event:
            raise Event.EventError.NotFound()
        
        db.session.remove(event)
        db.session.commit()

  
    def get_data(self) -> dict:
        from .users.organizer import Organizer
        organizer : Organizer = Organizer.find(user_id=self.__organizer_id)
        data : dict = {
            'id'                : self.id,
            'title'             : self.__title,
            'description'       : self.__description,
            'category'          : self.__category,
            'location'          : self.__location,
            'start'             : str(self.__start),
            'end'               : str(self.__end),
            'capacity'          : self.__capacity,
            'registrations'     : len(self.registrations),
            'event_type'        : self.__event_type,
            'organizer_name'    : f'{organizer.get_first_name()} {organizer.get_last_name()}',
            'organization_name' : organizer.get_organization_name(),
            'sponsor_name'      : self.__sponsor_id,
            'sponsored'         : True if self.__sponsor_id else False,
            'fee'               : self.__registration_fee
        }
        return data

    def get_id(self) -> int:
        return self.id

    def get_title(self) -> str:
        return self.__title

    def get_start(self) -> datetime:
        return self.__start

    def get_end(self) -> datetime:
        return self.__end

    def get_category(self) -> str:
        return self.__category

    def get_description(self) -> str:
        return self.__description

    def get_location(self) -> str:
        return self.__location

    def get_capacity(self) -> int:
        return self.__capacity

    def get_registrations(self) -> int:
        return self.registrations

    def get_event_type(self) -> str:
        return self.__event_type

    def get_organizer(self) -> int:
        return self.__organizer_id

    def get_sponsor(self) -> int:
        return self.__sponsor_id
    
    def get_fee(self) -> float:
        return self.__registration_fee
 
    

    def set_title(self, title: str) -> None:
        self.__title = title
        db.session.commit()

    def set_start(self, start: datetime) -> None:
        self.__start = start
        db.session.commit()

    def set_end(self, end: datetime) -> None:
        self.__end = end
        db.session.commit()

    def set_category(self, category: str) -> None:
        self.__category = category
        db.session.commit()

    def set_description(self, description: str) -> None:
        self.__description = description
        db.session.commit()

    def set_location(self, location: str) -> None:
        self.__location = location
        db.session.commit()

    def set_capacity(self, capacity: int) -> None:
        self.__capacity = capacity
        db.session.commit()

    def set_event_type(self, event_type: str) -> None:
        self.__event_type = event_type
        db.session.commit()

    def set_registrations(self, registrations: int) -> None:
        self.registrations = registrations
        db.session.commit()
    
    def add_registration(self, attendee : Attendee):
        self.registrations.append(attendee)
        db.session.commit()
    def remove_registration(self, attendee : Attendee):
        self.registrations.remove(attendee)
        db.session.commit()

    def set_fee(self, fee : float):
        self.__registration_fee = fee
        db.session.commit()
