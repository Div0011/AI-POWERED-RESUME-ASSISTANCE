import sys
import os
from loguru import logger
from unittest.mock import MagicMock

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from services.communication import CommunicationService

def test_ai_email_drafting():
    logger.info("Testing AI Email Drafting...")
    service = CommunicationService()
    
    name = "Divyansh"
    job = "Cyber Security Intern"
    reasoning = "Candidate shows strong understanding of OWASP Top 10 but lacks experience with Wireshark."
    
    # Test Acceptance
    acceptance = service.draft_decision_email(name, job, reasoning, "accept")
    print(f"\n--- AI Draft: Acceptance ---\n{acceptance}\n")
    
    # Test Rejection
    rejection = service.draft_decision_email(name, job, reasoning, "reject")
    print(f"\n--- AI Draft: Rejection ---\n{rejection}\n")
    
    assert "Divyansh" in acceptance or "Divyansh" in rejection
    logger.info("AI Drafting Test Passed!")

def test_actual_send():
    """
    To run this, ensure token.pickle has 'send' scope.
    We'll send a test email to the user if they provide an email, 
    otherwise we mock it.
    """
    test_email = os.getenv("TEST_CANDIDATE_EMAIL")
    if not test_email:
        logger.warning("TEST_CANDIDATE_EMAIL not set in .env. Skipping actual send test.")
        return

    logger.info(f"Sending real test email to {test_email}...")
    service = CommunicationService()
    service.send_email(
        to_email=test_email,
        subject="GET IT! - Test Recruitment Email",
        body="This is a verify that our GET IT! automated communication system is functional."
    )
    logger.info("Real send test completed.")

if __name__ == "__main__":
    test_ai_email_drafting()
    test_actual_send()
