from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, anubhav, health  # ← added 'anubhav'

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="Anubhav — Capture experiences today. Retrieve wisdom tomorrow.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(anubhav.router)  # ← added


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "env": settings.APP_ENV,
        "message": "Capture experiences today. Retrieve wisdom tomorrow.",
    }