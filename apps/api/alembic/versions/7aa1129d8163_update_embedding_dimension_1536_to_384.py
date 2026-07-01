"""update embedding dimension 1536 to 384

Revision ID: 7aa1129d8163
Revises: d76368627fb4
Create Date: 2026-07-01 10:14:32.877698

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '7aa1129d8163'
down_revision: Union[str, None] = 'd76368627fb4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE anubhavs ALTER COLUMN embedding TYPE vector(384)")


def downgrade() -> None:
    op.execute("ALTER TABLE anubhavs ALTER COLUMN embedding TYPE vector(1536)")