from models import Admin
class AdminController:

    def create_admin(email : str, password : str, first_name : str, last_name : str):
        stakeholder : Admin = Admin(email, password, first_name, last_name)
        Admin.add(stakeholder)