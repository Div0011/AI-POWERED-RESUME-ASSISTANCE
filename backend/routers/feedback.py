from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.post("/{candidate_id}", status_code=201)
def create_feedback(candidate_id: int, feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    # Verify candidate exists
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    db_feedback = models.Feedback(**feedback.model_dump(), candidate_id=candidate_id)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return {"message": "Feedback recorded", "id": db_feedback.id}
