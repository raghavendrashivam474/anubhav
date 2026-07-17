"""
Pydantic schemas for the multi-source capture pipeline.
"""

import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.anubhav import Category, Source


# ─────────────────────────────────────────────────────────────
# OCR
# ─────────────────────────────────────────────────────────────
class OcrResult(BaseModel):
    """Response from POST /capture/ocr"""
    extracted_text: str
    word_count: int
    confidence: str  # "high" | "medium" | "low"


# ─────────────────────────────────────────────────────────────
# Capture submission
# ─────────────────────────────────────────────────────────────
class BookMetadata(BaseModel):
    """Optional metadata for a book capture."""
    book_title: str | None = Field(None, max_length=300)
    author: str | None = Field(None, max_length=200)
    page_number: str | None = Field(None, max_length=20)


class CaptureCreate(BaseModel):
    """Payload for POST /capture"""
    source: Source = Field(
        ...,
        description="Source type. Sprint 18 supports: book",
    )
    ocr_text: str = Field(
        ...,
        min_length=1,
        max_length=20000,
        description="Text extracted from the source (via OCR for images)",
    )
    personal_insight: str = Field(
        ...,
        min_length=50,
        max_length=5000,
        description="User's own interpretation. Minimum 50 characters.",
    )
    metadata: dict[str, Any] | None = Field(
        None,
        description="Source-specific metadata (e.g. book_title, author, page_number)",
    )


# ─────────────────────────────────────────────────────────────
# Response
# ─────────────────────────────────────────────────────────────
class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    name: str


class WisdomEntryRead(BaseModel):
    """Response from POST /capture — a fully-processed Wisdom Entry."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    what_happened: str
    lesson: str | None
    summary: str | None
    category: Category
    source: Source
    source_metadata: dict[str, Any] | None
    tags: list[TagRead]
    created_at: datetime
    updated_at: datetime
