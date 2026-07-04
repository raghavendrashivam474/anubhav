from alembic import op
import sqlalchemy as sa

revision = '29f7317b9a01'
down_revision = '7aa1129d8163'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('users', sa.Column('password_hash', sa.String(255), nullable=True))
    op.drop_index('ix_users_clerk_user_id', table_name='users')
    op.drop_column('users', 'clerk_user_id')


def downgrade() -> None:
    op.add_column('users', sa.Column('clerk_user_id', sa.String(255), nullable=True))
    op.create_index('ix_users_clerk_user_id', 'users', ['clerk_user_id'], unique=True)
    op.drop_column('users', 'password_hash')