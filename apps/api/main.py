import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.models.user import User
from app.models.anubhav import Anubhav
from app.models.tag import Tag
from app.models.reminder import Reminder
from app.routers import auth, anubhav, health
from app.routers import reminder
from app.scheduler import run_scheduler

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start scheduler on startup
    logger.info("Starting reminder scheduler...")
    scheduler_task = asyncio.create_task(run_scheduler())
    yield
    # Cancel scheduler on shutdown
    scheduler_task.cancel()
    try:
        await scheduler_task
    except asyncio.CancelledError:
        logger.info("Reminder scheduler stopped.")


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(anubhav.router)
app.include_router(reminder.router)


@app.get("/")
async def root():
    return {"message": "Anubhav API", "version": "0.1.0"}