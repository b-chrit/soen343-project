from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers import StakeholderController
from views.routes import stakeholder_only

class SponsorEventResource(Resource):
    @stakeholder_only
    def post(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument("event_id", type=int, required=True, help="Event ID is required")

        try:
            args = parser.parse_args()
            
            # The user_id from the JWT token is the stakeholder_id
            result = StakeholderController.sponsor_event(user_id, user_id, args["event_id"])

            return result, 200
        except Exception as e:
            code = getattr(e, "HTTP_code", 400)
            return {"status": "error", "message": str(e)}, code



class CancelSponsorshipResource(Resource):
    @stakeholder_only
    def delete(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument("event_id", type=int, required=True, help="Event ID is required")

        try:
            args = parser.parse_args()
            result = StakeholderController.cancel_sponsorship(user_id, args["event_id"])
            return result, 200
        except Exception as e:
            code = getattr(e, "HTTP_code", 400)
            return {"status": "error", "code": str(e)}, code


class CheckSponsorshipResource(Resource):
    @stakeholder_only
    def get(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument(
            "event_id", type=int, required=True,
            help="Event ID is required",
            location="args"  # Specify to read from URL parameters
        )

        try:
            args = parser.parse_args()
            is_sponsoring = StakeholderController.is_sponsoring_event(user_id, args["event_id"])
            return {"is_sponsoring": is_sponsoring}, 200
        except Exception as e:
            code = getattr(e, "HTTP_code", 400)
            return {"status": "error", "code": str(e)}, code
    
class SponsoredEventsResource(Resource):
    @stakeholder_only
    def get(self, user_id):
        try:
            # Get all events sponsored by this stakeholder
            sponsored_events = StakeholderController.get_sponsored_events(user_id)
            
            # Return the list of events
            return {"status": "success", "events": sponsored_events}, 200
        except Exception as e:
            code = getattr(e, "HTTP_code", 400)
            return {"status": "error", "message": str(e)}, code