import logging
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, literal_column
from app.models.anubhav import Anubhav
from app.models.relationship import ExperienceRelationship

logger = logging.getLogger(__name__)

SIMILARITY_THRESHOLD = 0.30
TOP_N = 5


def format_vector_for_pgvector(embedding) -> str:
    if hasattr(embedding, "tolist"):
        values = embedding.tolist()
    else:
        values = list(embedding)
    return "[" + ",".join(f"{float(v):.8f}" for v in values) + "]"


async def update_relationships_for_anubhav(
    db: AsyncSession,
    anubhav_id: UUID,
) -> int:
    result = await db.execute(
        select(Anubhav).where(Anubhav.id == anubhav_id)
    )
    source = result.scalar_one_or_none()

    if not source or source.embedding is None:
        logger.info(f"No embedding for anubhav {anubhav_id}, skipping")
        return 0

    user_id = source.user_id

    await db.execute(
        delete(ExperienceRelationship).where(
            (ExperienceRelationship.source_anubhav_id == anubhav_id) |
            (ExperienceRelationship.target_anubhav_id == anubhav_id)
        )
    )

    query_vector = format_vector_for_pgvector(source.embedding)

    similarity_expr = literal_column(
        f"(1 - (embedding <=> '{query_vector}'::vector))"
    )
    distance_expr = literal_column(
        f"(embedding <=> '{query_vector}'::vector)"
    )

    stmt = (
        select(
            Anubhav.id,
            similarity_expr.label("similarity_score")
        )
        .where(
            Anubhav.user_id == user_id,
            Anubhav.id != anubhav_id,
            Anubhav.embedding.is_not(None)
        )
        .order_by(distance_expr)
        .limit(TOP_N)
    )

    result = await db.execute(stmt)
    rows = result.all()

    count = 0
    for row in rows:
        target_id = row[0]
        similarity = float(row[1])

        if similarity < SIMILARITY_THRESHOLD:
            continue

        rel_forward = ExperienceRelationship(
            source_anubhav_id=anubhav_id,
            target_anubhav_id=target_id,
            similarity_score=similarity,
        )
        rel_reverse = ExperienceRelationship(
            source_anubhav_id=target_id,
            target_anubhav_id=anubhav_id,
            similarity_score=similarity,
        )
        db.add(rel_forward)
        db.add(rel_reverse)
        count += 2

    try:
        await db.commit()
        logger.info(f"Created {count} relationships for anubhav {anubhav_id}")
    except Exception as e:
        await db.rollback()
        logger.error(f"Failed to store relationships for {anubhav_id}: {e}")
        return 0

    return count


async def get_related_anubhavs(
    db: AsyncSession,
    anubhav_id: UUID,
    user_id: UUID,
    limit: int = 5,
) -> list[dict]:
    stmt = (
        select(
            ExperienceRelationship.target_anubhav_id,
            ExperienceRelationship.similarity_score,
            Anubhav.what_happened,
            Anubhav.lesson,
            Anubhav.category,
            Anubhav.created_at,
        )
        .join(Anubhav, Anubhav.id == ExperienceRelationship.target_anubhav_id)
        .where(
            ExperienceRelationship.source_anubhav_id == anubhav_id,
            Anubhav.user_id == user_id,
        )
        .order_by(ExperienceRelationship.similarity_score.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "id": str(row[0]),
            "similarity_score": round(float(row[1]), 4),
            "what_happened": row[2],
            "lesson": row[3],
            "category": row[4].value if hasattr(row[4], "value") else str(row[4]),
            "created_at": row[5].isoformat() if row[5] else None,
        }
        for row in rows
    ]


async def get_all_connections_for_user(
    db: AsyncSession,
    user_id: UUID,
) -> list[dict]:
    stmt = (
        select(
            ExperienceRelationship.source_anubhav_id,
            ExperienceRelationship.target_anubhav_id,
            ExperienceRelationship.similarity_score,
        )
        .join(Anubhav, Anubhav.id == ExperienceRelationship.source_anubhav_id)
        .where(Anubhav.user_id == user_id)
        .where(ExperienceRelationship.source_anubhav_id < ExperienceRelationship.target_anubhav_id)
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "source_id": str(row[0]),
            "target_id": str(row[1]),
            "similarity_score": round(float(row[2]), 4),
        }
        for row in rows
    ]