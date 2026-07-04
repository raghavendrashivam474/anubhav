import asyncio
import logging
from app.core.database import AsyncSessionLocal
from app.services.reminder_service import process_due_reminders

logger = logging.getLogger(__name__)

SCHEDULER_INTERVAL_SECONDS = 60  # Check every 60 seconds


async def run_scheduler():
    """
    Lightweight background scheduler.
    Checks for due reminders every 60 seconds.
    Runs as an asyncio task alongside the FastAPI app.
    """
    logger.info("Reminder scheduler started.")
    while True:
        try:
            async with AsyncSessionLocal() as db:
                count = await process_due_reminders(db)
                if count > 0:
                    logger.info(f"Scheduler processed {count} due reminder(s).")
        except Exception as e:
            logger.error(f"Scheduler error: {e}")
        await asyncio.sleep(SCHEDULER_INTERVAL_SECONDS)