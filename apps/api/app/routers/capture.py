"""
HTTP endpoints for multi-source wisdom capture.

Endpoints:
    POST /capture/ocr   - Extract text from an uploaded image
    POST /capture       - Submit a capture and create a Wisdom Entry

Both require authentication. Both are user-scoped.
"""

import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.capture import CaptureCreate, OcrResult, WisdomEntryRead
from app.services import capture_service
from app.services.ocr_service import (
    OcrEmptyResultError,
    OcrExtractionError,
    OcrServiceUnavailableError,
    OcrUnsupportedFormatError,
    extract_text_from_image,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/capture", tags=["Capture"])


# ─────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


# ─────────────────────────────────────────────────────────────
# POST /capture/ocr
# ─────────────────────────────────────────────────────────────
@router.post(
    "/ocr",
    response_model=OcrResult,
    summary="Extract text from an uploaded image",
)
async def ocr_endpoint(
    image: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    # ── Validate content type ───────────────────────────────
    if image.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "ocr_unsupported_format",
                "message": "Supported formats: JPEG, PNG, WEBP",
            },
        )

    # ── Read bytes and enforce size limit ───────────────────
    image_bytes = await image.read()
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail={
                "error": "ocr_file_too_large",
                "message": "Image must be under 10MB.",
            },
        )

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "ocr_extraction_error",
                "message": "Empty file.",
            },
        )

    # ── Run OCR ─────────────────────────────────────────────
    try:
        result = extract_text_from_image(image_bytes)
    except OcrUnsupportedFormatError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"error": "ocr_unsupported_format", "message": str(e)},
        )
    except OcrEmptyResultError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "ocr_empty_result",
                "message": (
                    "No text found in this image. "
                    "Try a clearer photograph with better lighting."
                ),
            },
        )
    except OcrExtractionError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "ocr_extraction_error",
                "message": "Could not read this image. Please try a different photo.",
            },
        )
    except OcrServiceUnavailableError as e:
        logger.error(f"Tesseract unavailable: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "ocr_service_unavailable",
                "message": "OCR service is temporarily unavailable.",
            },
        )

    return OcrResult(**result)


# ─────────────────────────────────────────────────────────────
# POST /capture
# ─────────────────────────────────────────────────────────────
@router.post(
    "",
    response_model=WisdomEntryRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a Wisdom Entry from a multi-source capture",
)
async def capture_endpoint(
    payload: CaptureCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    anubhav = await capture_service.create_wisdom_entry_from_capture(
        db=db,
        user=user,
        source=payload.source,
        ocr_text=payload.ocr_text,
        personal_insight=payload.personal_insight,
        metadata=payload.metadata,
    )
    return anubhav
