import logging
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text, literal_column
from sqlalchemy.orm import selectinload

from app.models.anubhav import Anubhav, Category
from app.models.user import User
from app.services.embedding_service import generate_embedding
from app.schemas.semantic_search import SemanticSearchItem

logger = logging.getLogger(__name__)


async def semantic_search(
    db: AsyncSession,
    user: User,
    query: str,
    page: int = 1,
    page_size: int = 20,
    category: Optional[Category] = None,
) -> tuple[List[SemanticSearchItem], int]:
    """
    Search Anubhavs by semantic similarity using pgvector cosine distance.
    """

    # Generate query embedding
    query_embedding = await generate_embedding(query)
    query_vector = str(query_embedding)

    # Build conditions
    conditions = [
        Anubhav.user_id == user.id,
        Anubhav.embedding.is_not(None)
    ]
    if category is not None:
        conditions.append(Anubhav.category == category)

    # Use literal_column for the similarity expression
    similarity_expr = literal_column(
        f"(1 - (embedding <=> '{query_vector}'::vector))"
    )
    distance_expr = literal_column(
        f"(embedding <=> '{query_vector}'::vector)"
    )

    # Main query
    stmt = (
        select(
            Anubhav,
            similarity_expr.label("similarity_score")
        )
        .options(selectinload(Anubhav.tags))
        .where(*conditions)
        .order_by(distance_expr)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    # Count query
    count_stmt = (
        select(func.count())
        .select_from(Anubhav)
        .where(*conditions)
    )

    count_result = await db.execute(count_stmt)
    total = count_result.scalar_one()

    result = await db.execute(stmt)
    rows = result.all()

    items = []
    for row in rows:
        anubhav = row[0]
        similarity = float(row[1])
        items.append(
            SemanticSearchItem(
                id=str(anubhav.id),
                what_happened=anubhav.what_happened,
                lesson=anubhav.lesson,
                summary=anubhav.summary,
                category=anubhav.category.value,
                tags=anubhav.tags,
                similarity_score=round(similarity, 4)
            )
        )

    return items, total