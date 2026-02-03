import os
import sys
import logging
import shutil
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
import uvicorn
from prometheus_fastapi_instrumentator import Instrumentator

# 1. Load Environment
load_dotenv()

# 2. Configure Sentry
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[FastApiIntegration()],
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )
    logger.info("Sentry initialized.")

# 3. Configure Loguru Interception
class InterceptHandler(logging.Handler):
    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

def setup_logging():
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(logging.INFO)

    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    logger.configure(handlers=[{"sink": sys.stdout, "serialize": False}])

setup_logging()
logger.info("GET IT! Backend starting up...")

# 4. Initialize Database
from database import engine, init_db
import models
init_db()
models.Base.metadata.create_all(bind=engine)

# 5. App Instance
app = FastAPI(title="GET IT! - AI Powered Resume screening API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://div0011.github.io",
        "https://div0011.github.io/AI-POWERED-RESUME-ASSISTANCE"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. Routers
from routers import auth, jobs, feedback, candidates, candidate, analytics, interview
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
app.include_router(candidate.router, prefix="/candidate", tags=["candidate"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])

# 7. Monitoring
Instrumentator().instrument(app).expose(app)

# 8. Imports and Celery
from agents.screening_agent import run_screening_agent
from parser import parse_resume
from worker import process_resume_task

@app.get("/")
async def root():
    return {"message": "Welcome to GET IT! production API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/submissions/")
async def submit_candidate_async(
    jd_text: str = Form(...), 
    file: UploadFile = File(...)
):
    try:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        task = process_resume_task.delay(file_path, jd_text)
        logger.info(f"Task {task.id} queued for file {file.filename}")
        
        return {
            "task_id": task.id,
            "status": "queued",
            "message": "Resume processing started in background."
        }
    except Exception as e:
        logger.error(f"Failed to submit candidate: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during submission")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)