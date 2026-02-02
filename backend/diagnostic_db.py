import sys
import os
import json
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from database import SessionLocal, engine
import models
from services.embedding import EmbeddingService

def diagnostic():
    db = SessionLocal()
    try:
        # Check Job 1
        job = db.query(models.Job).first()
        if job:
            print(f"Job Embedding Type: {type(job.embedding)}")
            # print(f"Job Embedding Value (partial): {str(job.embedding)[:50]}")
        
        # Try to insert a dummy candidate
        logger.info("Testing dummy candidate insertion...")
        embedding_service = EmbeddingService()
        vec = [0.1] * 384
        
        candidate = models.Candidate(
            name="Diagnostic Test",
            email="test@example.com",
            resume_text="Hello world",
            job_id=job.id if job else None,
            score=0.9,
            analysis={"test": True},
            confidence_score="selected",
            explanation="Testing SQLite JSON binding",
            embedding=vec
        )
        db.add(candidate)
        db.commit()
        logger.info("Dummy candidate insertion successful!")
        
    except Exception as e:
        logger.error(f"Diagnostic failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnostic()
