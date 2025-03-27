from flask_restful  import Resource, reqparse
from controllers    import PaymentController

class PublicKeyResource(Resource):
    def get(self):
        return {'stripe_public_key' : PaymentController.get_public_key()}, 200