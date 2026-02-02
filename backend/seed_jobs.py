import sys
import os
import json
from loguru import logger

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from database import SessionLocal, init_db, engine
from services.embedding import EmbeddingService
from services.analyzer import RequirementAnalyzer
import models

def seed_test_jobs():
    logger.info("Seeding Test Job Descriptions...")
    init_db()
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    embedding_service = EmbeddingService()
    analyzer = RequirementAnalyzer()

    cyber_sec_jd = """
    Job Title: Cyber Security Intern
    Location: Remote / Bangalore
    Requirements:
    - Must have knowledge of OWASP Top 10.
    - Familiarity with Network Security tools like Nmap, Wireshark.
    - Understanding of Penetration Testing methodologies.
    - Basic scripting in Python or Bash.
    """

    try:
        # Check if it already exists
        existing = db.query(models.Job).filter(models.Job.title == "Cyber Security Intern").first()
        if not existing:
            logger.info("Creating 'Cyber Security Intern' JD...")
            # 1. Extract requirements via Gemini
            requirements = analyzer.extract_requirements(cyber_sec_jd)
            
            # 2. Store in DB
            new_job = models.Job(
                title="Cyber Security Intern",
                description=cyber_sec_jd,
                required_skills=requirements.must_have_skills, # JSON column
                embedding=embedding_service.get_embedding(cyber_sec_jd)
            )
            db.add(new_job)
            db.commit()
            logger.info(f"Successfully added Cyber Security JD with {len(requirements.must_have_skills)} must-haves.")
        else:
            logger.info("Cyber Security JD already exists.")

    except Exception as e:
        logger.error(f"Failed to seed JD: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_jobs()
