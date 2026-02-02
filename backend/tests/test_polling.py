import sys
import os
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from worker import check_new_emails
from database import init_db, engine
import models

def test_polling_flow():
    logger.info("Starting Polling Flow Test...")
    
    # 1. Initialize DB (Create tables and pgvector extension if needed)
    init_db()
    models.Base.metadata.create_all(bind=engine)
    
    # 2. Run the task
    # Note: This will attempt to authenticate with Gmail.
    # If token.pickle doesn't exist, it will print the Auth URL and WAIT.
    try:
        result = check_new_emails()
        logger.info(f"Task Result: {result}")
    except Exception as e:
        logger.error(f"Polling failed: {e}")

if __name__ == "__main__":
    test_polling_flow()
