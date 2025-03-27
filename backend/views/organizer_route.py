from flask_restful  import Resource, reqparse
from controllers    import OrganizerController
from views.routes   import organizer_only


class GetOrganizerEventResource(Resource):
    @organizer_only
    def get(self, user_id : int ):
        return OrganizerController.get_event( user_id )