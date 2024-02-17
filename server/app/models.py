from __future__ import annotations

import uuid
from datetime import datetime
from typing import List

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default='candidate')
    profile = relationship("Profile", back_populates="user", uselist=False)


class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    company = Column(String, nullable=True)
    user = relationship("User", back_populates="profile")


class Interview(Base):
    __tablename__ = "interview"

    id = Column(Integer, primary_key=True)
    title = Column(String(50), nullable=True)
    description = Column(String(255), nullable=True)  # Increased size
    status = Column(String, nullable=False, default='scheduled')
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=False)
    candidate_id = Column(Integer, ForeignKey("profile.id"), nullable=False)
    hr_id = Column(Integer, ForeignKey("profile.id"), nullable=False)

    # add foreign key relationships
    candidate = relationship("Profile", foreign_keys=[candidate_id])
    hr = relationship("Profile", foreign_keys=[hr_id])
