"""
HTTP endpoints for Anubhav CRUD + search.
All routes:
  - Require Clerk authentication (Rule 1)
  - Are user-scoped (Rule 2)
  - Follow Router → Service → Model pattern (Rule 3)
"""

import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.anubhav import Category
from app.models.user import User
from app.schemas.anubhav import (
    AnubhavCreate,
    AnubhavList,
    AnubhavRead,
    AnubhavUpdate,
)
from app.services import anubhav_service


router = APIRouter(prefix="/anubhavs", tags=["Anubhavs"])


# ──────────────────────────────────────────────────────────
# CREATE
# ──────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=AnubhavRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new Anubhav entry",
)
async def create_anubhav(
    payload: AnubhavCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await anubhav_service.create_anubhav(db, user, payload)


# ──────────────────────────────────────────────────────────
# LIST
# ──────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=AnubhavList,
    summary="List my Anubhavs (paginated)",
)
async def list_my_anubhavs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Category | None = Query(None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, total = await anubhav_service.list_anubhavs(
        db, user, page=page, page_size=page_size, category=category
    )
    return AnubhavList(items=items, total=total, page=page, page_size=page_size)


# ──────────────────────────────────────────────────────────
# SEARCH
# ⚠️ Must be declared BEFORE /{anubhav_id} routes,
# otherwise FastAPI parses "search" as a UUID.
# ──────────────────────────────────────────────────────────

@router.get(
    "/search",
    response_model=AnubhavList,
    summary="Search my Anubhavs by keyword",
)
async def search_my_anubhavs(
    q: str = Query(..., min_length=1, max_length=200, description="Search query"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Category | None = Query(None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Case-insensitive keyword search (ILIKE) across:
    - what_happened, lesson, advice, summary
    - tag names

    User-scoped. Paginated. Optional category filter.
    """
    items, total = await anubhav_service.search_anubhavs(
        db, user, query=q, page=page, page_size=page_size, category=category
    )
    return AnubhavList(items=items, total=total, page=page, page_size=page_size)


# ──────────────────────────────────────────────────────────
# GET ONE
# ──────────────────────────────────────────────────────────

@router.get(
    "/{anubhav_id}",
    response_model=AnubhavRead,
    summary="Get one Anubhav by ID",
)
async def get_anubhav(
    anubhav_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await anubhav_service.get_anubhav(db, user, anubhav_id)


# ──────────────────────────────────────────────────────────
# UPDATE
# ──────────────────────────────────────────────────────────

@router.patch(
    "/{anubhav_id}",
    response_model=AnubhavRead,
    summary="Update an Anubhav (partial)",
)
async def update_anubhav(
    anubhav_id: uuid.UUID,
    payload: AnubhavUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await anubhav_service.update_anubhav(db, user, anubhav_id, payload)


# ──────────────────────────────────────────────────────────
# DELETE
# ──────────────────────────────────────────────────────────

@router.delete(
    "/{anubhav_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an Anubhav",
)
async def delete_anubhav(
    anubhav_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    await anubhav_service.delete_anubhav(db, user, anubhav_id)