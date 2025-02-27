from sqlalchemy import create_engine, Column, Integer, String, Date, Time, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

import bcrypt

Base = declarative_base()


class Organizer(Base):
    __tablename__ = 'organizers'

    id          = Column( Integer, primary_key = True, autoincrement = True )
    name        = Column( String(255), nullable = False )
    email       = Column( String(255), nullable = False )
    password    = Column( String(255), nullable = False)
    phone       = Column( String(20), nullable = False )

    def set_password(self, plain_text_password):
        hashed = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, plain_text_password):
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), self.password.encode('utf-8'))

    def __init__(self, name, email, password, phone):
        self.name = name
        self.email = email
        self.set_password(password)  # Automatically hash the password
        self.phone = phone

class Event(Base):
    __tablename__ = 'events'
    
    id              = Column( Integer, primary_key = True, autoincrement = True )
    title           = Column( String(255), nullable = False )
    event_date      = Column( Date, nullable = False )
    event_time      = Column( Time, nullable = False )
    category        = Column( String(100), nullable = False )
    description     = Column( Text )
    organizer_id    = Column( Integer, ForeignKey('organizers.id', ondelete = 'CASCADE'), nullable = False )


class Session(Base):
    __tablename__ = 'sessions'
    id          = Column( Integer, primary_key = True, autoincrement = True )
    start_time  = Column( DateTime )
    end_time    = Column( DateTime )



class Attendee(Base):
    __tablename__ = 'attendees'
    id                  = Column(Integer, primary_key=True, autoincrement=True)
    name                = Column(String(255), nullable=False)
    registration_type   = Column(String(100))
    preferences         = Column(Text)
    ticket_status       = Column(String(50))
    email               = Column(String(255), nullable=False, unique=True)
    password            = Column(String(255), nullable=False)

    def set_password(self, plain_text_password):
        hashed = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, plain_text_password):
        return bcrypt.checkpw(plain_text_password.encode('utf-8'), self.password.encode('utf-8'))

    def __init__(self, name, email, password, registration_type=None, preferences=None, ticket_status=None):
        self.name = name
        self.email = email
        self.set_password(password)  
        self.registration_type = registration_type
        self.preferences = preferences
        self.ticket_status = ticket_status


class Learners(Base):
    __tablename__ = 'learners'

    id              = Column(Integer, ForeignKey('attendees.id'), primary_key=True)
    learning_type   = Column(String(255))
    
    attendee = relationship("Attendee", backref="learner_profile")


class Student(Base):
    __tablename__ = 'students'

    id          = Column(Integer, ForeignKey('learners.id'), primary_key=True)
    university  = Column(String(255))
    degree_type = Column(String(255))
    
    learner = relationship("Learners", backref="student_profile")

class Professional(Base):
    __tablename__ = 'professionals'

    id              = Column(Integer, ForeignKey('learners.id'), primary_key=True)
    company         = Column(String(255))
    job_title       = Column(String(255))
    
    learner = relationship("Learners", backref="professional_profile")

class Researcher(Base):
    __tablename__ = 'researchers'

    id              = Column(Integer, ForeignKey('learners.id'), primary_key=True)
    institution     = Column(String(255))
    research_field  = Column(String(255))
    
    
    learner = relationship("Learners", backref="researcher_profile")
    


engine = create_engine('sqlite:///sees.db', echo=False)
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)

