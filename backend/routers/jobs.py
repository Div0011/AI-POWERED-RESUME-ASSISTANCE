from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth, database

from services.analyzer import RequirementAnalyzer
from services.embedding import EmbeddingService
import worker

router = APIRouter()

@router.post("/", response_model=schemas.JobResponse)
def create_job(
    job: schemas.JobCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.RoleChecker("recruiter"))
):
    # 1. Extract structured requirements using Gemini
    analyzer = RequirementAnalyzer()
    extracted_reqs = analyzer.extract_requirements(job.description)
    
    # 2. Generate embedding for the job description
    embedder = EmbeddingService()
    job_vec = embedder.get_embedding(job.description)
    
    # 3. Save Job to DB
    new_job = models.Job(
        title=job.title,
        description=job.description,
        required_skills=extracted_reqs.must_have_skills,
        owner_id=current_user.id,
        embedding=job_vec
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # 4. Trigger Background Matcher (Celery)
    try:
        worker.match_existing_candidates_to_new_job.delay(new_job.id)
    except Exception as e:
        # Don't fail the request if Celery/Redis is down
        print(f"Celery mismatch trigger failed: {e}")

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
