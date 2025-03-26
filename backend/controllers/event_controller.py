from models         import Event, User, Organizer, Stakeholder, Attendee, db
from controllers    import PaymentController

from datetime       import datetime

class EventController:
    

    def create_event( user_id : int, title : str, start : str, end : str, category : str, description : str, location : str, capacity : int, event_type : str, registration_fee : float = 0.00):
        organizer : Organizer = Organizer.find(user_id)

        if not organizer:
            raise User.UserError.NotFound()
        
        if organizer.get_event_id():
            raise Organizer.OrganizerError.AlreadyHasEvent()

        start_time  : datetime = datetime.strptime(start, "%Y-%m-%dT%H:%M")
        end_time    : datetime = datetime.strptime(end, "%Y-%m-%dT%H:%M")

        event_id = organizer.create_event( 
            title       = title,
            start       = start_time,
            end         = end_time,
            category    = category,
            description = description,
            location    = location,
            capacity    = capacity,
            event_type  = event_type,
            registration_fee = registration_fee
        )

        return event_id
    
    def cancel_event_registration( user_id : int, event_id : int ) :
        attendee    : Attendee  = Attendee.find(user_id)
        event       : Event     = Event.find(event_id)

        if not attendee:
            raise User.UserError.NotFound()
        if not event:
            raise Event.EventError.NotFound()
        
        if event not in attendee.get_events():
            ...
        
        event.remove_registration( attendee )

    def register_to_event( user_id : int, event_id : int, client_secret : str = None) -> bool | dict[str]:

        attendee    : Attendee  = Attendee.find(user_id)
        event       : Event     = Event.find(event_id)

        if not attendee:
            raise User.UserError.NotFound()
        if not event:
            raise Event.EventError.NotFound()
        
        if event in attendee.get_events():
            raise Attendee.AttendeeError.AlreadyRegisteredToEvent()
        
        if client_secret:
            payment_succeeded : bool = PaymentController.confirm_registration( user_id, event_id, client_secret )

            if payment_succeeded:
                event.add_registration(attendee)
                return { 'client_secret' : None }
            
            return { 'client_secret' : client_secret }

        if event.get_capacity() <= len(event.get_registrations()):
            raise Event.EventError.Full()
        
        if event.get_fee() > 0:
            client_secret : str = PaymentController.create_payment_intent(event.get_fee(), event_id, user_id)

            return { 'client_secret' : client_secret }

        event.add_registration(attendee)
        
        return { 'client_secret' : None }

    def get_event( event_id : int ):
        event : Event = Event.find( event_id = event_id)

        if not event:
            raise Event.EventError.NotFound()

        return event.get_data()
    
    def get_available_events():
        
        event_data  : list          = []
        events      : list[Event]   = Event.find()

        for event in events:
            event_data.append(event.get_data())

        return event_data
    

    def is_registered_to_event( user_id : int, event_id : int) -> bool:

        attendee    : Attendee  = Attendee.find(user_id)
        event       : Event     = Event.find(event_id)

        if not event:
            raise Event.EventError.NotFound()
        
        if not attendee:
            raise User.UserError.NotFound()
        
        registered_events : list[Event] = attendee.get_events()

        if event in registered_events:
            return True
        return False
    

    def get_registered_events( user_id : int ) -> list[Event]:

        events_data : list      = []
        attendee    : Attendee  = User.find(user_id=user_id)

        if not attendee:
            raise User.UserError.NotFound()
        
        registered_events : list[Event] = attendee.get_events()

        for event in registered_events:
            events_data.append(event.get_data())

        return events_data
    
    def delete_event( event_id : int ):
        Event.remove( event_id )

    def edit_event (event_id : int, title : str, start : str, end : str, category : str, description : str, location : str, capacity : int, event_type : str, registration_fee : float):
        event : Event = Event.find(event_id=event_id)

        if not event:
            raise Event.EventError.NotFound()
        
        start_time  : datetime = datetime.strptime(start, "%Y-%m-%dT%H:%M")
        end_time    : datetime = datetime.strptime(end, "%Y-%m-%dT%H:%M")
        
        event.set_title(title)
        event.set_start(start_time)
        event.set_end(end_time)
        event.set_category(category)
        event.set_description(description)
        event.set_location(location)
        event.set_capacity(capacity)
        event.set_event_type(event_type)
        event.set_fee(registration_fee)