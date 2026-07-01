from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.models.user import User
from app.models.anubhav import Anubhav
from app.models.tag import Tag
from app.models.reminder import Reminder
from app.routers import auth, anubhav, health

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
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


@app.get("/")
async def root():
    return {"message": "Anubhav API", "version": "0.1.0"}
