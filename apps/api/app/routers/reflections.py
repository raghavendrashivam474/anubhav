"""
Reflection Engine endpoints.
Provides intelligent wisdom resurfacing based on multiple strategies.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.reflection import ReflectionResponse
from app.services.reflection_service import build_daily_reflection


router = APIRouter(prefix="/reflections", tags=["Reflections"])


@router.get(
    "/today",
    response_model=ReflectionResponse,
    summary="Get today's reflections — reminders, forgotten wisdom, and related experiences",
)
async def get_todays_reflections(
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Returns a prioritized list of reflections for today:
    1. Due reminders
    2. Forgotten wisdom (not revisited in 14+ days)
    3. Highly connected experiences from the relationship graph
    4. Random reflection (fallback)

    All results are deduplicated and user-scoped.
    """
    result = await build_daily_reflection(db, user.id, total_limit=limit)
    return result