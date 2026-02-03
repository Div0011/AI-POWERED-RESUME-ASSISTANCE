from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas, auth

from services.matching import rank_candidate
from services.embedding import EmbeddingService
from services.resume_builder import ResumeBuilder
from services.analyzer import RequirementAnalyzer
from parser import parse_resume
import datetime
import os
import shutil
from loguru import logger

router = APIRouter(dependencies=[Depends(auth.get_current_user)])

@router.post("/parse")
async def parse_resume_content(file: UploadFile = File(...)):
    """
    Parses an uploaded resume file and returns the text.
    """
    try:
        os.makedirs("uploads", exist_ok=True)
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse
        text = parse_resume(file_path)
        
        # Cleanup
        os.remove(file_path)
        
        return {"filename": file.filename, "text": text}
    except Exception as e:
        logger.error(f"Error parsing file: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {str(e)}")

@router.post("/simulate", response_model=schemas.SimulationResponse)
def simulate_ats(req: schemas.SimulationRequest, db: Session = Depends(get_db)):
    """
    Simulates an ATS check for a candidate without saving them to the recruiter pipeline.
    """
    job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    embedding_service = EmbeddingService()
    resume_vec = embedding_service.get_embedding(req.resume_text)

    # Run the brain
    result = rank_candidate(
        jd_text=job.description,
        resume_text=req.resume_text,
        jd_embedding=job.embedding,
        resume_embedding=resume_vec,
        must_have_skills=job.required_skills or []
    )

    # Create student-friendly reasoning (less critical, more coaching-focused)
    student_prompt = f"Rewrite this recruiter-focused reasoning into a positive, helpful coaching feedback for a student: {result['reasoning']}"
    # For now, we'll just use a slightly modified version or call Gemini if needed.
    # To keep it fast, we'll prefix it.
    coaching_feedback = f"Here is how you can improve: {result['reasoning']}"

    # Save to simulations table
    sim = models.Simulation(
        resume_text=req.resume_text,
        job_id=req.job_id,
        score=result["final_score"],
        analysis={
            "missing_skills": result["missing_skills"],
            "matched_skills": result["matched_skills"],
            "breakdown": result["breakdown"]
        },
        student_reasoning=coaching_feedback,
        created_at=str(datetime.datetime.now())
    )

    db.add(sim)
    db.commit()

    return schemas.SimulationResponse(
        score=result["final_score"],
        missing_skills=result["missing_skills"],
        matched_skills=result["matched_skills"],
        student_reasoning=coaching_feedback
    )

@router.post("/improve-bullet", response_model=schemas.BulletImproveResponse)
def improve_bullet(req: schemas.BulletImproveRequest, db: Session = Depends(get_db)):
    """
    AI-powered bullet point improver.
    """
    try:
        job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        builder = ResumeBuilder()
        improved = builder.improve_bullet_point(req.bullet_point, job.description)
        
        return schemas.BulletImproveResponse(
            original=req.bullet_point,
            improved=improved
        )
    except Exception as e:
        logger.error(f"Error in improve_bullet endpoint: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
