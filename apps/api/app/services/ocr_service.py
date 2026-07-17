"""
OCR Service.

Extracts text from images using Tesseract OCR.
Used by the capture pipeline for book source type.
"""

import io
import logging
import os
from pathlib import Path

import pytesseract
from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# Tesseract binary location
# On Windows, pytesseract cannot find the binary via PATH reliably.
# We point it explicitly. Override with TESSERACT_CMD env var if needed.
# ─────────────────────────────────────────────────────────────
_DEFAULT_TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
_tesseract_cmd = os.environ.get("TESSERACT_CMD", _DEFAULT_TESSERACT_PATH)
if Path(_tesseract_cmd).exists():
    pytesseract.pytesseract.tesseract_cmd = _tesseract_cmd


# ─────────────────────────────────────────────────────────────
# Typed exceptions
# ─────────────────────────────────────────────────────────────
class OcrError(Exception):
    """Base class for OCR errors."""


class OcrExtractionError(OcrError):
    """Image could not be read or processed."""


class OcrEmptyResultError(OcrError):
    """OCR ran but found no text."""


class OcrUnsupportedFormatError(OcrError):
    """Image format is not supported."""


class OcrServiceUnavailableError(OcrError):
    """Tesseract binary is not installed or not accessible."""


# ─────────────────────────────────────────────────────────────
# Confidence scoring
# ─────────────────────────────────────────────────────────────
def _classify_confidence(word_count: int) -> str:
    """
    Simple heuristic based on word count.
    A real book page typically yields 100+ words.
    """
    if word_count >= 80:
        return "high"
    if word_count >= 20:
        return "medium"
    return "low"


# ─────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────
def extract_text_from_image(image_bytes: bytes) -> dict:
    """
    Extract text from an image using Tesseract.

    Args:
        image_bytes: raw bytes of the uploaded image

    Returns:
        {
            "extracted_text": str,
            "word_count": int,
            "confidence": "high" | "medium" | "low"
        }

    Raises:
        OcrUnsupportedFormatError: image format cannot be opened
        OcrExtractionError: image is corrupted or unreadable
        OcrEmptyResultError: OCR completed but found no text
        OcrServiceUnavailableError: tesseract binary missing
    """
    # Open image
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.load()
    except UnidentifiedImageError:
        raise OcrUnsupportedFormatError(
            "Image format not recognized. Use JPEG, PNG, or WEBP."
        )
    except Exception as e:
        logger.error(f"Failed to open image: {e}")
        raise OcrExtractionError("Could not read the image file.")

    # Run OCR
    try:
        text = pytesseract.image_to_string(image)
    except pytesseract.TesseractNotFoundError:
        raise OcrServiceUnavailableError(
            "Tesseract binary not found. Install Tesseract and set TESSERACT_CMD."
        )
    except Exception as e:
        logger.error(f"Tesseract failed: {e}")
        raise OcrExtractionError("OCR processing failed.")

    cleaned = text.strip()
    if not cleaned:
        raise OcrEmptyResultError(
            "No text detected in the image."
        )

    word_count = len(cleaned.split())

    return {
        "extracted_text": cleaned,
        "word_count": word_count,
        "confidence": _classify_confidence(word_count),
    }
