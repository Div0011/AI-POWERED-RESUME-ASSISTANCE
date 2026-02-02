import sys
import os
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from services.resume_builder import ResumeBuilder
from database import SessionLocal
import models

def test_bullet_point_improver():
    logger.info("Testing Bullet Point Improver...")
    builder = ResumeBuilder()
    
    jd = "Must have 3 years of React experience. Experience with performance optimization and TypeScript is a plus."
    original = "I built some features in a React app."
    
    improved = builder.improve_bullet_point(original, jd)
    print(f"\nOriginal: {original}")
    print(f"Improved: {improved}\n")
    
    assert "React" in improved
    logger.info("Bullet Point Improver Test Passed!")

def test_candidates_api_data():
    logger.info("Verifying Candidate DB State...")
    db = SessionLocal()
    try:
        candidates = db.query(models.Candidate).all()
        print(f"Total Candidates in DB: {len(candidates)}")
        for c in candidates:
            print(f"ID: {c.id} | Email: {c.email} | Status: {c.confidence_score} | Reasoning: {c.explanation[:50]}...")
    finally:
        db.close()

if __name__ == "__main__":
    test_bullet_point_improver()
    test_candidates_api_data()
