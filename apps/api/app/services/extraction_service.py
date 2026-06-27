import json
import logging
import asyncio
from functools import partial
from groq import Groq
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from app.models.anubhav import Anubhav
from app.models.anubhav import anubhav_tags
from app.models.tag import Tag
from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a wisdom extraction assistant.

Your job is to read a personal experience and extract structured wisdom from it.

You must respond with valid JSON only. No explanation. No markdown. No extra text.

The JSON must follow this exact schema:
{
    "lesson": "one sentence capturing the core lesson learned",
    "summary": "maximum 60 words summarizing the experience and its significance",
    "tags": ["tag1", "tag2", "tag3"]
}

Rules:
- lesson: one clear sentence, maximum 20 words
- summary: maximum 60 words
- tags: 3 to 5 tags, lowercase, one or two words each, no duplicates
- Return nothing except the JSON object"""


def build_user_prompt(what_happened: str, category: str, source: str) -> str:
    return f"""Extract wisdom from this personal experience.

Experience: {what_happened}
Category: {category}
Source: {source}

Return JSON only."""


def validate_extraction(data: dict) -> tuple[bool, str]:
    if "lesson" not in data:
        return False, "Missing field: lesson"
    if "summary" not in data:
        return False, "Missing field: summary"
    if "tags" not in data:
        return False, "Missing field: tags"
    if not isinstance(data["lesson"], str) or len(data["lesson"].strip()) == 0:
        return False, "Invalid lesson: must be non-empty string"
    if not isinstance(data["summary"], str) or len(data["summary"].strip()) == 0:
        return False, "Invalid summary: must be non-empty string"
    if not isinstance(data["tags"], list) or len(data["tags"]) < 3:
        return False, "Invalid tags: must be a list with at least 3 items"
    if len(data["tags"]) > 5:
        return False, "Invalid tags: maximum 5 tags allowed"
    return True, ""


def call_groq(what_happened: str, category: str, source: str) -> str:
    """Synchronous Groq call — runs in thread executor."""
    client = Groq(api_key=settings.GROQ_API_KEY)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(
                what_happened=what_happened,
                category=category,
                source=source
            )}
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=500,
        timeout=30
    )
    return response.choices[0].message.content


async def extract_wisdom(
    anubhav_id: str,
    user_id: str,
    db: AsyncSession
) -> dict:

    # Load anubhav with tags eagerly
    result = await db.execute(
        select(Anubhav)
        .options(selectinload(Anubhav.tags))
        .where(
            Anubhav.id == anubhav_id,
            Anubhav.user_id == user_id
        )
    )
    anubhav = result.scalar_one_or_none()

    if anubhav is None:
        return {"error": "not_found", "message": "Anubhav not found"}

    # Block re-extraction if already done
    if anubhav.lesson and anubhav.summary:
        return {"error": "already_extracted", "message": "Extraction already performed on this entry"}

    # Capture values before entering executor
    what_happened = anubhav.what_happened
    category = anubhav.category
    source = anubhav.source

    # Call Groq in thread executor to avoid blocking async loop
    try:
        loop = asyncio.get_event_loop()
        raw_content = await loop.run_in_executor(
            None,
            partial(
                call_groq,
                what_happened=what_happened,
                category=category,
                source=source
            )
        )
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return {"error": "ai_timeout", "message": "AI service unavailable. Please try again."}

    # Parse response
    try:
        extracted = json.loads(raw_content)
    except (json.JSONDecodeError, TypeError) as e:
        logger.error(f"Failed to parse Groq response: {e}")
        return {"error": "invalid_response", "message": "AI returned malformed response"}

    # Validate structure
    is_valid, error_msg = validate_extraction(extracted)
    if not is_valid:
        logger.error(f"Extraction validation failed: {error_msg}")
        return {"error": "invalid_response", "message": f"AI response validation failed: {error_msg}"}

    # Persist to database
    try:
        anubhav.lesson = extracted["lesson"].strip()
        anubhav.summary = extracted["summary"].strip()

        # Delete existing tag associations
        await db.execute(
            delete(anubhav_tags).where(anubhav_tags.c.anubhav_id == anubhav.id)
        )

        # Process and insert new tags
        new_tag_names = []
        for tag_name in extracted["tags"]:
            tag_name = tag_name.lower().strip()
            existing = await db.execute(
                select(Tag).where(Tag.name == tag_name)
            )
            tag = existing.scalar_one_or_none()
            if tag is None:
                tag = Tag(name=tag_name)
                db.add(tag)
                await db.flush()

            # Insert into association table directly
            await db.execute(
                anubhav_tags.insert().values(
                    anubhav_id=anubhav.id,
                    tag_id=tag.id
                )
            )
            new_tag_names.append(tag_name)

        await db.commit()

    except Exception as e:
        await db.rollback()
        logger.error(f"Database error during extraction: {e}")
        return {"error": "db_failure", "message": "Failed to save extraction results"}

    return {
        "success": True,
        "anubhav_id": str(anubhav.id),
        "lesson": anubhav.lesson,
        "summary": anubhav.summary,
        "tags": new_tag_names
    }