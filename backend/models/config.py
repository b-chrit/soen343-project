from sqlalchemy import create_engine, Column, Integer, String, Date, Time, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, scoped_session

import bcrypt


Base = declarative_base()
engine = create_engine('sqlite:///sees2.db', echo=False)
SQLSession = scoped_session(sessionmaker(bind=engine))


