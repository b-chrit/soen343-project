from __future__     import annotations

from models import db

from models   import User


class Stakeholder(User):
    __tablename__ = 'stakeholders'

    id                = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)

    __mapper_args__ = {"polymorphic_identity": "stakeholder"}