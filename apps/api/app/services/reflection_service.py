import logging
import random
from datetime import datetime, timezone, timedelta
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.anubhav import Anubhav
from app.models.reminder import Reminder, ReminderStatus
from app.models.relationship import ExperienceRelationship

logger = logging.getLogger(__name__)

DEFAULT_LIMIT = 5
FORGOTTEN_THRESHOLD_DAYS = 14


def _title_from_anubhav(anubhav: Anubhav) -> str:
    """Generate a display title from an Anubhav — use lesson if available, else truncated what_happened."""
    if anubhav.lesson:
        return anubhav.lesson
    text = anubhav.what_happened or ""
    return text[:80] + ("..." if len(text) > 80 else "")


def _serialize_item(
    anubhav: Anubhav,
    reflection_type: str,
    reason: str,
    similarity_score: float = None,
    relationship_count: int = None,
    due_date: str = None,
) -> dict:
    return {
        "id": str(anubhav.id),
        "title": _title_from_anubhav(anubhav),
        "category": anubhav.category.value if hasattr(anubhav.category, "value") else str(anubhav.category),
        "reflection_type": reflection_type,
        "reason": reason,
        "lesson": anubhav.lesson,
        "summary": anubhav.summary,
        "similarity_score": similarity_score,
        "relationship_count": relationship_count,
        "due_date": due_date,
        "created_at": anubhav.created_at.isoformat() if anubhav.created_at else None,
    }


# ─────────────────────────────────────────────────
# Strategy 1 — Due Reminders
# ─────────────────────────────────────────────────

async def get_due_reminders(
    db: AsyncSession,
    user_id: UUID,
    limit: int = DEFAULT_LIMIT,
) -> list[dict]:
    now = datetime.now(timezone.utc)

    stmt = (
        select(Reminder, Anubhav)
        .join(Anubhav, Anubhav.id == Reminder.anubhav_id)
        .where(
            Reminder.user_id == user_id,
            Reminder.status == ReminderStatus.PENDING,
            Reminder.trigger_at <= now,
        )
        .order_by(Reminder.trigger_at.asc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        _serialize_item(
            anubhav=row[1],
            reflection_type="reminder",
            reason="Reminder due today",
            due_date=row[0].trigger_at.isoformat(),
        )
        for row in rows
    ]


# ─────────────────────────────────────────────────
# Strategy 2 — Forgotten Wisdom
# ─────────────────────────────────────────────────

async def get_forgotten_wisdom(
    db: AsyncSession,
    user_id: UUID,
    exclude_ids: set[str],
    limit: int = DEFAULT_LIMIT,
) -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=FORGOTTEN_THRESHOLD_DAYS)

    stmt = (
        select(Anubhav)
        .where(
            Anubhav.user_id == user_id,
            Anubhav.updated_at <= cutoff,
        )
        .order_by(Anubhav.updated_at.asc())
        .limit(limit * 3)  # fetch extra so we can filter out excluded
    )

    result = await db.execute(stmt)
    anubhavs = result.scalars().all()

    items = []
    for a in anubhavs:
        if str(a.id) in exclude_ids:
            continue
        items.append(
            _serialize_item(
                anubhav=a,
                reflection_type="forgotten",
                reason="Not revisited in a long time",
            )
        )
        if len(items) >= limit:
            break

    return items


# ─────────────────────────────────────────────────
# Strategy 3 — Relationship Suggestions
# ─────────────────────────────────────────────────

