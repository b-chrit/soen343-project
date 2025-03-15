from __future__ import annotations
from models import Base, SQLSession
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Registration(Base):
    __tablename__ = 'registrations'

    id = Column(Integer, primary_key=True, autoincrement=True)
    attendee_id = Column(Integer, ForeignKey('attendees.id'), nullable=False)
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    attendee = relationship("Attendee", backref="registrations")
    event = relationship("Event", backref="registrations")

    def __init__(self, attendee_id: int, event_id: int):
        self.attendee_id = attendee_id
        self.event_id = event_id
