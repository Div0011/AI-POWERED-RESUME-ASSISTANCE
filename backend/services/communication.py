import os
import base64
from email.message import EmailMessage
from typing import Dict, Any, Literal
import google.generativeai as genai
from loguru import logger
from dotenv import load_dotenv
from services.gmail import GmailService

load_dotenv()

class CommunicationService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.gmail = GmailService()

    def draft_decision_email(self, candidate_name: str, job_title: str, reasoning: str, decision: Literal["accept", "reject"]) -> str:
        """
        Uses Gemini to draft a professional and personalized email body.
        Inclues a specific detail from the AI reasoning to make it personal.
        """
        try:
            tone = "enthusiastic and professional" if decision == "accept" else "polite, professional, and encouraging"
            outcome = "moving forward with your application" if decision == "accept" else "not moving forward at this time"
            
            prompt = f"""
            Draft a personalized email for a job candidate.
            Candidate Name: {candidate_name}
            Job Title: {job_title}
            Decision: {outcome}
            AI Reasoning Context: {reasoning}
            
            Instructions:
            1. The tone should be {tone}.
            2. Mention one specific detail or strength from the reasoning context to prove this isn't a generic template.
            3. Keep it under 150 words.
            4. Do not use placeholders like [Insert Name], use the provided data.
            
            Return ONLY the email body text.
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error drafting email with Gemini: {e}")
            return f"Hi {candidate_name}, thank you for applying for {job_title}. We have reviewed your profile and decided {outcome}."

    def send_email(self, to_email: str, subject: str, body: str):
        """
        Sends an email using the Gmail API via GmailService.
        """
        try:
            message = EmailMessage()
            message.set_content(body)
            message['To'] = to_email
            message['Subject'] = subject
            
            # encoded message
            encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
            
            create_message = {
                'raw': encoded_message
            }
            
            send_result = self.gmail._service.users().messages().send(userId="me", body=create_message).execute()
            logger.info(f"Email sent successfully to {to_email}. Message ID: {send_result.get('id')}")
            return send_result
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            raise

    def process_decision(self, candidate_id: int, decision: Literal["accept", "reject"], db_session):
        """
        Orchestrates the drafting and sending of the decision email.
        """
        import models # Lazy import to avoid circular dependencies
        candidate = db_session.query(models.Candidate).get(candidate_id)
        if not candidate:
            logger.error(f"Candidate {candidate_id} not found for decision email.")
            return
        
        job = db_session.query(models.Job).get(candidate.job_id)
        job_title = job.title if job else "the position"
        
        subject = f"Update on your application for {job_title} - GET IT!"
        body = self.draft_decision_email(
            candidate_name=candidate.name,
            job_title=job_title,
            reasoning=candidate.explanation or "Your profile was reviewed by our AI screening system.",
            decision=decision
        )
        
        self.send_email(to_email=candidate.email, subject=subject, body=body)
        logger.info(f"Decision processing completed for candidate {candidate.name} ({decision})")

# Example Usage:
# comms = CommunicationService()
# comms.process_decision(candidate_id=1, decision="accept", db_session=session)
