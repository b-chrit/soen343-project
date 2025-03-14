from __future__ import annotations
from models import Base, SQLSession
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Event(Base):
    __tablename__ = 'events'

    id              = Column(Integer,   primary_key = True, autoincrement=True)
    __title         = Column(String,    nullable    = False)
    __start         = Column(DateTime,  nullable    = False)
    __end           = Column(DateTime,  nullable    = False)
    __category      = Column(String,    nullable    = False)
    __description   = Column(String,    nullable    = False)
    __location      = Column(String,    nullable    = False)

    __organizer_id  = Column(Integer, ForeignKey('organizers.id'), unique=True)
    __sponsor_id    = Column(Integer, ForeignKey('stakeholders.id'), nullable=True)  # FK to Stakeholder (Sponsor)

    sponsor = relationship("Stakeholder", backref="sponsored_events", uselist=False)  # Relationship with Stakeholder

    def __init__(self, title: str, start: datetime, end: datetime, category: str, description: str, location: str, organizer_id: int, sponsor_id: int = None):
        self.__title = title
        self.__start = start
        self.__end = end
        self.__category = category
        self.__location = location
        self.__description = description
        self.__organizer_id = organizer_id
        self.__sponsor_id = sponsor_id

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

    @staticmethod
    def add(session, event: Event) -> None:
        session.add(event)
        session.commit()

    def get_id(self) -> str:
        return self.id

    def get_title(self) -> str:
        return self.__title

    def get_start(self) -> datetime:
        return self.__start

    def get_end(self) -> datetime:
        return self.__end

    def get_category(self) -> str:
        return self.__category

    def get_location(self) -> str:
        return self.__location

    def get_description(self) -> str:
        return self.__description

    def get_organizer(self) -> int:
        return self.__organizer_id

    def get_sponsor(self) -> int:
        return self.__sponsor_id  # Sponsor ID for accessing the sponsor

    def set_title(self, title: str) -> None:
        self.__title = title

    def set_start(self, start: datetime) -> None:
        self.__start = start

    def set_end(self, end: datetime) -> None:
        self.__end = end

    def set_category(self, category: str) -> None:
        self.__category = category

    def set_location(self, location: str) -> None:
        self.__location = location

    def set_description(self, description) -> None:
        self.__description = description
