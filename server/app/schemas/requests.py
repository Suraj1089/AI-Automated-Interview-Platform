from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, EmailStr


class BaseRequest(BaseModel):
    # may define additional fields or config shared across requests
    pass


class RefreshTokenRequest(BaseRequest):
    refresh_token: str


class UserUpdatePasswordRequest(BaseRequest):
    password: str


class UserCreateRequest(BaseRequest):
    email: EmailStr
    password: str


class UserLoginRequest(BaseRequest):
    username: EmailStr
    password: str


class InterviewCreateRequest(BaseRequest):
    title: str
    description: str
    start_datetime: datetime

    end_datetime: datetime
    candidate: Any
    hr: Any
    status: Literal['Scheduled', 'Cancelled', 'Completed',
                    'Live', 'Postponed', 'Rescheduled'] = 'Scheduled'


class InterviewUpdateRequeset(BaseRequest):
    title: str
    description: str
    start_datetime: datetime
    end_datetime: datetime
    status: Literal['Scheduled', 'Cancelled', 'Completed',
                    'Live', 'Postponed', 'Rescheduled'] = 'Scheduled'


class ProfileUpdateRequest(BaseRequest):
    pass
