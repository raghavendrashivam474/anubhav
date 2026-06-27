from pydantic import BaseModel, Field
from typing import List


class ExtractionResult(BaseModel):
    lesson: str = Field(..., min_length=1, max_length=500)
    summary: str = Field(..., min_length=1, max_length=300)
    tags: List[str] = Field(..., min_length=3, max_items=5)


class ExtractionResponse(BaseModel):
    message: str
    anubhav_id: str
    lesson: str
    summary: str
    tags: List[str]