import sys
import os
from unittest.mock import MagicMock, patch
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

# Mock GmailService before importing worker
with patch('services.gmail.GmailService') as MockGmail:
    mock_gmail = MockGmail.return_value
    mock_gmail.get_unread_messages.return_value = [] # Mock Empty Inbox
    
    from worker import check_new_emails
    from database import init_db, engine
    import models

    def test_heartbeat_log():
        logger.info("Starting MOCKED Heartbeat Test...")
        
        # Initialize DB
        init_db()
        models.Base.metadata.create_all(bind=engine)
        
        # Run the task
        result = check_new_emails()
        logger.info(f"Task Result: {result}")
        return result

    if __name__ == "__main__":
        test_heartbeat_log()
