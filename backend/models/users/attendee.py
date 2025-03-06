from __future__     import annotations

from models         import Base, SQLSession
from models.users.user   import User
from sqlalchemy     import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Attendee(User):
    __tablename__ = 'attendees'

    id                = Column(Integer, ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {"polymorphic_identity": "attendee"}