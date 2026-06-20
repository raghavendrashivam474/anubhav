import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.anubhav import anubhav_tags

if TYPE_CHECKING:
    from app.models.anubhav import Anubhav


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    anubhavs: Mapped[list["Anubhav"]] = relationship(
        "Anubhav", secondary=anubhav_tags, back_populates="tags"
    )

    def __repr__(self) -> str:
        return f"<Tag {self.name}>"