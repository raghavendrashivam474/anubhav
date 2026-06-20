from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Check API + DB + pgvector status."""
    try:
        # Check DB connection
        await db.execute(text("SELECT 1"))
        db_status = "connected"

        # Check pgvector extension
        result = await db.execute(
            text("SELECT extname FROM pg_extension WHERE extname = 'vector'")
        )
        pgvector_loaded = result.scalar() is not None

        return {
            "status": "ok",
            "database": db_status,
            "pgvector": "loaded" if pgvector_loaded else "missing",
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e),
        }