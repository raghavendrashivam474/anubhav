from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReflectionItem(BaseModel):
    id: str
    title: str
    category: str
    reflection_type: str  # "reminder" | "forgotten" | "relationship" | "random"
    reason: str
    lesson: Optional[str] = None
    summary: Optional[str] = None
    similarity_score: Optional[float] = None
    relationship_count: Optional[int] = None
    due_date: Optional[str] = None
    created_at: Optional[str] = None


class ReflectionResponse(BaseModel):
    date: str
    total: int
    items: List[ReflectionItem]