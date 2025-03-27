from __future__     import annotations

from models import db
from .user  import User
from models.relationship import event_attendees


class Attendee(User):

    class AttendeeError(Exception):

        class AlreadyRegisteredToEvent(Exception):
            def __init__(self, message : str = 'already_registered_to_event'):
                super().__init__(message)
            
    __tablename__ = 'attendees'

    id                      = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    __stripe_customer_id    = db.Column('stripe_customer_id', db.String)

    events = db.relationship('Event', secondary='event_attendees', back_populates='registrations')

    __mapper_args__ = {"polymorphic_identity": "attendee"}

    def __init__(self, email : str, password : str, first_name : str, last_name : str):
        super().__init__(email, password, first_name, last_name)

    
    def get_customer_id(self):
        return self.__stripe_customer_id
    
    def set_customer_id(self, stripe_customer_id):
        self.__stripe_customer_id = stripe_customer_id

    def get_events(self):
        return self.events

    