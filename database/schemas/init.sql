-- GET IT! Database Schema Initialization
-- PostgreSQL 15+ with pgvector extension

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'candidate', -- 'recruiter' or 'candidate'
    company_name VARCHAR(255),
    phone VARCHAR(20),
    profile_image_url TEXT,
    firebase_uid VARCHAR(255) UNIQUE,
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    expanded_description TEXT, -- AI-expanded version
    requirements TEXT,
    skills TEXT[], -- Array of skills
    experience_level VARCHAR(50),
    salary_min INTEGER,
    salary_max INTEGER,
    location VARCHAR(255),
    job_type VARCHAR(50), -- 'Full-time', 'Part-time', 'Contract'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'filled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Candidates table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    resume_file_path VARCHAR(500),
    resume_text TEXT,
    parsed_resume JSONB, -- Structured resume data
    skills TEXT[],
    experience_years INTEGER,
    education JSONB,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume embeddings table (for vector search)
CREATE TABLE resume_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    embedding vector(384), -- all-MiniLM-L6-v2 dimensions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create HNSW index for vector similarity search
CREATE INDEX ON resume_embeddings USING hnsw (embedding vector_cosine_ops);

-- Candidate simulations (ATS scores)
CREATE TABLE candidate_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    llm_score FLOAT, -- 0-100 (from Gemini analysis)
    vector_score FLOAT, -- 0-100 (from cosine similarity)
    hybrid_score FLOAT, -- weighted average (60% LLM + 40% vector)
    matched_skills TEXT[],
    missing_skills TEXT[],
    match_reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews table
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    conversation_history JSONB, -- Array of messages
    ai_feedback TEXT,
    interview_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    feedback_type VARCHAR(50), -- 'acceptance', 'rejection', 'hold'
    feedback_text TEXT,
    given_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume improvements table (for resume builder)
CREATE TABLE resume_improvements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    improvement_type VARCHAR(50), -- 'bullet_enhancement', 'full_rewrite'
    original_content TEXT,
    improved_content TEXT,
    ai_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES users(id),
    job_id UUID NOT NULL REFERENCES jobs(id),
    total_applicants INTEGER DEFAULT 0,
    interviews_conducted INTEGER DEFAULT 0,
    offers_made INTEGER DEFAULT 0,
    positions_filled INTEGER DEFAULT 0,
    average_time_to_hire INTEGER, -- in days
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_candidates_user ON candidates(user_id);
CREATE INDEX idx_simulations_job ON candidate_simulations(job_id);
CREATE INDEX idx_simulations_candidate ON candidate_simulations(candidate_id);
CREATE INDEX idx_simulations_score ON candidate_simulations(hybrid_score DESC);
CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX idx_interviews_job ON interviews(job_id);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_analytics_recruiter ON analytics(recruiter_id);

-- Create views for common queries
CREATE VIEW talent_matrix AS
SELECT 
    cs.job_id,
    cs.candidate_id,
    u.email,
    u.full_name,
    cs.hybrid_score,
    cs.matched_skills,
    cs.missing_skills,
    cs.created_at
FROM candidate_simulations cs
JOIN candidates c ON cs.candidate_id = c.id
JOIN users u ON c.user_id = u.id
ORDER BY cs.job_id, cs.hybrid_score DESC;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
