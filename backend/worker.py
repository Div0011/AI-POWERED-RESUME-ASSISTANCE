import os
import shutil
import numpy as np
from celery import Celery
from celery.schedules import crontab
from loguru import logger
from sqlalchemy import select, func
from database import SessionLocal, engine
import models
from parser import parse_resume
from services.gmail import GmailService
from services.embedding import EmbeddingService
from services.matching import rank_candidate

# Initialize Celery
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
celery = Celery(__name__, broker=REDIS_URL, backend=REDIS_URL)

# Celery Configuration
celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    beat_schedule={
        'check-emails-every-5-minutes': {
            'task': 'check_new_emails',
            'schedule': 300.0, # 5 minutes
        },
    }
)

@celery.task(name="check_new_emails")
def check_new_emails():
    """
    Periodic task to scan Gmail for new resumes, parse them, 
    and match them against job descriptions using the Hybrid Brain.
    """
    logger.info("--- Scanning Inbox... [Heartbeat] ---")
    
    db = SessionLocal()
    try:
        # 1. Ensure Jobs exist
        jobs = db.query(models.Job).all()
        if not jobs:
            logger.warning("No jobs found in DB. Skipping polling.")
            return "No Jobs"

        # 2. Poll Gmail
        gmail = GmailService()
        embedding_service = EmbeddingService()
        messages = gmail.get_unread_messages()
        
        if not messages:
            logger.info("Empty Inbox: No new resumes found.")
            return "Empty Inbox"

        for msg_info in messages:
            msg_id = msg_info['id']
            msg_details = gmail.get_message_details(msg_id)
            
            if not msg_details or not msg_details['attachments']:
                gmail.mark_as_read(msg_id)
                continue

            for attachment in msg_details['attachments']:
                # Save attachment temporarily
                temp_dir = "temp_processing"
                os.makedirs(temp_dir, exist_ok=True)
                # Sanitize filename to avoid subdirectory errors
                safe_filename = os.path.basename(attachment['filename'])
                file_path = os.path.join(temp_dir, safe_filename)
                
                with open(file_path, "wb") as f:
                    f.write(attachment['binary'])
                
                try:
                    # Parse Resume
                    text = parse_resume(file_path)
                    resume_vec = embedding_service.get_embedding(text)
                    
                    # Search for best match
                    best_match = None
                    highest_score = -1.0
                    
                    for job in jobs:
                        # Use the Hybrid Brain
                        result = rank_candidate(
                            jd_text=job.description,
                            resume_text=text,
                            jd_embedding=job.embedding,
                            resume_embedding=resume_vec,
                            must_have_skills=job.required_skills or []
                        )
                        if result["final_score"] > highest_score:
                            highest_score = result["final_score"]
                            best_match = {
                                "job_id": job.id,
                                "result": result
                            }
                    
                    if best_match:
                        res = best_match["result"]
                        candidate = models.Candidate(
                            name=msg_details['from'],
                            email=msg_details['email'],
                            resume_text=text,
                            job_id=best_match["job_id"],
                            score=res["final_score"],
                            analysis=res["breakdown"],
                            confidence_score=res["status"], # Using status as confidence/category
                            explanation=res["reasoning"],
                            embedding=resume_vec
                        )
                        db.add(candidate)
                        logger.info(f"Categorized {msg_details['from']} as '{res['status']}' for Job ID: {best_match['job_id']}")

                except Exception as e:
                    logger.error(f"Failed to process attachment {attachment['filename']}: {e}")
                finally:
                    # Cleanup
                    if os.path.exists(file_path):
                        os.remove(file_path)

            # Mark processed email as READ
            gmail.mark_as_read(msg_id)
            db.commit() # Commit per message to save progress
            
        return f"Processed {len(messages)} messages."

    except Exception as e:
        logger.error(f"Error in check_new_emails task: {e}")
        return str(e)
    finally:
        db.close()

@celery.task(name="match_existing_candidates_to_new_job")
def match_existing_candidates_to_new_job(job_id: int):
    """
    Background task triggered when a new job is created.
    Matches all existing candidates against the new role and invites top matches.
    """
    logger.info(f"--- Running Job-Candidate Matcher for Job ID {job_id} ---")
    db = SessionLocal()
    try:
        job = db.query(models.Job).get(job_id)
        if not job:
            return "Job not found"
        
        candidates = db.query(models.Candidate).all()
        embedding_service = EmbeddingService()
        from services.communication import CommunicationService
        comms = CommunicationService()
        
        invite_count = 0
        for cand in candidates:
            # We already have the candidate's embedding in the DB
            if not cand.embedding:
                continue
                
            result = rank_candidate(
                jd_text=job.description,
                resume_text=cand.resume_text,
                jd_embedding=job.embedding,
                resume_embedding=cand.embedding,
                must_have_skills=job.required_skills or []
            )
            
            # If they are a strong match (selected or high review), invite them
            if result["final_score"] >= 0.7:
                logger.info(f"Inviting {cand.name} (Score: {result['final_score']:.2f}) to apply for {job.title}")
                
                subject = f"New Opportunity matching your profile: {job.title} at GET IT!"
                body = f"""Hi {cand.name},

Our AI system matched your profile with a high confidence score for our new opening: {job.title}.

AI Reasoning: {result['reasoning']}

We'd love to have you officially apply for this role.

Best regards,
The Recruitment Team
"""
                try:
                    comms.send_email(to_email=cand.email, subject=subject, body=body)
                    invite_count += 1
                except Exception as e:
                    logger.error(f"Failed to send invite to {cand.name}: {e}")

        return f"Invited {invite_count} candidates for job {job_id}."
    finally:
        db.close()

@celery.task(name="process_resume_task")
def process_resume_task(file_path: str, jd_id: int):
    """
    Direct upload task.
    """
    db = SessionLocal()
    try:
        job = db.query(models.Job).get(jd_id)
        if not job:
            logger.warning(f"Job with ID {jd_id} not found for resume processing.")
            return "Job not found"
            
        text = parse_resume(file_path)
        embedding_service = EmbeddingService()
        resume_vec = embedding_service.get_embedding(text)
        
        result = rank_candidate(
            jd_text=job.description,
            resume_text=text,
            jd_embedding=job.embedding,
            resume_embedding=resume_vec,
            must_have_skills=job.required_skills or []
        )
        
        candidate = models.Candidate(
            name=os.path.basename(file_path),
            email="manual@upload.com",
            resume_text=text,
            job_id=job.id,
            score=result["final_score"],
            analysis=result["breakdown"],
            confidence_score=result["status"],
            explanation=result["reasoning"],
            embedding=resume_vec
        )
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        logger.info(f"Manually uploaded resume '{os.path.basename(file_path)}' processed for Job ID {jd_id}. Status: {result['status']}")
        return {"id": candidate.id, "status": result["status"]}
    except Exception as e:
        logger.error(f"Error processing manually uploaded resume {file_path} for Job ID {jd_id}: {e}")
        return str(e)
    finally:
        db.close()
