from database import SessionLocal, Organizer, Attendee




def create_organizer( name : str, email : str, password : str, phone : str):
    session =  SessionLocal()
    new_organizer = Organizer(name = name, email = email, password = password, phone = phone)
    session.add(new_organizer)
    session.commit()
    session.close()

def get_organizer( id : int = -1, email : str = ""):

    if (id > 0) or email != None:
        try:
            session =  SessionLocal()
            organizer = session.query(Organizer)
            if (id > 0):
                organizer = organizer.filter(Organizer.id == id)
            if email:
                organizer = organizer.filter(Organizer.email == email)
                
            return organizer.first()
        except:
            pass
        finally:
            session.close()

def get_attendee( id : int = -1, email : str = ""):

    if (id > 0) or email != None:
        try:
            session =  SessionLocal()
            attendee = session.query(Attendee)
            if (id > 0):
                attendee = attendee.filter(Attendee.id == id)
            if email:
                attendee = attendee.filter(Attendee.email == email)
                
            return attendee.first()
        except:
            pass
        finally:
            session.close()


def auth ( type : str, email : str, password : str ) -> tuple[int, str]:
    '''
    Return the id of the user if the email and password combination is valid
    '''

    error_status : str = 'invalid_type'

    if type == 'organizer':
        organizer = get_organizer(email=email)
        if organizer:
            if organizer.check_password(password):
                return organizer.id, 'ok'
            
        error_status = 'invalid_email_password'

    if type == 'attendee':
        attendee = get_attendee(email=email)
        if attendee:
            if attendee.check_password(password):
                return attendee.id, 'ok'
            
        error_status = 'invalid_email_password'

    if type == 'stakeholder':
        pass
    if type == 'admin':
        pass

    return -1, error_status
