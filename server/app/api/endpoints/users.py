from app.api import deps
from app.core.security import get_password_hash
from app.core.session import get_db
from app.models import Interview, Profile, User
from app.schemas.requests import UserCreateRequest, UserUpdatePasswordRequest
from app.schemas.responses import UserResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(deps.get_current_user),
):
    """Get current user"""
    return current_user


@router.delete("/me", status_code=204)
async def delete_current_user(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete current user"""
    db.query(User).delete(User.id == current_user.id)
    return {'message': 'User deleted successfully'}


@router.post("/reset-password", response_model=UserResponse)
async def reset_current_user_password(
    user_update_password: UserUpdatePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """Update current user password"""
    current_user.hashed_password = get_password_hash(
        user_update_password.password)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {"id": current_user.id, "email": current_user.email}


@router.post("/signup", response_model=UserResponse)
async def register_new_user(
    new_user: UserCreateRequest,
    db: Session = Depends(get_db),
):
    """Create new user"""
    result = db.query(User).filter(User.email == new_user.email)
    if result.first() is not None:
        raise HTTPException(
            status_code=400, detail="User already exist")
    user = User(
        email=new_user.email,
        hashed_password=get_password_hash(new_user.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(user)
    # create associate profile
    profile = Profile(user=user)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {"id": user.id, "email": user.email, "role": user.role}
