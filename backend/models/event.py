from __future__ import annotations
from models import Base, SQLSession
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Event(Base):
    __tablename__ = 'events'

    # Table columns
    id               = Column(Integer, primary_key=True, autoincrement=True)
    __title          = Column(String, nullable=False)
    __start          = Column(DateTime, nullable=False)
    __end            = Column(DateTime, nullable=False)
    __category       = Column(String, nullable=False)
    __description    = Column(String, nullable=False)
    __location       = Column(String, nullable=False)

    __capacity       = Column(Integer, nullable=False, default=100)
    __registrations  = Column(Integer, nullable=False, default=0)
    __event_type     = Column(String, nullable=False, default="In-person")

    __organizer_id   = Column(Integer, ForeignKey('organizers.id'), nullable=False)
    __sponsor_id     = Column(Integer, ForeignKey('stakeholders.id'), nullable=True)

    # Relationships
    sponsor = relationship("Stakeholder", backref="sponsored_events", uselist=False)

    # Constructor
    def __init__(
        self,
        title: str,
        start: datetime,
        end: datetime,
        category: str,
        description: str,
        location: str,
        organizer_id: int,
        sponsor_id: int = None,
        capacity: int = 100,
        event_type: str = "In-person",
        registrations: int = 0
    ):
        self.__title = title
        self.__start = start
        self.__end = end
        self.__category = category
        self.__description = description
        self.__location = location
        self.__organizer_id = organizer_id
        self.__sponsor_id = sponsor_id
        self.__capacity = capacity
        self.__event_type = event_type
        self.__registrations = registrations

    # -------------------------------------------
    # ✅ STATIC METHODS (CRUD)
    # -------------------------------------------

    # ✅ Find all events by organizer ID
    @staticmethod
    def find_all_by_organizer(session, organizer_id: int) -> list[Event]:
        return session.query(Event).filter(Event.__organizer_id == organizer_id).all()

    # ✅ Find an event by event ID
    @staticmethod
    def find_by_id(session, event_id: int) -> Event | None:
        return session.query(Event).filter(Event.id == event_id).first()

    # ✅ Find method: return a list or single event based on params
    @staticmethod
    def find(session, event_id: int = -1, user_id: int = -1) -> list[Event] | Event | None:
        query = session.query(Event)

        if user_id > 0:
            query = query.filter(Event.__organizer_id == user_id)
        if event_id > 0:
            query = query.filter(Event.id == event_id)

        if user_id == -1 and event_id == -1:
            return query.all()

        return query.first()

    # ✅ Add an event to the session
    @staticmethod
    def add(session, event: Event) -> None:
        session.add(event)
        session.commit()

    # -------------------------------------------
    # ✅ GETTERS
    # -------------------------------------------
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
        return self.__registrations

    def get_event_type(self) -> str:
        return self.__event_type

    def get_organizer(self) -> int:
        return self.__organizer_id

    def get_sponsor(self) -> int:
        return self.__sponsor_id

    # -------------------------------------------
    # ✅ SETTERS
    # -------------------------------------------
    def set_title(self, title: str) -> None:
        self.__title = title

    def set_start(self, start: datetime) -> None:
        self.__start = start

    def set_end(self, end: datetime) -> None:
        self.__end = end

    def set_category(self, category: str) -> None:
        self.__category = category

    def set_description(self, description: str) -> None:
        self.__description = description

    def set_location(self, location: str) -> None:
        self.__location = location

    def set_capacity(self, capacity: int) -> None:
        self.__capacity = capacity

    def set_event_type(self, event_type: str) -> None:
        self.__event_type = event_type

    def set_registrations(self, registrations: int) -> None:
        self.__registrations = registrations
