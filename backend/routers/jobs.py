from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth, database

from services.analyzer import ResumeAnalyzer  # Fixed: was RequirementAnalyzer
from services.embedding import EmbeddingService
import worker

router = APIRouter()

@router.post("/expand", response_model=schemas.JobExpandResponse)
def expand_job_keywords(
    req: schemas.JobExpandRequest,
    current_user: models.User = Depends(auth.RoleChecker("recruiter"))
):
    analyzer = ResumeAnalyzer()  # Fixed: was RequirementAnalyzer
    try:
        result = analyzer.generate_job_description(req.keywords)
        return schemas.JobExpandResponse(
            suggested_title=result["suggested_title"],
            suggested_description=result["suggested_description"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=schemas.JobResponse)
def create_job(
    job: schemas.JobCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.RoleChecker("recruiter"))
):
    import logging
    logger = logging.getLogger(__name__)
    
    # 1. Extract structured requirements using Gemini (with error handling)
    required_skills = []
    try:
        analyzer = ResumeAnalyzer()
        extracted_reqs = analyzer.extract_jd_requirements(job.description)
        required_skills = extracted_reqs.must_have_skills
        logger.info(f"Extracted {len(required_skills)} required skills")
    except Exception as e:
        logger.warning(f"Failed to extract requirements via AI: {e}")
        # Continue without AI-extracted skills - job can still be created
        required_skills = []
    
    # 2. Generate embedding for the job description (with error handling)
    job_vec = None
    try:
        embedder = EmbeddingService()
        job_vec = embedder.get_embedding(job.description)
        logger.info("Generated job embedding successfully")
    except Exception as e:
        logger.warning(f"Failed to generate embedding: {e}")
        # Continue without embedding - matching will be keyword-based only
        job_vec = None
    
    # 3. Save Job to DB (this should always work)
    try:
        new_job = models.Job(
            title=job.title,
            description=job.description,
            required_skills=required_skills,
            owner_id=current_user.id,
            embedding=job_vec
        )
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
        logger.info(f"Job created successfully: ID {new_job.id}")
    except Exception as e:
        logger.error(f"Database error creating job: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save job to database: {str(e)}")

    # 4. Trigger Background Matcher (Celery) - non-blocking
    try:
        worker.match_existing_candidates_to_new_job.delay(new_job.id)
        logger.info(f"Background matching triggered for job {new_job.id}")
    except Exception as e:
        # Don't fail the request if Celery/Redis is down
        logger.warning(f"Celery task trigger failed: {e}")

    return new_job

@router.get("/", response_model=List[schemas.JobResponse])
def get_jobs(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role == "candidate":
        return db.query(models.Job).all()
    return db.query(models.Job).filter(models.Job.owner_id == current_user.id).all()

@router.get("/{job_id}", response_model=schemas.JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
