
from .controller            import Controller
from models                 import Attendee
import stripe

class PaymentController:

    class PaymentError(Exception):
        class InvalidClientSecret(Exception):
            def __init__(self, message : str = 'invalid_client_secret'):
                super().__init__(message)

        class InvalidUser(Exception):
            def __init__(self, message : str = 'invalid_user'):
                super().__init__(message)
        
        class InvalidEvent(Exception):
            def __init__(self, message : str = 'invalid_event'):
                super().__init__(message)

    def get_public_key() -> str:
        return Controller.stripe_public_key
    

    def create_stripe_customer ( first_name : str, last_name : str, email : str ):
        stripe_customer : stripe.Customer = stripe.Customer.create( email = email, name = f'{first_name} {last_name}')
        if not stripe_customer:
            ...

        return stripe_customer.id
    
    def create_payment_intent( amount : float, event_id : int, user_id : int ) -> str:
        
        attendee            : Attendee  = Attendee.find(user_id)
        stripe_customer_id  : str       = attendee.get_customer_id()
        

        formatted_amount    : int       = int(amount * 1.14975 * 100)
        
        payment_intent : stripe.PaymentIntent = stripe.PaymentIntent.create(
            amount                  = formatted_amount,
            customer                = stripe_customer_id,
            currency                = 'cad',
            payment_method_types    = ["card"],
            metadata                = {
                "user_id"   : user_id,
                "event_id"  : event_id
            }
        )

        return payment_intent.client_secret
    
    def confirm_registration( user_id : int, event_id : int,  client_secret : str):
        try:
            payment_intent_id : str = client_secret.split('_secret_')[0]
        except:
            raise PaymentController.PaymentError.InvalidClientSecret()

        payment_intent  : stripe.PaymentIntent  = stripe.PaymentIntent.retrieve(payment_intent_id)
        metadata        : stripe.StripeObject   = payment_intent.metadata

        print(payment_intent)
        if user_id != int(metadata['user_id']):
            raise PaymentController.PaymentError.InvalidUser()

        if event_id != int(metadata['event_id']):
            raise PaymentController.PaymentError.InvalidEvent()
        
        status : str = payment_intent.status
        print(status)

        if status == 'succeeded':
            return True

        return False
