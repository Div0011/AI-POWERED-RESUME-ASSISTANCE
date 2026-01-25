import os
from celery import Celery
from parser import parse_resume
from agents.screening_agent import run_screening_agent

# Initialize Celery
celery = Celery(__name__)
celery.conf.broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
celery.conf.result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

@celery.task(name="process_resume_task")
def process_resume_task(file_path: str, jd_text: str):
    """
    Background task to parse resume and run AI screening agent.
    """
    try:
        # 1. Parse PDF
        resume_text = parse_resume(file_path)
        
        # 2. Run Agent
        result = run_screening_agent(jd_text, resume_text)
        
        return {
            "status": "completed",
            "filename": os.path.basename(file_path),
            "analysis": result["analysis"],
            "confidence_score": result.get("confidence_score", "N/A"),
            "explanation": result["explanation"],
            "logs": result["logs"]
        }
    except Exception as e:
        return {"status": "failed", "error": str(e)}
