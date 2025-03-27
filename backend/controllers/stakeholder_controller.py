from models import Stakeholder
class StakeholderController:

    def create_stakeholder(email : str, password : str, first_name : str, last_name : str):
        stakeholder : Stakeholder = Stakeholder(email, password, first_name, last_name)
        Stakeholder.add(stakeholder)