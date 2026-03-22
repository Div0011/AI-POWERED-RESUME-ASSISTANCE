"""
Database seed script - Initial data for GET IT!
Run this after database initialization
"""

import json
from datetime import datetime, timedelta

# Sample data for database seeding

SAMPLE_JOBS = [
    {
        "title": "Senior Full Stack Engineer",
        "description": "Looking for an experienced full stack engineer to join our growing team",
        "requirements": "5+ years experience with TypeScript, React, Node.js, PostgreSQL",
        "skills": ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        "experience_level": "senior",
        "salary_min": 120000,
        "salary_max": 160000,
        "location": "San Francisco, CA",
        "job_type": "Full-time"
    },
    {
        "title": "Product Manager",
        "description": "Lead product strategy and development for our AI platform",
        "requirements": "3+ years PM experience, background in AI/ML preferred",
        "skills": ["Product Strategy", "Data Analysis", "Python", "Machine Learning"],
        "experience_level": "mid",
        "salary_min": 140000,
        "salary_max": 180000,
        "location": "Remote",
        "job_type": "Full-time"
    },
    {
        "title": "DevOps Engineer",
        "description": "Build and maintain our cloud infrastructure",
        "requirements": "3+ years DevOps experience with Kubernetes",
        "skills": ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
        "experience_level": "mid",
        "salary_min": 100000,
        "salary_max": 140000,
        "location": "Remote",
        "job_type": "Full-time"
    }
]

SAMPLE_CANDIDATES = [
    {
        "full_name": "Alice Johnson",
        "email": "alice@example.com",
        "phone": "+1-555-0123",
        "skills": ["TypeScript", "React", "Node.js", "PostgreSQL"],
        "experience_years": 6,
        "linkedin_url": "https://linkedin.com/in/alicejohnson",
        "github_url": "https://github.com/alicejohnson"
    },
    {
        "full_name": "Bob Smith",
        "email": "bob@example.com",
        "phone": "+1-555-0124",
        "skills": ["Python", "Machine Learning", "Data Analysis", "Product Management"],
        "experience_years": 4,
        "linkedin_url": "https://linkedin.com/in/bobsmith",
        "portfolio_url": "https://bobsmith.portfolio.com"
    },
    {
        "full_name": "Carol White",
        "email": "carol@example.com",
        "phone": "+1-555-0125",
        "skills": ["Docker", "Kubernetes", "AWS", "Terraform"],
        "experience_years": 5,
        "linkedin_url": "https://linkedin.com/in/carolwhite",
        "github_url": "https://github.com/carolwhite"
    }
]

ATS_THRESHOLDS = {
    "high_match": 80,
    "medium_match": 60,
    "low_match": 40
}

print("Database seed data prepared")
print(f"Sample jobs: {len(SAMPLE_JOBS)}")
print(f"Sample candidates: {len(SAMPLE_CANDIDATES)}")
