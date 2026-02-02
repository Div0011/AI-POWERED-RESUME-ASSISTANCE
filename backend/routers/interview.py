from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from services.interviewer import InterviewService
from loguru import logger

router = APIRouter()
interviewer_service = InterviewService()

@router.post("/start", response_model=schemas.InterviewStepResponse)
def start_interview(req: schemas.InterviewStartRequest, db: Session = Depends(get_db)):
    """
    Initializes an interview session and returns the ice-breaker question.
    """
    job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    try:
        question = interviewer_service.generate_ice_breaker(job.description, req.resume_text)
        return schemas.InterviewStepResponse(next_question=question)
    except Exception as e:
        logger.error(f"Failed to start interview: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize interview")

@router.post("/respond", response_model=schemas.InterviewStepResponse)
def respond_interview(req: schemas.InterviewRespondRequest, db: Session = Depends(get_db)):
    """
    Processes the candidate's response and returns the next follow-up question.
    """
    job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    try:
        result = interviewer_service.conduct_interview_step(job.description, req.resume_text, req.history)
        return schemas.InterviewStepResponse(
            next_question=result["next_question"],
            hidden_evaluation=result["hidden_evaluation"]
        )
    except Exception as e:
        logger.error(f"Failed to process interview step: {e}")
        raise HTTPException(status_code=500, detail="Failed to continue interview")

@router.post("/feedback")
def get_interview_feedback(req: schemas.InterviewFeedbackRequest, db: Session = Depends(get_db)):
    """
    Generates final feedback after the interview ends.
    """
    job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    try:
        feedback = interviewer_service.generate_final_feedback(job.description, req.history)
        return {"feedback": feedback}
    except Exception as e:
        logger.error(f"Failed to generate feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate feedback report")
