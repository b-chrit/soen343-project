from __future__     import annotations

from models import db
from .user   import User


class Admin(User):

    __tablename__ = 'admins'

    id                = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {"polymorphic_identity": "admin"}

    def __init__(self, email, password, first_name, last_name):
        super().__init__(email, password, first_name, last_name)