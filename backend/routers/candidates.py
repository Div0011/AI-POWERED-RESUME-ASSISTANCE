from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth
from loguru import logger

router = APIRouter(dependencies=[Depends(auth.RoleChecker("recruiter"))])

@router.get("/", response_model=List[schemas.CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    """
    Returns all candidates with their scores, status, and reasoning.
    """
    try:
        candidates = db.query(models.Candidate).all()
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
                similarity = float(dot_product / (norm_q * norm_c))
            except Exception as e:
                logger.error(f"Error calculating similarity for candidate {cand.id}: {e}")
                continue

            if similarity > 0.35: # Low threshold for search relevance
                # Flag as cross-job match if the job title doesn't contain the search query keywords
                is_cross = False
                if job_title and req.query.lower() not in job_title.lower():
                    # If similarity is high but job title doesn't match, it's a cross-match
                    if similarity > 0.6:
                        is_cross = True

                results.append({
                    "id": cand.id,
                    "name": cand.name,
                    "email": cand.email,
                    "score": cand.score,
                    "confidence_score": cand.confidence_score,
                    "explanation": cand.explanation,
                    "analysis": cand.analysis,
                    "job_id": cand.job_id,
                    "job_title": job_title or "No Job Assigned",
                    "is_cross_match": is_cross,
                    "similarity": similarity
                })
        
        # Sort by similarity
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:req.top_k]

    except Exception as e:
        logger.error(f"Global vector search failed: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Search failed")
