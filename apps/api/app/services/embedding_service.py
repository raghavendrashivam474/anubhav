import logging
import asyncio
from functools import partial
from typing import List

logger = logging.getLogger(__name__)

# Model is loaded once at module level and reused
_model = None


def _get_model():
    """Load model once and cache it."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model: all-MiniLM-L6-v2")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Embedding model loaded successfully")
    return _model


def _generate_embedding(text: str) -> List[float]:
    """Synchronous embedding generation — runs in thread executor."""
    model = _get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


async def generate_embedding(text: str) -> List[float]:
    """
    Generate a 384-dimensional embedding vector for the given text.

    Runs synchronous model inference in a thread executor
    to avoid blocking the async event loop.

    Provider: sentence-transformers / all-MiniLM-L6-v2
    Dimensions: 384
    """
    loop = asyncio.get_event_loop()
    embedding = await loop.run_in_executor(
        None,
        partial(_generate_embedding, text)
    )
    return embedding