from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "recruiter"

class Token(BaseModel):
    access_token: str
    token_type: str

class JobCreate(BaseModel):
    title: str
    description: str

class JobResponse(JobCreate):
    id: int
    required_skills: List[str]
    
    model_config = ConfigDict(from_attributes=True)

class CandidateResponse(BaseModel):
    id: int
    name: str
    score: float
    confidence_score: str
    explanation: str
    analysis: Dict
    
    model_config = ConfigDict(from_attributes=True)

class FeedbackCreate(BaseModel):
    rating: int
    comment: Optional[str] = None
