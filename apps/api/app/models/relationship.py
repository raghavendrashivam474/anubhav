import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.anubhav import Anubhav


class ExperienceRelationship(Base):
    __tablename__ = "experience_relationships"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source_anubhav_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("anubhavs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    target_anubhav_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("anubhavs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    __table_args__ = (
        UniqueConstraint("source_anubhav_id", "target_anubhav_id", name="uq_experience_relationship"),
    )

    def __repr__(self) -> str:
        return f"<Relationship {self.source_anubhav_id} -> {self.target_anubhav_id} ({self.similarity_score:.2f})>"