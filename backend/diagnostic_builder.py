import sys
import os
from loguru import logger
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

load_dotenv()

from services.resume_builder import ResumeBuilder
from database import SessionLocal
import models

def diagnostic():
    db = SessionLocal()
    try:
        job = db.query(models.Job).filter(models.Job.id == 1).first()
        if not job:
            print("Job 1 not found. Please seed.")
            return
        
        print(f"JD Context: {job.description[:50]}...")
        builder = ResumeBuilder()
        bullet = "I fixed some bugs in Python"
        print(f"Original Bullet: {bullet}")
        
        improved = builder.improve_bullet_point(bullet, job.description)
        print(f"Improved Bullet: {improved}")
        
    except Exception as e:
        logger.error(f"Diagnostic failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnostic()
