from    models      import User, Attendee, Event, db
from    controllers import Controller


from controllers import PaymentController

class AttendeeController:


    def create_attendee( email : str, password : str, first_name : str, last_name : str):

        new_attendee        : Attendee  = Attendee( email = email, password = password, first_name = first_name, last_name = last_name)
        stripe_customer_id  : str       = PaymentController.create_stripe_customer( first_name = first_name, last_name = last_name, email = email )
        
        new_attendee.set_customer_id( stripe_customer_id = stripe_customer_id )
        user_id : int  = Attendee.add(new_attendee)
        return user_id
    
    def get_attendee( user_id : int ):

        attendee : Attendee = User.find(user_id=user_id)
        if not attendee:
            raise User.UserError.NotFound()
        return attendee


