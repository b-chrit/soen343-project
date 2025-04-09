from models import db

class SponsorshipRequest(db.Model):
    __tablename__ = 'sponsorship_requests'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    stakeholder_id = db.Column(db.Integer, db.ForeignKey('stakeholders.id'), nullable=False)
    status = db.Column(db.String, nullable=False, default="pending")  # could be "pending", "accepted", "rejected"

    # Relationships
    event = db.relationship('Event', backref='sponsorship_requests')
    stakeholder = db.relationship('Stakeholder', backref='sponsorship_requests')

    def __init__(self, event_id, stakeholder_id):
        self.event_id = event_id
        self.stakeholder_id = stakeholder_id
