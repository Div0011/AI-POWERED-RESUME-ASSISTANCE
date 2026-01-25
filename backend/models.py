from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from database import Base
from pgvector.sqlalchemy import Vector

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="viewer") # 'recruiter' or 'viewer'

    jobs = relationship("Job", back_populates="owner")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    required_skills = Column(JSON) # List of strings
    owner_id = Column(Integer, ForeignKey("users.id"))
    embedding = Column(Vector(384)) # Embedding for Job Description

    owner = relationship("User", back_populates="jobs")
    candidates = relationship("Candidate", back_populates="job")

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String)
    resume_text = Column(Text)
    skills = Column(JSON) # Extracted skills
    experience_years = Column(Float)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    score = Column(Float)
    analysis = Column(JSON) # Full analysis result
    confidence_score = Column(String)
    explanation = Column(Text)
    embedding = Column(Vector(384)) # Embedding for Resume

    job = relationship("Job", back_populates="candidates")
    feedback = relationship("Feedback", back_populates="candidate")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    rating = Column(Integer)
    comment = Column(Text)
    
    candidate = relationship("Candidate", back_populates="feedback")
