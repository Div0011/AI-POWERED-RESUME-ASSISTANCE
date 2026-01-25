from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Powered Resume Screening API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from agents.screening_agent import run_screening_agent
from parser import parse_resume
import shutil

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Powered Resume Screening API"}

from prometheus_fastapi_instrumentator import Instrumentator
from routers import auth, jobs, feedback
import models
from database import engine, SessionLocal
from sqlalchemy import text
from worker import process_resume_task # Import Celery Task

# Ensure Vector Extension (Postgres only)
try:
    with engine.connect() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        connection.commit()
except Exception as e:
    print(f"Warning: Could not create vector extension (ignore if using SQLite): {e}")

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])

# Setup Prometheus
Instrumentator().instrument(app).expose(app)

@app.post("/submissions/")
async def submit_candidate_async(
    jd_text: str = Form(...), 
    file: UploadFile = File(...)
):
    """
    Async submission endpoint. Returns a Task ID immediately.
    """
    # Save file permanently to uploads directory
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Trigger Celery Task
    task = process_resume_task.delay(file_path, jd_text)
    
    return {
        "task_id": task.id,
        "status": "queued",
        "message": "Resume processing started in background."
    }

@app.post("/process-candidate/")
async def process_candidate(
    jd_text: str = Form(...), 
    file: UploadFile = File(...)
):
    # Save file permanently to uploads directory
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # 1. Parse PDF
        resume_text = parse_resume(file_path)
        
        # 2. Run Agent
        result = run_screening_agent(jd_text, resume_text)
        
        # 3. Calculate Hybrid Score (New)
        from services.matching import rank_candidate
        hybrid_score = rank_candidate(jd_text, resume_text, result["analysis"])
        
        return {
            "filename": file.filename,
            "analysis": result["analysis"],
            "confidence_score": result["confidence_score"],
            "explanation": result["explanation"],
            "logs": result["logs"],
            "scores": hybrid_score # detailed breakdown
        }
    except Exception as e:
        # Only cleanup on error if needed, or just leave it
        print(f"Error processing file: {e}")
        raise e

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
