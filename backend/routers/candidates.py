from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas, auth
from loguru import logger

router = APIRouter(dependencies=[Depends(auth.RoleChecker("recruiter"))])

@router.get("/", response_model=List[schemas.CandidateResponse])
def get_candidates(job_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Returns all candidates with their scores, status, and reasoning.
    Optionally filters by job_id for specific 'Mission' dashboarding.
    """
    try:
        query = db.query(models.Candidate)
        if job_id:
            query = query.filter(models.Candidate.job_id == job_id)
        
        candidates = query.all()
        return candidates
    except Exception as e:
        logger.error(f"Error fetching candidates: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """
    Returns details for a specific candidate.
    """
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.post("/{candidate_id}/approve")
def approve_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """
    Sets status to 'selected' and sends acceptance email.
    """
    from services.communication import CommunicationService
    candidate = db.query(models.Candidate).get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    candidate.confidence_score = "selected"
    
    # Update application status if it exists
    app = db.query(models.Application).filter(
        models.Application.candidate_id == candidate_id,
        models.Application.job_id == candidate.job_id
    ).first()
    if app:
        app.status = "selected"
        
    db.commit()
    
    try:
        comm = CommunicationService()
        comm.process_decision(candidate_id, "accept", db)
        return {"status": "success", "message": "Candidate approved and email sent."}
    except Exception as e:
        logger.error(f"Failed to send approval email: {e}")
        return {"status": "partial_success", "message": "Status updated but email failed."}

@router.post("/{candidate_id}/decline")
def decline_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """
    Sets status to 'rejected' and sends rejection email.
    """
    from services.communication import CommunicationService
    candidate = db.query(models.Candidate).get(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    candidate.confidence_score = "rejected"
    
    # Update application status if it exists
    app = db.query(models.Application).filter(
        models.Application.candidate_id == candidate_id,
        models.Application.job_id == candidate.job_id
    ).first()
    if app:
        app.status = "rejected"
        
    db.commit()
    
    try:
        comm = CommunicationService()
        comm.process_decision(candidate_id, "reject", db)
        return {"status": "success", "message": "Candidate declined and email sent."}
    except Exception as e:
        logger.error(f"Failed to send rejection email: {e}")
        return {"status": "partial_success", "message": "Status updated but email failed."}

@router.post("/vector-search", response_model=List[schemas.VectorSearchCandidateResponse])
def vector_search_candidates(req: schemas.VectorSearchRequest, db: Session = Depends(get_db)):
    """
    Performs a semantic search across all candidates using vector embeddings.
    """
    try:
        from services.embedding import EmbeddingService
        import numpy as np
        import json

        embedder = EmbeddingService()
        query_vec = embedder.get_embedding(req.query)
        
        # Fetch candidates with job info
        candidates = db.query(models.Candidate, models.Job.title).join(
            models.Job, models.Candidate.job_id == models.Job.id, isouter=True
        ).all()
        
        results = []
        for cand, job_title in candidates:
            if not cand.embedding:
                continue
                
            # Parse embedding from JSON string if needed (SQLite compatibility)
            try:
                # SQLite stores JSON as string, but maybe it's already a list if using a custom type
                cand_vec = json.loads(cand.embedding) if isinstance(cand.embedding, str) else cand.embedding
                
                # Cosine Similarity
                dot_product = np.dot(query_vec, cand_vec)
                norm_q = np.linalg.norm(query_vec)
                norm_c = np.linalg.norm(cand_vec)
                
                similarity = dot_product / (norm_q * norm_c) if (norm_q * norm_c) > 0 else 0
                
                results.append({
                    "candidate_id": cand.id,
                    "job_title": job_title,
                    "similarity_score": float(similarity),
                    "resume_text": cand.resume_text[:100]
                })
            except Exception as e:
                logger.warning(f"Error processing candidate {cand.id}: {e}")
                continue
        
        # Sort by similarity descending
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:req.top_k]
        
    except Exception as e:
        logger.error(f"Vector search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")


