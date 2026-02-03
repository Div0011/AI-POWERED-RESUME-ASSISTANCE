from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import List, Optional, Dict, Any

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "candidate" # Default role

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    token: str

class GoogleSignupRequest(BaseModel):
    token: str
    role: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class JobCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=10)

class JobResponse(JobCreate):
    id: int
    required_skills: List[str] = []
    
    model_config = ConfigDict(from_attributes=True)

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    resume_text: str
    job_id: int

class CandidateResponse(BaseModel):
    id: int
    name: str
    email: str
    score: Optional[float] = None
    confidence_score: Optional[str] = None
    explanation: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None
    job_id: Optional[int] = None
    job_title: Optional[str] = None
    is_cross_match: bool = False
    
    model_config = ConfigDict(from_attributes=True)

class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class SimulationRequest(BaseModel):
    resume_text: str
    job_id: int

class SimulationResponse(BaseModel):
    score: float
    missing_skills: List[str]
    matched_skills: List[str]
    student_reasoning: str
    
    model_config = ConfigDict(from_attributes=True)

class BulletImproveRequest(BaseModel):
    bullet_point: str
    job_id: int

class BulletImproveResponse(BaseModel):
    original: str
    improved: str

class VectorSearchRequest(BaseModel):
    query: str
    top_k: int = 10

class VectorSearchCandidateResponse(CandidateResponse):
    similarity: float

class AnalyticsSkillGap(BaseModel):
    skill: str
    count: int

class AnalyticsScoreBin(BaseModel):
    bin: str
    count: int

class AnalyticsSummaryResponse(BaseModel):
    total_resumes: int
    avg_score: float
    top_missing_skill: str
    interview_ready_count: int
    skill_gaps: List[AnalyticsSkillGap]
    score_distribution: List[AnalyticsScoreBin]

class InterviewStartRequest(BaseModel):
    job_id: int
    resume_text: str

class InterviewRespondRequest(BaseModel):
    job_id: int
    resume_text: str
    history: List[Dict[str, str]] # List of {"role": "interviewer/candidate", "content": "..."}

class InterviewStepResponse(BaseModel):
    next_question: str
    hidden_evaluation: Optional[str] = None

class InterviewFeedbackRequest(BaseModel):
    job_id: int
    history: List[Dict[str, str]]
