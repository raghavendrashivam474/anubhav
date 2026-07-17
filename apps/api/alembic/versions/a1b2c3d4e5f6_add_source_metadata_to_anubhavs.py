"""add source_metadata to anubhavs

Revision ID: a1b2c3d4e5f6
Revises: 9f2fe2c02443
Create Date: 2026-07-18 04:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '9f2fe2c02443'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'anubhavs',
        sa.Column(
            'source_metadata',
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        )
    )


def downgrade() -> None:
    op.drop_column('anubhavs', 'source_metadata')
