"""add experience relationships table

Revision ID: 9f2fe2c02443
Revises: 29f7317b9a01
Create Date: 2026-07-05 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = '9f2fe2c02443'
down_revision: Union[str, None] = '29f7317b9a01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'experience_relationships',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('source_anubhav_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('target_anubhav_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('similarity_score', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['source_anubhav_id'], ['anubhavs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['target_anubhav_id'], ['anubhavs.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('source_anubhav_id', 'target_anubhav_id', name='uq_experience_relationship'),
    )
    op.create_index('ix_experience_relationships_source', 'experience_relationships', ['source_anubhav_id'])
    op.create_index('ix_experience_relationships_target', 'experience_relationships', ['target_anubhav_id'])


def downgrade() -> None:
    op.drop_index('ix_experience_relationships_target', table_name='experience_relationships')
    op.drop_index('ix_experience_relationships_source', table_name='experience_relationships')
    op.drop_table('experience_relationships')