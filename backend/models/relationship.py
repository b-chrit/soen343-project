from models import db

event_attendees = db.Table('event_attendees',
    db.Column('attendee_id',    db.Integer, db.ForeignKey('attendees.id'), primary_key=True),
    db.Column('event_id',       db.Integer, db.ForeignKey('events.id'), primary_key=True)
)