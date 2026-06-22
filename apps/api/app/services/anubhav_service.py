"""
Anubhav business logic.
Keeps routers thin and logic testable.

All functions are user-scoped — never expose another user's data.
"""

import uuid
from typing import Sequence

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.anubhav import Anubhav, Category
from app.models.tag import Tag
from app.models.user import User
from app.schemas.anubhav import AnubhavCreate, AnubhavUpdate


# ──────────────────────────────────────────────────────────
# INTERNAL HELPERS
# ──────────────────────────────────────────────────────────

async def _get_or_create_tags(
    db: AsyncSession, tag_names: list[str]
) -> list[Tag]:
    """
    Given a list of tag names, return existing Tag rows or create missing ones.
    Tags are normalized: lowercased, stripped, deduped, max 100 chars.
    """
    if not tag_names:
        return []

    # Normalize
    normalized = list({
        name.strip().lower()[:100]
        for name in tag_names
        if name and name.strip()
    })
    if not normalized:
        return []

    # Find existing
    result = await db.execute(select(Tag).where(Tag.name.in_(normalized)))
    existing_by_name = {tag.name: tag for tag in result.scalars().all()}

    # Create missing
    new_tags: list[Tag] = []
    for name in normalized:
        if name not in existing_by_name:
            new_tag = Tag(name=name)
            db.add(new_tag)
            new_tags.append(new_tag)

    if new_tags:
        await db.flush()  # assign IDs without committing

    return list(existing_by_name.values()) + new_tags


async def _get_owned_anubhav(
    db: AsyncSession, anubhav_id: uuid.UUID, user: User
) -> Anubhav:
    """
    Fetch an Anubhav by ID and verify the current user owns it.
    Returns 404 (not 403) on ownership mismatch to avoid leaking existence.
    """
    result = await db.execute(
        select(Anubhav)
        .where(Anubhav.id == anubhav_id)
        .options(selectinload(Anubhav.tags))
    )
    anubhav = result.scalar_one_or_none()

    if not anubhav or anubhav.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Anubhav not found",
        )

    return anubhav


# ──────────────────────────────────────────────────────────
# PUBLIC SERVICE FUNCTIONS
# ──────────────────────────────────────────────────────────

async def create_anubhav(
    db: AsyncSession, user: User, payload: AnubhavCreate
) -> Anubhav:
    """Create a new Anubhav entry owned by `user`."""
    tags = await _get_or_create_tags(db, payload.tags)

    anubhav = Anubhav(
        user_id=user.id,
        what_happened=payload.what_happened,
        lesson=payload.lesson,
        advice=payload.advice,
        category=payload.category,
        source=payload.source,
        tags=tags,
    )
    db.add(anubhav)
    await db.commit()
    await db.refresh(anubhav, attribute_names=["tags"])
    return anubhav


