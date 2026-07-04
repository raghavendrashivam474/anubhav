from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class ReminderCreate(BaseModel):
    anubhav_id: UUID
    trigger_at: datetime = Field(..., description="When to trigger the reminder (UTC)")


class ReminderUpdate(BaseModel):
    trigger_at: Optional[datetime] = None


class ReminderRead(BaseModel):
    id: UUID
    user_id: UUID
    anubhav_id: UUID
    trigger_at: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReminderList(BaseModel):
    items: list[ReminderRead]
    total: int
    page: int
    page_size: int


class ReminderPayload(BaseModel):
    reminder_id: UUID
    anubhav_id: UUID
    what_happened: str
    lesson: Optional[str] = None
    summary: Optional[str] = None
    category: str
    tags: list[str] = []
    triggered_at: datetime