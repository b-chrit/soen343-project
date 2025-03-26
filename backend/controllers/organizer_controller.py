from models import Organizer, Event

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