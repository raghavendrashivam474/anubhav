from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import health

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="Anubhav — Capture experiences today. Retrieve wisdom tomorrow.",
)

# CORS (allow Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "env": settings.APP_ENV,
        "message": "Capture experiences today. Retrieve wisdom tomorrow.",
    }