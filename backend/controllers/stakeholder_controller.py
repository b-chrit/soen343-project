from models import Event, Stakeholder, User

class StakeholderController:

    def create_stakeholder(email: str, password: str, first_name: str, last_name: str):
        stakeholder = Stakeholder(email, password, first_name, last_name)
        Stakeholder.add(stakeholder)

    def sponsor_event(user_id: int, stakeholder_id: int, event_id: int):
        # Get the stakeholder by their ID
        stakeholder = Stakeholder.find(stakeholder_id)  # Ensure you're using the correct ID
        event = Event.find(event_id)

        if not stakeholder:
            raise User.UserError.NotFound()
        if not event:
            raise Event.EventError.NotFound()

        if event.get_sponsor():
            raise Event.EventError.AlreadySponsored()

        # Set the sponsor (stakeholder) to the event
        event.set_sponsor(stakeholder.get_id())

        return {"status": "sponsored", "event_id": event_id}


    def cancel_sponsorship(user_id: int, event_id: int):
        stakeholder = Stakeholder.find(user_id)
        event = Event.find(event_id)

        if not stakeholder:
            raise User.UserError.NotFound()
        if not event:
            raise Event.EventError.NotFound()

        if event.get_sponsor() != stakeholder.get_id():
            raise Event.EventError.NotSponsoredByUser()

        event.remove_sponsor()

        return {"status": "sponsorship cancelled", "event_id": event_id}

    def is_sponsoring_event(user_id: int, event_id: int) -> bool:
        stakeholder = Stakeholder.find(user_id)
        event = Event.find(event_id)

        if not stakeholder:
            raise User.UserError.NotFound()
        if not event:
            raise Event.EventError.NotFound()

        return event.get_sponsor() == stakeholder.get_id()

    def get_all_stakeholders():
        stakeholders = Stakeholder.query.all()
        return stakeholders
    
    def get_sponsored_events(stakeholder_id: int):  
        stakeholder = Stakeholder.find(stakeholder_id)
        if not stakeholder:
            raise User.UserError.NotFound()
    

        all_events = Event.find()
        sponsored_events = [event for event in all_events if event.get_sponsor() == stakeholder_id]

        events_data = []
        for event in sponsored_events:
            events_data.append(event.get_data())
    
        return events_data