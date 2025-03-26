from flask_restful  import Resource, reqparse
from controllers    import AttendeeController, EventController
from views.routes   import attendee_only

from models         import Event, Attendee

class RegisterToEventResource(Resource):
    @attendee_only
    def post(self, user_id : int):

        parser = reqparse.RequestParser()
        parser.add_argument( "event_id", type=int, required=True, help="event_id is required" )
        parser.add_argument( "client_secret", type=str, required=False)
        
        try:
            args = parser.parse_args()

            print(args)

            response : dict = EventController.register_to_event(user_id, args['event_id'], args.get('client_secret'))

            if response.get('client_secret'):
                return {
                    'status'        : 'payment_required',
                    'client_secret' : response['client_secret']
                }, 200
            
            return {
                'status': 'registered',
                'message': 'Successfully registered for the event'
            }, 201
        
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400

class GetRegisteredEventsResource(Resource):
    @attendee_only
    def get( self, user_id : int ):        
        try:
            return EventController.get_registered_events( user_id ), 200
        
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400

class CancelRegistration(Resource):
    @attendee_only
    def post(self, user_id : int ):
        parser = reqparse.RequestParser()
        parser.add_argument( 'event_id', type = int, required = True, help = 'Event_id required' )

        try:
            args = parser.parse_args()
            EventController.cancel_event_registration( user_id, args['event_id'])
            return {'status' : 'cancelled'}
        except Exception as e:
            print(e)
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400

class CheckRegistration(Resource):
    @attendee_only
    def get(self, user_id : int):
        parser = reqparse.RequestParser()
        parser.add_argument( 'event_id', location = 'args', type = int, required = True, help = 'Event_id required' )

        try:
            args = parser.parse_args()

            is_registered : bool = EventController.is_registered_to_event( user_id, args['event_id'])

            return {
                'status'        : 'ok',
                'is_registered' : is_registered
            }, 200

        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
