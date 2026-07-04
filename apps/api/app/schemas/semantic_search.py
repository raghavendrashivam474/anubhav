from pydantic import BaseModel
from typing import List, Optional
from app.schemas.anubhav import TagRead


class SemanticSearchItem(BaseModel):
    id: str
    what_happened: str
    lesson: Optional[str] = None
    summary: Optional[str] = None
    category: str
    tags: List[TagRead] = []
    similarity_score: float

    class Config:
        from_attributes = True


class SemanticSearchResponse(BaseModel):
    items: List[SemanticSearchItem]
    total: int
    page: int
    page_size: int