async def get_relationship_suggestions(
    db: AsyncSession,
    user_id: UUID,
    exclude_ids: set[str],
    limit: int = DEFAULT_LIMIT,
) -> list[dict]:
    # Find anubhavs with the highest relationship count for this user
    count_stmt = (
        select(
            ExperienceRelationship.source_anubhav_id,
            func.count(ExperienceRelationship.id).label("rel_count"),
            func.avg(ExperienceRelationship.similarity_score).label("avg_sim"),
        )
        .join(Anubhav, Anubhav.id == ExperienceRelationship.source_anubhav_id)
        .where(Anubhav.user_id == user_id)
        .group_by(ExperienceRelationship.source_anubhav_id)
        .order_by(func.count(ExperienceRelationship.id).desc(), func.avg(ExperienceRelationship.similarity_score).desc())
        .limit(limit * 3)
    )

    result = await db.execute(count_stmt)
    rows = result.all()

    items = []
    for row in rows:
        anubhav_id = row[0]
        rel_count = int(row[1])
        avg_sim = float(row[2]) if row[2] else 0.0

        if str(anubhav_id) in exclude_ids:
            continue

        anubhav_result = await db.execute(
            select(Anubhav).where(Anubhav.id == anubhav_id)
        )
        anubhav = anubhav_result.scalar_one_or_none()
        if not anubhav:
            continue

        items.append(
            _serialize_item(
                anubhav=anubhav,
                reflection_type="relationship",
                reason=f"Connected to {rel_count} other experiences",
                similarity_score=round(avg_sim, 4),
                relationship_count=rel_count,
            )
        )
        if len(items) >= limit:
            break

    return items


# ─────────────────────────────────────────────────
# Strategy 4 — Random Reflection
# ─────────────────────────────────────────────────

async def get_random_reflection(
    db: AsyncSession,
    user_id: UUID,
    exclude_ids: set[str],
    limit: int = 1,
) -> list[dict]:
    stmt = (
        select(Anubhav)
        .where(Anubhav.user_id == user_id)
    )
    result = await db.execute(stmt)
    all_anubhavs = result.scalars().all()

    candidates = [a for a in all_anubhavs if str(a.id) not in exclude_ids]

    if not candidates:
        return []

    picks = random.sample(candidates, min(limit, len(candidates)))

    return [
        _serialize_item(
            anubhav=a,
            reflection_type="random",
            reason="A moment worth revisiting",
        )
        for a in picks
    ]


# ─────────────────────────────────────────────────
# Orchestrator
# ─────────────────────────────────────────────────

async def build_daily_reflection(
    db: AsyncSession,
    user_id: UUID,
    total_limit: int = DEFAULT_LIMIT,
) -> dict:
    """
    Combine all strategies into a prioritized, deduplicated reflection list.
    """
    seen_ids: set[str] = set()
    items: list[dict] = []

    # Priority 1: Due reminders
    reminders = await get_due_reminders(db, user_id, limit=total_limit)
    for item in reminders:
        if item["id"] not in seen_ids and len(items) < total_limit:
            items.append(item)
            seen_ids.add(item["id"])

    # Priority 2: Forgotten wisdom
    if len(items) < total_limit:
        forgotten = await get_forgotten_wisdom(
            db, user_id, exclude_ids=seen_ids, limit=total_limit - len(items)
        )
        for item in forgotten:
            if item["id"] not in seen_ids and len(items) < total_limit:
                items.append(item)
                seen_ids.add(item["id"])

    # Priority 3: Relationship suggestions
    if len(items) < total_limit:
        relationships = await get_relationship_suggestions(
            db, user_id, exclude_ids=seen_ids, limit=total_limit - len(items)
        )
        for item in relationships:
            if item["id"] not in seen_ids and len(items) < total_limit:
                items.append(item)
                seen_ids.add(item["id"])

    # Priority 4: Random reflection (only if we still have nothing or need to fill)
    if len(items) < total_limit:
        random_items = await get_random_reflection(
            db, user_id, exclude_ids=seen_ids, limit=total_limit - len(items)
        )
        for item in random_items:
            if item["id"] not in seen_ids and len(items) < total_limit:
                items.append(item)
                seen_ids.add(item["id"])

    return {
        "date": datetime.now(timezone.utc).date().isoformat(),
        "total": len(items),
        "items": items,
    }