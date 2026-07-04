import logging
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.reminder import Reminder, ReminderStatus
from app.models.anubhav import Anubhav
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderUpdate

logger = logging.getLogger(__name__)


async def create_reminder(
    db: AsyncSession,
    user: User,
    payload: ReminderCreate,
) -> Reminder:
    result = await db.execute(
        select(Anubhav).where(
            Anubhav.id == payload.anubhav_id,
            Anubhav.user_id == user.id
        )
    )
    anubhav = result.scalar_one_or_none()
    if anubhav is None:
        return None

    reminder = Reminder(
        user_id=user.id,
        anubhav_id=payload.anubhav_id,
        trigger_at=payload.trigger_at,
        status=ReminderStatus.PENDING,
    )
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder


async def list_reminders(
    db: AsyncSession,
    user: User,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[Reminder], int]:
    count_result = await db.execute(
        select(func.count()).select_from(Reminder).where(
            Reminder.user_id == user.id
        )
    )
    total = count_result.scalar_one()

    result = await db.execute(
        select(Reminder)
        .where(Reminder.user_id == user.id)
        .order_by(Reminder.trigger_at.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    reminders = result.scalars().all()
    return list(reminders), total


async def get_reminder(
    db: AsyncSession,
    user: User,
    reminder_id: UUID,
) -> Reminder | None:
    result = await db.execute(
        select(Reminder).where(
            Reminder.id == reminder_id,
            Reminder.user_id == user.id
        )
    )
    return result.scalar_one_or_none()


async def update_reminder(
    db: AsyncSession,
    user: User,
    reminder_id: UUID,
    payload: ReminderUpdate,
) -> Reminder | None:
    reminder = await get_reminder(db, user, reminder_id)
    if reminder is None:
        return None

    if payload.trigger_at is not None:
        reminder.trigger_at = payload.trigger_at

    await db.commit()
    await db.refresh(reminder)
    return reminder


async def delete_reminder(
    db: AsyncSession,
    user: User,
    reminder_id: UUID,
) -> bool:
    reminder = await get_reminder(db, user, reminder_id)
    if reminder is None:
        return False

    await db.delete(reminder)
    await db.commit()
    return True


async def trigger_reminder(
    db: AsyncSession,
    user: User,
    reminder_id: UUID,
) -> dict | None:
    result = await db.execute(
        select(Reminder)
        .options(
            selectinload(Reminder.anubhav).selectinload(Anubhav.tags)
        )
        .where(
            Reminder.id == reminder_id,
            Reminder.user_id == user.id
        )
    )
    reminder = result.scalar_one_or_none()

    if reminder is None:
        return None

    anubhav = reminder.anubhav
    reminder.status = ReminderStatus.SENT
    await db.commit()

    return {
        "reminder_id": str(reminder.id),
        "anubhav_id": str(anubhav.id),
        "what_happened": anubhav.what_happened,
        "lesson": anubhav.lesson,
        "summary": anubhav.summary,
        "category": anubhav.category.value,
        "tags": [tag.name for tag in anubhav.tags],
        "triggered_at": datetime.now(timezone.utc).isoformat(),
    }


async def process_due_reminders(db: AsyncSession) -> int:
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(Reminder)
        .options(
            selectinload(Reminder.anubhav).selectinload(Anubhav.tags)
        )
        .where(
            Reminder.status == ReminderStatus.PENDING,
            Reminder.trigger_at <= now
        )
    )
    due_reminders = result.scalars().all()

    count = 0
    for reminder in due_reminders:
        reminder.status = ReminderStatus.SENT
        logger.info(
            f"Reminder {reminder.id} triggered for user {reminder.user_id} "
            f"Anubhav: {reminder.anubhav_id}"
        )
        count += 1

    if count > 0:
        await db.commit()
        logger.info(f"Processed {count} due reminders")

    return count