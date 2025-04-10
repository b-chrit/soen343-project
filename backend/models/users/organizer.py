from __future__         import annotations
from .user  import User
from datetime import datetime
from ..event import Event
from models import db

class Organizer(User):

    class OrganizerError(Exception):
        class AlreadyHasEvent(Exception):
            HTTP_code = 400
            def __init__(self, message = "already_has_event"):
                super().__init__(message)

                
    __tablename__ = 'organizers'

    id                  = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    __phone_number      = db.Column(db.String, nullable=False)
    __organization_name = db.Column(db.String, nullable=False)
    __event_id          = db.Column(db.Integer, db.ForeignKey('events.id'), unique=True, nullable=True)  # One-to-One via ForeignKey

    __mapper_args__ = {"polymorphic_identity": "organizer"}

    def __init__(self, email: str, password: str, first_name: str, last_name: str, organization_name: str, phone_number: str) -> Organizer:
        super().__init__(email, password, first_name, last_name)
        self.__organization_name = organization_name
        self.__phone_number = phone_number

    def get_data(self) -> dict:
        data : dict = super().get_data()

        data['phone_number']        = self.__phone_number
        data['organization_name']   = self.__organization_name
        data['event_id']            = self.__event_id

        return data

    def set_phone_number(self, phone_number: str) -> None:
        self.__phone_number = phone_number

    def set_organization_name(self, organization_name: str) -> None:
        self.__organization_name = organization_name

    def get_id(self) -> int:
        return self.id

    def get_event_id(self) -> int:
        return self.__event_id

    def get_phone_number(self) -> str:
        return self.__phone_number

    def get_organization_name(self) -> str:
        return self.__organization_name

    def create_event(
        self,
        title: str,
        start: datetime,
        end: datetime,
        category: str,
        description: str,
        location: str,
        capacity: int,
        event_type: str,
        registration_fee : float,
        calendar_id: str = None,
        sponsor_id: int = None  # Optional if not always used
    ):
        new_event = Event(
            title=title,
            start=start,
            end=end,
            category=category,
            description=description,
            location=location,
            capacity=capacity,
            event_type=event_type,
            organizer_id=self.id,
            sponsor_id=sponsor_id,
            registration_fee= registration_fee,
            calendar_id=calendar_id
        )

        db.session.add(new_event)
        db.session.commit()

        self.__event_id = new_event.get_id()
        db.session.commit()

        return self.__event_id
