from worker import check_new_emails
from loguru import logger
import time

if __name__ == "__main__":
    logger.info("Direct Polling Mode Active.")
    while True:
        try:
            result = check_new_emails()
            logger.info(f"Poll result: {result}")
        except Exception as e:
            logger.error(f"Polling error: {e}")
        
        logger.info("Sleeping for 30 seconds... (Press Ctrl+C to stop)")
        time.sleep(30)
