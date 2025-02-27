from database import SessionLocal, Organizer




def create_organizer( name : str, email : str, password : str, phone : str):
    session =  SessionLocal()
    new_organizer = Organizer(name = name, email = email, password = password, phone = phone)
    session.add(new_organizer)
    session.commit()
    session.close()

def get_organizer( id : int):
    try:
        session =  SessionLocal()
        organizer = session.query(Organizer).filter(Organizer.id == id).first()
        return organizer
    except:
        pass
    finally:
        session.close()
