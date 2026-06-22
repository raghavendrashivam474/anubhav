"""
Pydantic schemas for Anubhav entries.
Request/response validation + serialization.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.anubhav import Category, Source


# ──────────────────────────────────────────────────────────
# REQUEST SCHEMAS
# ──────────────────────────────────────────────────────────

class AnubhavCreate(BaseModel):
    """Payload to create a new Anubhav entry."""

    what_happened: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="The experience or situation",
    )
    lesson: str | None = Field(
        None,
        max_length=5000,
        description="What you learned from it",
    )
    advice: str | None = Field(
        None,
        max_length=5000,
        description="Advice to your future self",
    )
    category: Category = Field(default=Category.LIFE)
    source: Source = Field(default=Source.MYSELF)
    tags: list[str] = Field(
        default_factory=list,
        max_length=20,
        description="Optional tag names (lowercased, deduped)",
    )


class AnubhavUpdate(BaseModel):
    """Partial update — all fields optional."""

    what_happened: str | None = Field(None, min_length=1, max_length=10000)
    lesson: str | None = Field(None, max_length=5000)
    advice: str | None = Field(None, max_length=5000)
    summary: str | None = Field(None, max_length=2000)
    category: Category | None = None
    source: Source | None = None
    tags: list[str] | None = Field(None, max_length=20)


# ──────────────────────────────────────────────────────────
# RESPONSE SCHEMAS
# ──────────────────────────────────────────────────────────

class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str


class AnubhavRead(BaseModel):
    """What we return to the client."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    what_happened: str
    lesson: str | None
    advice: str | None
    summary: str | None
    category: Category
    source: Source
    tags: list[TagRead]
    created_at: datetime
    updated_at: datetime


class AnubhavList(BaseModel):
    """Paginated list response."""

    items: list[AnubhavRead]
    total: int
    page: int
    page_size: int