async def list_anubhavs(
    db: AsyncSession,
    user: User,
    page: int = 1,
    page_size: int = 20,
    category: Category | None = None,
) -> tuple[Sequence[Anubhav], int]:
    """
    Return (items, total_count) for the current user's anubhavs.
    Newest first. Supports pagination and optional category filter.
    """
    base = select(Anubhav).where(Anubhav.user_id == user.id)
    if category is not None:
        base = base.where(Anubhav.category == category)

    # Total count
    count_query = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_query)).scalar_one()

    # Items
    offset = (page - 1) * page_size
    items_query = (
        base.order_by(Anubhav.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .options(selectinload(Anubhav.tags))
    )
    items = (await db.execute(items_query)).scalars().all()
    return items, total


async def get_anubhav(
    db: AsyncSession, user: User, anubhav_id: uuid.UUID
) -> Anubhav:
    """Get a single Anubhav, scoped to the user."""
    return await _get_owned_anubhav(db, anubhav_id, user)


async def update_anubhav(
    db: AsyncSession,
    user: User,
    anubhav_id: uuid.UUID,
    payload: AnubhavUpdate,
) -> Anubhav:
    """Partial update of an Anubhav, scoped to the user."""
    anubhav = await _get_owned_anubhav(db, anubhav_id, user)

    # Update fields except tags
    update_data = payload.model_dump(exclude_unset=True, exclude={"tags"})
    for field, value in update_data.items():
        setattr(anubhav, field, value)

    # Update tags if provided
    if payload.tags is not None:
        anubhav.tags = await _get_or_create_tags(db, payload.tags)

    await db.commit()
    await db.refresh(anubhav, attribute_names=["tags"])
    return anubhav


async def delete_anubhav(
    db: AsyncSession, user: User, anubhav_id: uuid.UUID
) -> None:
    """Permanently delete an Anubhav, scoped to the user."""
    anubhav = await _get_owned_anubhav(db, anubhav_id, user)
    await db.delete(anubhav)
    await db.commit()

async def search_anubhavs(
    db: AsyncSession,
    user: User,
    query: str,
    page: int = 1,
    page_size: int = 20,
    category: Category | None = None,
) -> tuple[Sequence[Anubhav], int]:
    """
    Keyword search across content fields + tag names.
    PostgreSQL ILIKE — case-insensitive substring matching.
    User-scoped (Rule 2). Paginated. Optional category filter.

    Schema note:
        Brief refers to: title, situation, observation, lesson, advice_to_future_self
        Our schema has:  (no title), what_happened, summary, lesson, advice
        Mapping enforced per Rule 4 (don't change schema):
            situation              → what_happened
            observation            → summary
            advice_to_future_self  → advice
            title                  → (skipped, not in MVP schema)
    """
    from sqlalchemy import or_

    pattern = f"%{query.strip()}%"

    # Base query: join tags so tag names are searchable too
    base = (
        select(Anubhav)
        .outerjoin(Anubhav.tags)
        .where(Anubhav.user_id == user.id)
        .where(
            or_(
                Anubhav.what_happened.ilike(pattern),  # "situation"
                Anubhav.lesson.ilike(pattern),
                Anubhav.advice.ilike(pattern),          # "advice_to_future_self"
                Anubhav.summary.ilike(pattern),         # "observation"
                Tag.name.ilike(pattern),                # tag search
            )
        )
        .distinct()
    )

    if category is not None:
        base = base.where(Anubhav.category == category)

    # Total count (for pagination metadata)
    count_query = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_query)).scalar_one()

    # Paginated items, newest first, with tags eager-loaded (no N+1)
    offset = (page - 1) * page_size
    items_query = (
        base.order_by(Anubhav.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .options(selectinload(Anubhav.tags))
    )
    items = (await db.execute(items_query)).scalars().all()
    return items, total

async def search_anubhavs(
    db: AsyncSession,
    user: User,
    query: str,
    page: int = 1,
    page_size: int = 20,
    category: Category | None = None,
) -> tuple[Sequence[Anubhav], int]:
    """
    Keyword search across what_happened, lesson, advice, summary, and tag names.
    PostgreSQL ILIKE for case-insensitive matching. User-scoped.
    """
    from sqlalchemy import or_

    pattern = f"%{query.strip()}%"

    base = (
        select(Anubhav)
        .outerjoin(Anubhav.tags)
        .where(Anubhav.user_id == user.id)
        .where(
            or_(
                Anubhav.what_happened.ilike(pattern),
                Anubhav.lesson.ilike(pattern),
                Anubhav.advice.ilike(pattern),
                Anubhav.summary.ilike(pattern),
                Tag.name.ilike(pattern),
            )
        )
        .distinct()
    )

    if category is not None:
        base = base.where(Anubhav.category == category)

    count_query = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_query)).scalar_one()

    offset = (page - 1) * page_size
    items_query = (
        base.order_by(Anubhav.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .options(selectinload(Anubhav.tags))
    )
    items = (await db.execute(items_query)).scalars().all()
    return items, total