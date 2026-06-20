"""
Clerk JWT authentication for FastAPI.

Flow:
1. Client sends `Authorization: Bearer <jwt>` header
2. We fetch Clerk's public keys (JWKS) — cached
3. Verify JWT signature, issuer, expiry
4. Extract clerk_user_id from token
5. Find user in DB, or auto-create on first login
6. Inject User into route as a dependency
"""

import httpx
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User


security = HTTPBearer(auto_error=True, description="Clerk JWT")

# Cached JWKS client (avoids fetching public keys on every request)
_jwks_client: PyJWKClient | None = None


def get_jwks_client() -> PyJWKClient:
    """Initialize and cache the Clerk JWKS client."""
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(
            settings.CLERK_JWKS_URL,
            cache_keys=True,
            lifespan=3600,  # cache for 1 hour
        )
    return _jwks_client


def verify_clerk_token(token: str) -> dict:
    """Verify a Clerk-issued JWT and return its claims."""
    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token).key

        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=settings.CLERK_ISSUER,
            options={
                "verify_aud": False,  # Clerk default tokens don't set 'aud'
                "verify_exp": True,
                "verify_iss": True,
            },
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token issuer",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def _fetch_user_from_clerk(clerk_user_id: str) -> dict | None:
    """Fetch full user profile from Clerk API (for email + name on first login)."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"https://api.clerk.com/v1/users/{clerk_user_id}",
                headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            )
            if response.status_code == 200:
                return response.json()
            else:
                # 🔍 Log the real error from Clerk
                print(f"[auth] Clerk API error {response.status_code}: {response.text}")
                print(f"[auth] Used secret key starting with: {settings.CLERK_SECRET_KEY[:15]}...")
                return None
    except Exception as e:
        print(f"[auth] Failed to fetch user from Clerk: {e}")
        return None
    
    """Fetch full user profile from Clerk API (for email + name on first login)."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"https://api.clerk.com/v1/users/{clerk_user_id}",
                headers={"Authorization": f"Bearer {settings.CLERK_SECRET_KEY}"},
            )
            if response.status_code == 200:
                return response.json()
    except Exception as e:
        print(f"[auth] Failed to fetch user from Clerk: {e}")
    return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    FastAPI dependency: returns the authenticated User.
    Auto-creates a User row on first authenticated request.
    """
    payload = verify_clerk_token(credentials.credentials)

    clerk_user_id = payload.get("sub")
    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing 'sub' claim",
        )

    # Look up user
    result = await db.execute(
        select(User).where(User.clerk_user_id == clerk_user_id)
    )
    user = result.scalar_one_or_none()

    if user:
        return user

    # First-time login → create user
    clerk_profile = await _fetch_user_from_clerk(clerk_user_id)

    email = None
    name = None

    if clerk_profile:
        # Email
        emails = clerk_profile.get("email_addresses", [])
        primary_email_id = clerk_profile.get("primary_email_address_id")
        for em in emails:
            if em.get("id") == primary_email_id:
                email = em.get("email_address")
                break
        if not email and emails:
            email = emails[0].get("email_address")

        # Name
        first = clerk_profile.get("first_name") or ""
        last = clerk_profile.get("last_name") or ""
        name = f"{first} {last}".strip() or None

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve email for user from Clerk",
        )

    user = User(
        clerk_user_id=clerk_user_id,
        email=email,
        name=name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user