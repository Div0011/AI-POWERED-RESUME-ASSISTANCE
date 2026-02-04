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
@router.post("/apply", response_model=schemas.ApplicationResponse)
def apply_to_mission(req: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    """
    Neural Apply: Creates/Updates a Candidate record + creates an Application record.
    """
    job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Mission not found")

    embedding_service = EmbeddingService()
    
    # 1. Process match analysis
    try:
        resume_vec = embedding_service.get_embedding(req.resume_text)
        analysis = rank_candidate(
            jd_text=job.description,
            resume_text=req.resume_text,
            jd_embedding=job.embedding,
            resume_embedding=resume_vec,
            must_have_skills=job.required_skills or []
        )
    except Exception as e:
        logger.error(f"Application analysis failed: {e}")
        # Default analysis if AI fails
        resume_vec = None
        analysis = {
            "final_score": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "reasoning": "Analysis failed temporarily.",
            "breakdown": {}
        }

    # 2. Update or Create Candidate record (Talent Matrix)
    # This keeps the recruiter's candidate list up to date
    candidate = db.query(models.Candidate).filter(models.Candidate.email == req.candidate_email).first()
    if not candidate:
        candidate = models.Candidate(
            name=req.candidate_email.split('@')[0].capitalize(),
            email=req.candidate_email,
            resume_text=req.resume_text,
            job_id=req.job_id,
            score=analysis["final_score"],
            analysis={
                "missing_skills": analysis.get("missing_skills", []),
                "matched_skills": analysis.get("matched_skills", []),
                "breakdown": analysis.get("breakdown", {})
            },
            explanation=analysis["reasoning"],
            embedding=resume_vec
        )
        db.add(candidate)
    else:
        # Update existing candidate data
        candidate.resume_text = req.resume_text
        candidate.job_id = req.job_id
        candidate.score = analysis["final_score"]
        candidate.analysis = {
            "missing_skills": analysis.get("missing_skills", []),
            "matched_skills": analysis.get("matched_skills", []),
            "breakdown": analysis.get("breakdown", {})
        }
        candidate.explanation = analysis["reasoning"]
        candidate.embedding = resume_vec

    db.commit()
    db.refresh(candidate)

    # 3. Create Application record
    new_app = models.Application(
        job_id=req.job_id,
        candidate_email=req.candidate_email,
        resume_text=req.resume_text,
        match_score=analysis["final_score"],
        matched_skills=analysis.get("matched_skills", []),
        missing_skills=analysis.get("missing_skills", []),
        status="pending"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    return new_app

@router.post("/board")
def get_mission_board(req: schemas.SimulationRequest, db: Session = Depends(get_db)):
    """
    Returns all jobs with match analysis specialized for the Mission Board.
    """
    jobs = db.query(models.Job).all()
    board = []
    
    embedding_service = EmbeddingService()
    resume_vec = embedding_service.get_embedding(req.resume_text)
    
    for job in jobs:
        # Run the brain
        result = rank_candidate(
            jd_text=job.description,
            resume_text=req.resume_text,
            jd_embedding=job.embedding,
            resume_embedding=resume_vec,
            must_have_skills=job.required_skills or []
        )
        
        board.append({
            "job_id": job.id,
            "title": job.title,
            "description": job.description,
            "match_score": result["final_score"],
            "missing_skills": result["missing_skills"],
            "matched_skills": result["matched_skills"],
            "reasoning": result["reasoning"]
        })
        
    return board
