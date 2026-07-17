"""
Capture Service.

Coordinates the multi-source wisdom capture pipeline.

Responsibility:
    Accept a normalized capture payload (from any source: book, future PDF,
    future voice, etc.), create an Anubhav record with the appropriate
    source metadata, and hand off to the existing AI extraction pipeline.

This service is a COORDINATOR, not a replacement.
It does not duplicate extraction, embedding, relationship, or reflection logic.
"""

import logging
import uuid
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.anubhav import Anubhav, Category, Source
from app.models.user import User
from app.services.extraction_service import extract_wisdom

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────
MIN_INSIGHT_LENGTH = 50

# Sprint 18 only supports 'book' as a non-experience source.
# Future sprints will extend this list (pdf, voice, podcast, etc.).
ALLOWED_CAPTURE_SOURCES = {Source.BOOK}


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────
async def create_wisdom_entry_from_capture(
    db: AsyncSession,
    user: User,
    source: Source,
    ocr_text: str,
    personal_insight: str,
    metadata: dict[str, Any] | None = None,
) -> Anubhav:
    """
    Create a Wisdom Entry (Anubhav) from a multi-source capture.

    Steps:
        1. Validate source is allowed for capture
        2. Validate personal_insight length
        3. Compose what_happened = ocr_text + "\\n\\n" + personal_insight
        4. Create Anubhav with source and source_metadata
        5. Trigger existing AI extraction pipeline (unchanged)
        6. Return the completed Anubhav

    Raises:
        HTTPException 400 if validation fails
        HTTPException 500 if AI pipeline fails critically
    """
    # ── Validate source ─────────────────────────────────────
    if source not in ALLOWED_CAPTURE_SOURCES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "invalid_source_type",
                "message": (
                    "source must be one of: "
                    + ", ".join(s.value for s in ALLOWED_CAPTURE_SOURCES)
                ),
            },
        )

    # ── Validate personal insight ───────────────────────────
    cleaned_insight = (personal_insight or "").strip()
    if len(cleaned_insight) < MIN_INSIGHT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "insight_too_short",
                "message": (
                    f"Personal insight must be at least {MIN_INSIGHT_LENGTH} "
                    "characters. Your wisdom deserves more than a few words."
                ),
            },
        )

    # ── Validate OCR text ───────────────────────────────────
    cleaned_ocr = (ocr_text or "").strip()
    if not cleaned_ocr:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "ocr_text_required",
                "message": "Source text (OCR) is required.",
            },
        )

    # ── Compose the unified experience text ─────────────────
    # OCR provides context. Personal insight provides meaning.
    # Together they form the raw material for the AI pipeline.
    what_happened = f"{cleaned_ocr}\n\n---\n\nMy insight: {cleaned_insight}"

    # ── Create the Anubhav record ───────────────────────────
    anubhav = Anubhav(
        user_id=user.id,
        what_happened=what_happened,
        category=Category.LIFE,  # AI extraction may refine this; default is safe
        source=source,
        source_metadata=metadata or None,
    )
    db.add(anubhav)
    await db.commit()
    await db.refresh(anubhav)

    logger.info(
        f"Capture: created Anubhav {anubhav.id} "
        f"(source={source.value}, insight_len={len(cleaned_insight)})"
    )

    # ── Trigger existing AI extraction pipeline ─────────────
    # This runs extraction -> embedding -> relationships (unchanged).
    extraction_result = await extract_wisdom(
        anubhav_id=str(anubhav.id),
        user_id=str(user.id),
        db=db,
    )

    if "error" in extraction_result:
        # Extraction failed but the Anubhav exists.
        # We don't roll back — the user's raw capture is preserved
        # and can be re-extracted later. But we surface the failure.
        logger.warning(
            f"Capture: Anubhav {anubhav.id} created but extraction failed: "
            f"{extraction_result.get('error')}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "extraction_failed",
                "message": (
                    "Your capture was saved but AI processing failed. "
                    "You can retry extraction from the entry page."
                ),
                "anubhav_id": str(anubhav.id),
            },
        )

    # ── Refresh to get updated fields (lesson, summary, tags, embedding) ──
    await db.refresh(anubhav, attribute_names=["tags"])
    return anubhav
