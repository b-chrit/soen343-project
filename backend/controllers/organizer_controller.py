from models import Organizer, Event, SponsorshipRequest, db, Stakeholder

from datetime import datetime

class OrganizerController:

    def create_organizer( email : str, password : str, first_name : str, last_name : str, organization_name : str, phone_number : str):
        organizer : Organizer = Organizer(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            organization_name=organization_name,
            phone_number=phone_number
        )

        organzier_id = Organizer.add(organizer)

        return organzier_id
    
    def get_event( user_id : int ):
        print(user_id)
        organizer : Organizer = Organizer.find(user_id=user_id)
        if not organizer:
            raise Organizer.UserError.NotFound()
        
        event_id = organizer.get_event_id()
        if not event_id:
            return []
        event : Event = Event.find(event_id=event_id)


        return [event.get_data()]
    

    @staticmethod
    def request_sponsorship(user_id, stakeholder_id, event_id):
        # Ensure the organizer is associated with the event
        event = Event.find(event_id)
        if not event:
         raise Exception("You are not authorized to request sponsorship for this event.")
    
        # Ensure the stakeholder exists
        stakeholder = Stakeholder.query.filter_by(id=stakeholder_id).first()
        if not stakeholder:
            raise Exception("Stakeholder not found.")

        # Check if the sponsorship request already exists
        existing_request = SponsorshipRequest.query.filter_by(event_id=event_id, stakeholder_id=stakeholder_id).first()
        if existing_request:
            raise Exception("Sponsorship request already exists.")

        # Create a new sponsorship request
        new_request = SponsorshipRequest(event_id=event_id, stakeholder_id=stakeholder_id)
    
        db.session.add(new_request)
        db.session.commit()

        return "Sponsorship request sent successfully!"
