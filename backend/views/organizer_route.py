from flask_restful  import Resource, reqparse
from controllers    import OrganizerController
from views.routes   import organizer_only
from flask_jwt_extended import jwt_required, get_jwt_identity

class GetOrganizerEventResource(Resource):
    @organizer_only
    def get(self, user_id : int ):
        return OrganizerController.get_event( user_id )
    

class RequestSponsorshipResource(Resource):
    @jwt_required()  # This ensures the request is authenticated with JWT
    def post(self):
        # Set up the request parser
        parser = reqparse.RequestParser()
        parser.add_argument("stakeholder_id", type=int, required=True, help="Stakeholder ID is required")
        parser.add_argument("event_id", type=int, required=True, help="Event ID is required")

        try:
            # Parse the arguments
            args = parser.parse_args()
            print("Parsed arguments:", args)  # Debugging statement

            # Extract the user_id from the JWT token
            user_id = get_jwt_identity()  # This will extract the user_id from the JWT token
            print("Extracted user_id from JWT:", user_id)  # Debugging statement

            # Pass user_id, stakeholder_id, and event_id to the controller function
            result = OrganizerController.request_sponsorship(user_id, args["stakeholder_id"], args["event_id"])
            print("Sponsorship request result:", result)  # Debugging statement

            # Return success message
            return {"status": "success", "message": result}, 200
        except Exception as e:
            # If there's an error, return an error message with HTTP code
            print("Error occurred:", str(e))  # Debugging statement
            code = getattr(e, "HTTP_code", 400)
            return {"status": "error", "message": str(e)}, code