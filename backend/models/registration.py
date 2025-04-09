from models import db
from datetime import datetime

class Registration(db.Model):
    __tablename__ = 'registrations'

    attendee_id = db.Column(db.Integer, db.ForeignKey('attendees.id'), primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), primary_key=True)
    registration_time = db.Column(db.DateTime, default=datetime.now)

    attendee = db.relationship("Attendee", back_populates="registrations")
    event = db.relationship("Event", back_populates="registrations")


    def find( attendee_id : int = -1, event_id : int = -1 ):
        query = db.session.query(Registration)

        if attendee_id > 0:
            query.filter(Registration.attendee_id == attendee_id)
        if event_id > 0:
            query.filter(Registration.event_id == event_id)

        if (attendee_id > 0) and (event_id > 0):
            return query.first()
        
        return query.all()


    def get_analytics(event_id: int, group_by: str = "day") -> list[dict]:
        """
        Get the number of registrations for a specific event, grouped by a time period.
        :param session: SQLAlchemy session
        :param event_id: The ID of the event
        :param group_by: The time period to group by ('day', 'week', 'month')
        :return: A list of dictionaries containing the date and registration count
        """


        # Define group function based on the 'group_by' parameter
        if group_by == "week":
            group_func = db.func.date_trunc('week', Registration.registration_time)
        elif group_by == "month":
            group_func = db.func.date_trunc('month', Registration.registration_time)
        else:
            group_func = db.func.date(Registration.registration_time)  # Default is day

        # Query to group registrations by time period
        registration_data = (
            db.session.query(group_func, db.func.count().label("registrations"))
            .filter(Registration.event_id == event_id)
            .group_by(group_func)
            .order_by(group_func)
            .all()
        )

        # Format the result
        return [
            {"date": str(date), "registrations": registrations}
            for date, registrations in registration_data
        ]