from flask_restful  import Resource, reqparse
from controllers    import EventController
from views.routes   import organizer_only

from flask import request

class CreateEventResource(Resource):
    @organizer_only
    def post(self, user_id):

        parser = reqparse.RequestParser()

        parser.add_argument(    "title",            type = str,     required=True, help="Email is required"         )
        parser.add_argument(    "start",            type = str,     required=True, help="Start time is required"    )
        parser.add_argument(    "end",              type = str,     required=True, help="End time is required"      )
        parser.add_argument(    "category",         type = str,     required=True, help="Category is required"      )
        parser.add_argument(    "description",      type = str,     required=True, help="Description is required"   )
        parser.add_argument(    "location",         type = str,     required=True, help="Location is required"      )
        parser.add_argument(    "capacity",         type = int,     required=True, help="Capacity is required"      )
        parser.add_argument(    "event_type",       type = str,     required=True, help="Event_type is required"    )
        parser.add_argument(    "registration_fee", type = float,   required=False                                  )
        try:
            args = parser.parse_args()

            registration_fee : float = 0.0 if not args.get('registration_fee') else args['registration_fee']
            event_id : int = EventController.create_event( 
                user_id             = user_id,
                title               = args ['title'],
                start               = args ['start'],
                end                 = args ['end'],
                category            = args ['category'],
                description         = args ['description'],
                location            = args ['location'],
                capacity            = args ['capacity'],
                event_type          = args ['event_type'],
                registration_fee    = registration_fee,
            )
            return {
                'status'    : 'created',
                'event_id'  : event_id
            }, 201
        
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
class DeleteEventResource(Resource):
    @organizer_only
    def delete(self, user_id : int):
        parser = reqparse.RequestParser()
        parser.add_argument( "event_id", type=int, required=True, help="event_id is required" )
        
        try:
            args = parser.parse_args()
            EventController.delete_event(args['event_id'])
            return {'status' : 'deleted'}, 200
            
        except Exception as e:
            print(e)
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
        
class EditEventResource(Resource):
    @organizer_only
    def put(self, user_id):

        print(request.get_json())
        parser = reqparse.RequestParser()

        parser.add_argument(    "event_id",         type = int,     required=True, help="Event_id is required"      )
        parser.add_argument(    "title",            type = str,     required=True, help="Email is required"         )
        parser.add_argument(    "start",            type = str,     required=True, help="Start time is required"    )
        parser.add_argument(    "end",              type = str,     required=True, help="End time is required"      )
        parser.add_argument(    "category",         type = str,     required=True, help="Category is required"      )
        parser.add_argument(    "description",      type = str,     required=True, help="Description is required"   )
        parser.add_argument(    "location",         type = str,     required=True, help="Location is required"      )
        parser.add_argument(    "capacity",         type = int,     required=True, help="Capacity is required"      )
        parser.add_argument(    "event_type",       type = str,     required=True, help="Event_type is required"    )
        parser.add_argument(    "registration_fee", type = float,   required=True, help="registration_fee required" )

        try:
            args = parser.parse_args()
            
            EventController.edit_event( 
                args["event_id"],
                args["title"], 
                args["start"], 
                args["end"], 
                args["category"], 
                args["description"], 
                args["location"], 
                args["capacity"], 
                args["event_type"], 
                args["registration_fee"]
                )
            return {'status':'editted'}
        except Exception as e:
            print(e)
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
           
class GetEventResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument( 'event_id', location = 'args', type = int, required = False )
        
        try:
            args        : reqparse.Namespace    = parser.parse_args()
            event_id    : int                   = args.get('event_id')


            if event_id:
                return EventController.get_event( event_id ), 200

            aa = EventController.get_available_events()
            print(aa)
            return aa, 200
        
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400
        
class GetAnalyticsResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument( 'event_id', location = 'args', type = int, required = True )
        parser.add_argument( 'group_by', location = 'args', type = str, required = False )
        try:
            args        : reqparse.Namespace    = parser.parse_args()
            event_id    : int                   = args.get('event_id')
            group_by    : str                   = args.get('group_by')
            if not group_by:
                group_by = 'day'
            analytics = {'registrations_over_time' :EventController.get_analytics( event_id, group_by )}
            return analytics, 200
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400



class GetCalendarResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument( 'event_id', location = 'args', type = int, required = True )
        try:
            args        : reqparse.Namespace    = parser.parse_args()
            event_id    : int                   = args.get('event_id')
            
            calendar = {'calendar' :EventController.get_calendar( event_id )}
            return calendar, 200
        except Exception as e:
            HTTP_code : str = getattr(e, 'HTTP_code', None)
            return {
                'status'    : 'error',
                'code'      : str(e)
            }, HTTP_code if HTTP_code else 400