from __future__ import annotations

import uuid
from datetime import datetime
from typing import List

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(
        String, nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(
        String, nullable=False, default='candidate')
    profile: Mapped["Profile"] = relationship(back_populates="user")


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    user: Mapped["User"] = relationship(back_populates="profile")
    # interviews: Mapped[List["Interview"]] = relationship("Interview")


class Interview(Base):
    __tablename__ = "interview"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(50), nullable=True)
    description: Mapped[str] = mapped_column(
        String(255), nullable=True)  # Increased size
    status: Mapped[str] = mapped_column(
        String, nullable=False, default='scheduled')
    start_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    candidate_id: Mapped[int] = mapped_column(Integer,
                                              ForeignKey("profile.id"), nullable=False)
    hr_id: Mapped[int] = mapped_column(Integer,
                                       ForeignKey("profile.id"), nullable=False)

    candidate: Mapped["Profile"] = relationship(
        "Profile", foreign_keys=[candidate_id, ])
    hr: Mapped["Profile"] = relationship("Profile", foreign_keys=[hr_id, ])
