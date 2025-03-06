from __future__     import annotations

from models         import Base, SQLSession
from models.users.user   import User
from sqlalchemy     import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class Admin(User):

    __tablename__ = 'admins'

    id                = Column(Integer, ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {"polymorphic_identity": "admin"}

    def __init__(self, email, password, first_name, last_name):
        super().__init__(email, password, first_name, last_name)