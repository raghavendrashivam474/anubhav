"""
HTTP endpoints for Anubhav CRUD + search + AI extraction + relationships.
All routes:
  - Require authentication
  - Are user-scoped
  - Follow Router -> Service -> Model pattern
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
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
from app.schemas.extraction import ExtractionResponse
from app.services import anubhav_service
from app.services.extraction_service import extract_wisdom
from app.schemas.semantic_search import SemanticSearchResponse
from app.services.semantic_search_service import semantic_search
from app.services.relationship_service import (
    get_related_anubhavs,
    get_all_connections_for_user,
)


router = APIRouter(prefix="/anubhavs", tags=["Anubhavs"])


# CREATE
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


# LIST
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


# SEARCH
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
    items, total = await anubhav_service.search_anubhavs(
        db, user, query=q, page=page, page_size=page_size, category=category
    )
    return AnubhavList(items=items, total=total, page=page, page_size=page_size)


# SEMANTIC SEARCH
@router.get(
    "/semantic-search",
    response_model=SemanticSearchResponse,
    summary="Search my Anubhavs by meaning using AI embeddings",
)
async def semantic_search_anubhavs(
    q: str = Query(..., min_length=1, max_length=200, description="Search query"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Category | None = Query(None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        items, total = await semantic_search(
            db=db,
            user=user,
            query=q,
            page=page,
            page_size=page_size,
            category=category,
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Semantic search failed: {type(e).__name__}: {str(e)}"
        )

    return SemanticSearchResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size
    )


# CONNECTIONS (for world renderer)
@router.get(
    "/connections",
    summary="Get all relationship connections for the user's world",
)
async def get_user_connections(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    connections = await get_all_connections_for_user(db, user.id)
    return {"connections": connections, "total": len(connections)}


# EXTRACT
@router.post(
    "/{anubhav_id}/extract",
    response_model=ExtractionResponse,
    summary="Extract wisdom from an Anubhav using AI",
)
async def extract_anubhav_wisdom(
    anubhav_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await extract_wisdom(
        anubhav_id=str(anubhav_id),
        user_id=str(user.id),
        db=db
    )

    if "error" in result:
        if result["error"] == "not_found":
            raise HTTPException(status_code=404, detail=result["message"])
        if result["error"] == "already_extracted":
            raise HTTPException(status_code=409, detail=result["message"])
        if result["error"] == "ai_timeout":
            raise HTTPException(status_code=503, detail=result["message"])
        if result["error"] in ("invalid_response", "db_failure"):
            raise HTTPException(status_code=500, detail=result["message"])

    return ExtractionResponse(
        message="Wisdom extracted successfully",
        anubhav_id=result["anubhav_id"],
        lesson=result["lesson"],
        summary=result["summary"],
        tags=result["tags"]
    )


# RELATED
@router.get(
    "/{anubhav_id}/related",
    summary="Get related Anubhavs based on semantic similarity",
)
async def get_related(
    anubhav_id: uuid.UUID,
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # Verify ownership first
    anubhav = await anubhav_service.get_anubhav(db, user, anubhav_id)
    if not anubhav:
        raise HTTPException(status_code=404, detail="Anubhav not found")

    items = await get_related_anubhavs(db, anubhav_id, user.id, limit=limit)
    return {"items": items, "total": len(items)}


# GET ONE
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


# UPDATE
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


# DELETE
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