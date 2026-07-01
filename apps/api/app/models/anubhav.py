import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, DateTime, Enum, ForeignKey, Table, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.tag import Tag
    from app.models.reminder import Reminder


class Category(str, enum.Enum):
    CAREER = "career"
    RELATIONSHIPS = "relationships"
    HEALTH = "health"
    MONEY = "money"
    MINDSET = "mindset"
    LIFE = "life"


class Source(str, enum.Enum):
    MYSELF = "myself"
    FRIEND = "friend"
    BOOK = "book"
    PODCAST = "podcast"
    OBSERVATION = "observation"


# Many-to-many join table
anubhav_tags = Table(
    "anubhav_tags",
    Base.metadata,
    Column(
        "anubhav_id",
        UUID(as_uuid=True),
        ForeignKey("anubhavs.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id",
        UUID(as_uuid=True),
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Anubhav(Base):
    __tablename__ = "anubhavs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Content
    what_happened: Mapped[str] = mapped_column(Text, nullable=False)
    lesson: Mapped[str | None] = mapped_column(Text, nullable=True)
    advice: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Metadata
    category: Mapped[Category] = mapped_column(
        Enum(Category, name="category_enum"),
        nullable=False,
        default=Category.LIFE,
    )
    source: Mapped[Source] = mapped_column(
        Enum(Source, name="source_enum"),
        nullable=False,
        default=Source.MYSELF,
    )

    # AI embedding — 1536 dims = OpenAI text-embedding-3-small
    # AI embedding — 384 dims = all-MiniLM-L6-v2 (sentence-transformers)
    # AI embedding — 384 dims = all-MiniLM-L6-v2 (sentence-transformers)
    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(384), nullable=True
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="anubhavs")
    tags: Mapped[list["Tag"]] = relationship(
        "Tag", secondary=anubhav_tags, back_populates="anubhavs"
    )
    reminders: Mapped[list["Reminder"]] = relationship(
        "Reminder", back_populates="anubhav", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Anubhav {self.id} ({self.category.value})>"
