import uuid
from datetime import datetime

from app.core.session import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "user"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    email = Column(String(254), nullable=False, unique=True, index=True)
    hashed_password = Column(String(128), nullable=False)
    role = Column(String(20), nullable=True, default='candidate')


class Interview(Base):
    __tablename__ = "interview"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(50), nullable=True)
    description = Column(String(50), nullable=True)
    status = Column(String(25), nullable=False, default='Scheduled')
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    candidate_id = Column(String, ForeignKey('user.id'))
    hr_id = Column(String, ForeignKey('user.id'))

    # Relationships
    candidate = relationship('User', foreign_keys=[candidate_id])
    hr_user = relationship('User', foreign_keys=[hr_id])
