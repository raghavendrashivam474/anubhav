"""
HTTP endpoints for Reminder CRUD.
All routes:
  - Require Clerk authentication
  - Are user-scoped
  - Follow Router → Service → Model pattern
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.reminder import (
    ReminderCreate,
    ReminderList,
    ReminderRead,
    ReminderUpdate,
    ReminderPayload,
)
from app.services import reminder_service

router = APIRouter(prefix="/reminders", tags=["Reminders"])


# ──────────────────────────────────────────────────────────
# CREATE
# ──────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=ReminderRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a reminder for an Anubhav",
)
async def create_reminder(
    payload: ReminderCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    reminder = await reminder_service.create_reminder(db, user, payload)
    if reminder is None:
        raise HTTPException(status_code=404, detail="Anubhav not found")
    return reminder


# ──────────────────────────────────────────────────────────
# LIST
# ──────────────────────────────────────────────────────────

@router.get(
    "",
    response_model=ReminderList,
    summary="List my reminders",
)
async def list_reminders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, total = await reminder_service.list_reminders(
        db, user, page=page, page_size=page_size
    )
    return ReminderList(items=items, total=total, page=page, page_size=page_size)


# ──────────────────────────────────────────────────────────
# GET ONE
# ──────────────────────────────────────────────────────────

@router.get(
    "/{reminder_id}",
    response_model=ReminderRead,
    summary="Get a reminder by ID",
)
async def get_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    reminder = await reminder_service.get_reminder(db, user, reminder_id)
    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


# ──────────────────────────────────────────────────────────
# UPDATE
# ──────────────────────────────────────────────────────────

@router.patch(
    "/{reminder_id}",
    response_model=ReminderRead,
    summary="Update a reminder",
)
async def update_reminder(
    reminder_id: uuid.UUID,
    payload: ReminderUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    reminder = await reminder_service.update_reminder(db, user, reminder_id, payload)
    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


# ──────────────────────────────────────────────────────────
# DELETE
# ──────────────────────────────────────────────────────────

@router.delete(
    "/{reminder_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a reminder",
)
async def delete_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deleted = await reminder_service.delete_reminder(db, user, reminder_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Reminder not found")


# ──────────────────────────────────────────────────────────
# TRIGGER (Development Only)
# ──────────────────────────────────────────────────────────

@router.post(
    "/{reminder_id}/trigger",
    response_model=ReminderPayload,
    summary="Manually trigger a reminder (dev only)",
)
async def trigger_reminder(
    reminder_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    payload = await reminder_service.trigger_reminder(db, user, reminder_id)
    if payload is None:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return payload