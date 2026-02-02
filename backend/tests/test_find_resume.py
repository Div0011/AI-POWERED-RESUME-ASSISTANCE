import sys
import os
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from worker import check_new_emails
from services.gmail import GmailService
from database import SessionLocal
import models
from worker import check_new_emails

def run_specific_check():
    logger.info("Starting Specific Email Search (Bypassing UNREAD filter)...")
    
    # We want to find the email the user just sent. 
    # Let's search for messages from the last 30 minutes.
    gmail = GmailService()
    # Query for any messages with 'resume' in them or attachments
    query = "has:attachment filename:pdf"
    
    # We use the same service but a custom query
    messages = gmail._service.users().messages().list(userId='me', q=query, maxResults=10).execute().get('messages', [])
    
    if not messages:
        logger.warning("No messages found with attachments in the recent history.")
        return

    logger.info(f"Found {len(messages)} potential resume emails. Processing them...")
    
    # We'll temporarily modify the 'check_new_emails' behavior or just run a limited version
    # For simplicity, let's just run the standard one but we've already marked them as READ, 
    # so we need to mark them as UNREAD first or change the worker.
    
    for msg in messages:
        msg_id = msg['id']
        # Mark as unread so standard worker picks them up
        gmail._service.users().messages().modify(
            userId='me', id=msg_id, body={'addLabelIds': ['UNREAD']}
        ).execute()
        logger.info(f"Marked message {msg_id} as UNREAD for processing.")

    # Now run the standard worker
    result = check_new_emails()
    logger.info(f"Worker Result: {result}")

if __name__ == "__main__":
    run_specific_check()
