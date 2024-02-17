from typing import Any

from app.api import deps
from app.core.session import get_db
from app.models import Interview, User
from app.schemas.requests import InterviewCreateRequest, InterviewUpdateRequeset
from app.schemas.responses import InterviewResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/")
async def create_interview(
    new_interview: InterviewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    user_profile = current_user.profile
    interview = Interview(
        title=new_interview.title,
        description=new_interview.description,
        end_datetime=new_interview.end_datetime,
        start_datetime=new_interview.start_datetime,
        candidate_id=user_profile.id,
        hr_id=user_profile.id,
        status=new_interview.status,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.get("/")
async def get_interviews(
    candidate_id: int = None,
    hr_id: int = None,
    db: Session = Depends(get_db),
):
    if candidate_id:
        interviews = db.query(Interview).filter(
            Interview.candidate_id == candidate_id).all()
    elif hr_id:
        interviews = db.query(Interview).filter(Interview.hr_id == hr_id).all()
    else:
        interviews = db.query(Interview).all()
    return interviews


@router.patch("/{interview_id}")
async def update_interview(
    interview_id: int,
    interview_update: InterviewUpdateRequeset,
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    for attr, value in interview_update.model_dump().items():
        setattr(interview, attr, value)
    db.commit()
    db.refresh(interview)
    return interview


@router.delete("/{interview_id}", status_code=204)
async def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    db.delete(interview)
    db.commit()
    return {"message": "Interview deleted successfully"}
