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

    @staticmethod
    def get_registrations_for_event(session, event_id: int, group_by: str = "day") -> list[dict]:
        """
        Get the number of registrations for a specific event, grouped by a time period.
        :param session: SQLAlchemy session
        :param event_id: The ID of the event
        :param group_by: The time period to group by ('day', 'week', 'month')
        :return: A list of dictionaries containing the date and registration count
        """
        from sqlalchemy import func

        # Define group function based on the 'group_by' parameter
        if group_by == "week":
            group_func = func.date_trunc('week', Registration.created_at)
        elif group_by == "month":
            group_func = func.date_trunc('month', Registration.created_at)
        else:
            group_func = func.date(Registration.created_at)  # Default is day

        # Query to group registrations by time period
        registration_data = (
            session.query(group_func, func.count(Registration.id).label("registrations"))
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
