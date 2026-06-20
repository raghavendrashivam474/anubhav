from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Return profile of the currently authenticated user."""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "name": current_user.name,
        "clerk_user_id": current_user.clerk_user_id,
        "created_at": current_user.created_at.isoformat(),
    }