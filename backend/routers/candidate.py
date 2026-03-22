from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas, auth

from services.matching import rank_candidate
from services.embedding import EmbeddingService
from services.resume_builder import ResumeBuilder

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
    Performs deep resume analysis against job requirements.
    """
    try:
        # Validate resume content
        if not req.resume_text or len(req.resume_text.strip()) < 10:
            logger.warning(f"ATS Simulation: Resume too short (job_id={req.job_id})")
            raise HTTPException(status_code=400, detail="Resume must contain meaningful content")

        # Get job details
        job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
        if not job:
            logger.warning(f"ATS Simulation: Job not found (job_id={req.job_id})")
            raise HTTPException(status_code=404, detail="Job not found")

        logger.info(f"[ATS] Starting simulation for job_id={req.job_id}, resume_len={len(req.resume_text)}")

        # Generate embeddings for resume (skip for very short resumes)
        resume_vec = None
        if len(req.resume_text) > 50:
            try:
                embedding_service = EmbeddingService()
                resume_vec = embedding_service.get_embedding(req.resume_text)
                logger.info(f"[ATS] Embedding generated: {len(resume_vec) if resume_vec else 0} dimensions")
            except Exception as emb_err:
                logger.warning(f"[ATS] Embedding failed (continuing without): {str(emb_err)[:80]}")
                resume_vec = None
        else:
            logger.info(f"[ATS] Skipping embedding for short resume ({len(req.resume_text)} chars)")

        # Run the hybrid analysis (constraint + vector similarity)
        result = rank_candidate(
            jd_text=job.description,
            resume_text=req.resume_text,
            jd_embedding=job.embedding or [],
            resume_embedding=resume_vec or [],
            must_have_skills=job.required_skills or []
        )

        logger.info(f"[ATS] Analysis complete: score={result['final_score']:.2f}, matched={len(result['matched_skills'])}, missing={len(result['missing_skills'])}")

        # Convert score to 0-1 range if needed
        score = result["final_score"]
        if score > 1:
            score = score / 100.0

        # Create coaching-friendly feedback
        coaching_feedback = result.get('reasoning', 'Analysis complete')

        # Save to simulations table for record-keeping
        try:
            sim = models.Simulation(
                resume_text=req.resume_text,
                job_id=req.job_id,
                score=score,
                analysis={
                    "missing_skills": result["missing_skills"],
                    "matched_skills": result["matched_skills"],
                    "breakdown": result["breakdown"],
                    "status": result["status"]
                },
                student_reasoning=coaching_feedback,
                created_at=str(datetime.datetime.now())
            )
            db.add(sim)
            db.commit()
            logger.info(f"[ATS] Simulation record saved")
        except Exception as db_err:
            logger.warning(f"[ATS] Failed to save simulation record: {db_err}")
            db.rollback()
            # Don't fail the response if recording fails

        return schemas.SimulationResponse(
            score=score,
            missing_skills=result["missing_skills"],
            matched_skills=result["matched_skills"],
            student_reasoning=coaching_feedback
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ATS] Critical error during simulation: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Resume analysis failed. Please try again.")

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

@router.post("/improve-resume", response_model=schemas.ResumeImproveResponse)
def improve_resume(req: schemas.ResumeImproveRequest, db: Session = Depends(get_db)):
    """
    AI-powered full resume rewrite and data extraction.
    """
    try:
        builder = ResumeBuilder()
        result = builder.improve_full_resume(req.resume_text)
        
        return schemas.ResumeImproveResponse(
            improved_resume=result.get("improved_resume", ""),
            extracted_data=result.get("extracted_data", {})
        )
    except Exception as e:
        logger.error(f"Error in improve_resume endpoint: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/talent-pool/opt-in")
def opt_in_talent_pool(req: schemas.CandidateOptInRequest, db: Session = Depends(get_db)):
    """
    Opts the candidate into the global talent pool by creating a Candidate record with no specific job.
    """
    try:
        candidate = db.query(models.Candidate).filter(models.Candidate.email == req.candidate_email).first()
        resume_vec = None
        try:
            embedding_service = EmbeddingService()
            resume_vec = embedding_service.get_embedding(req.resume_text)
        except Exception as e:
            logger.error(f"Opt-in embedding failed: {e}")

        # Use provided name or default to email prefix
        cand_name = req.name if req.name else req.candidate_email.split('@')[0].capitalize()

        if not candidate:
            candidate = models.Candidate(
                name=cand_name,
                email=req.candidate_email,
                resume_text=req.resume_text,
                skills=req.skills,
                job_id=None,
                score=0.0,
                explanation="Opted into Global Talent Pool",
                embedding=resume_vec
            )
            db.add(candidate)
        else:
            candidate.name = cand_name
            candidate.resume_text = req.resume_text
            candidate.skills = req.skills if req.skills is not None else candidate.skills
            candidate.embedding = resume_vec
            candidate.explanation = "Opted into Global Talent Pool"
            
        db.commit()
        return {"status": "success", "message": "Successfully opted into Talent Pool"}
    except Exception as e:
        logger.error(f"Failed talent pool opt-in: {e}")
        raise HTTPException(status_code=500, detail="Failed to save to talent pool")

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
    Returns all jobs with FAST lightweight scoring for Mission Board.
    Uses vector similarity only (no AI analysis) for speed.
    Deep analysis happens only when user clicks "/simulate" endpoint.
    """
    import numpy as np
    
    jobs = db.query(models.Job).all()
    board = []
    
    try:
        embedding_service = EmbeddingService()
        resume_vec = embedding_service.get_embedding(req.resume_text)
    except Exception as e:
        logger.warning(f"[BOARD] Failed to generate resume embedding: {e}. Using keyword matching only.")
        resume_vec = None
    
    for job in jobs:
        # FAST SCORING: Vector similarity only (no AI calls)
        match_score = 0.0
        
        if resume_vec and job.embedding:
            try:
                jd_vec = np.array(job.embedding)
                res_vec = np.array(resume_vec)
                
                if np.linalg.norm(jd_vec) == 0 or np.linalg.norm(res_vec) == 0:
                    match_score = 0.0
                else:
                    # Cosine similarity (raw, no AI analysis)
                    match_score = float(np.dot(jd_vec, res_vec) / (np.linalg.norm(jd_vec) * np.linalg.norm(res_vec)))
            except Exception as e:
                logger.warning(f"[BOARD] Vector similarity calculation failed: {e}")
                match_score = 0.0
        
        # Simple keyword matching if no vectors available
        if match_score == 0 and job.required_skills:
            resume_lower = req.resume_text.lower()
            matched = sum(1 for skill in job.required_skills if skill.lower() in resume_lower)
            match_score = min(matched / len(job.required_skills), 1.0) if job.required_skills else 0.0
        
        board.append({
            "job_id": job.id,
            "title": job.title,
            "description": job.description,
            "company_name": job.company_name or "Tech Corp",
            "location": job.location or "Remote",
            "is_remote": job.is_remote,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "currency": job.currency,
            "employment_type": job.employment_type,
            "department": job.department,
            "required_skills": job.required_skills or [],
            "preferred_skills": job.preferred_skills or [],
            "years_experience": job.years_experience,
            "education_level": job.education_level,
            "benefits": job.benefits or [],
            "match_score": match_score,
            "missing_skills": [],  # Deep analysis happens on /simulate
            "matched_skills": [],  # Deep analysis happens on /simulate
            "reasoning": "Quick match preview - click job for detailed AI analysis"
        })
    
    logger.info(f"[BOARD] Loaded {len(board)} jobs with fast scoring")
    return board
