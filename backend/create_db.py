from models.config import Base, engine
from models import Event, SQLSession
from datetime import datetime


from models.users import *


Base.metadata.create_all(engine)

with SQLSession() as session:
    u1 : User = User('mb@gmail.com', '123test', 'Maxim', 'Bacar')
    o1 : Organizer = Organizer('jd@gmail.com', '456test', 'John', 'Do', 'Microsoft', '+1 (514) 456-1234')

    User.add(session, u1)
    User.add(session, o1)

    # o1.create_event("Career Fair", datetime.now(), datetime.now(), "Job search","bla bla", "1234 Rue de la paix")
