import os
from typing import List, Dict, Any
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from loguru import logger
from dotenv import load_dotenv
from services.utils import retry_gemini_with_fallback

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

# Configure Gemini with new SDK
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY not found in environment.")
    client = None
else:
    client = genai.Client(api_key=api_key)
    logger.info("✅ Gemini client initialized with new SDK")

class JDRequirements(BaseModel):
    must_have_skills: List[str] = Field(description="Strict technical requirements or years of experience.")
    preferred_skills: List[str] = Field(description="Good to have skills.")
    summary: str = Field(description="Brief summary of the job role.")

class ResumeAnalysis(BaseModel):
    matched_must_haves: List[str] = Field(description="The must-have skills from the JD that are present in the resume.")
    missing_must_haves: List[str] = Field(description="The must-have skills from the JD that are not present in the resume.")
    reasoning: str = Field(description="A brief explanation of why the resume matches or doesn't match.")

class ResumeAnalyzer: # Renamed from RequirementAnalyzer
    def __init__(self):
        self.client = client
        self.model_name = 'gemini-2.0-flash-exp'  # Default model
        logger.info(f"ResumeAnalyzer initialized with model: {self.model_name}")

    @retry_gemini_with_fallback(max_retries=3, delay=10)
    def extract_jd_requirements(self, jd_text: str) -> JDRequirements: # Renamed from extract_requirements
        """Extracts structured requirements from a job description using Gemini."""
        if not self.client:
            raise RuntimeError("Gemini client not initialized. GEMINI_API_KEY might be missing.")
        
        prompt = f"""
        Analyze this job description and extract:
        1. Must-have skills (technical requirements, years of experience, certifications)
        2. Preferred/nice-to-have skills
        3. A brief summary of the role
        
        Job Description:
        {jd_text}
        
        Return only a JSON object matching this structure:
        {{
            "must_have_skills": ["skill1", "skill2"],
            "preferred_skills": ["skill3", "skill4"],
            "summary": "Brief role summary"
        }}
        """
        model = self.client.get_model(self.model_name)
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return JDRequirements.model_validate_json(text)

    @retry_gemini_with_fallback(max_retries=3, delay=10)
    def analyze_resume_v_jd(self, resume_text: str, must_have_skills: List[str]) -> ResumeAnalysis:
        """Uses Gemini to smartly check if the candidate meets the must-have requirements."""
        if not self.client:
            raise RuntimeError("Gemini client not initialized. GEMINI_API_KEY might be missing.")
        
        prompt = f"""
        Compare this Resume against the following Must-Have requirements.
        Be critical. If a requirement is '3 years of React' and they only have 1, it is MISSING.
        
        Must-Have Requirements: {must_have_skills}
        Resume: {resume_text}
        
        Return only a JSON object matching this structure:
        {{
            "matched_must_haves": ["requirement match 1"],
            "missing_must_haves": ["requirement missing 1"],
            "reasoning": "A 2-sentence explanation of the match quality."
        }}
        """
        model = self.client.get_model(self.model_name)
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return ResumeAnalysis.model_validate_json(text)

    @retry_gemini_with_fallback(max_retries=3, delay=10)
    def generate_job_description(self, keywords: List[str]) -> Dict[str, str]:
        """Expands keywords into a full, high-fidelity Job Description using Gemini."""
        if not self.client:
            raise RuntimeError("Gemini client not initialized. GEMINI_API_KEY might be missing.")
        
        prompt = f"""
        Act as a Senior Technical Recruiter and Engineering Manager. 
        Expand the following keywords into a professional, high-performance Job Description.
        
        Keywords: {", ".join(keywords)}
        
        The description must include:
        1. A compelling 'Mission Statement' for the role.
        2. 'Technical Stack' requirements.
        3. 'Soft Skills' and culture fit.
        4. Clear 'Responsibilities'.
        
        Format the output as a Markdown string. Also suggest a high-impact 'Job Title'.
        
        Return only a JSON object matching this structure:
        {{
            "suggested_title": "Senior Backend Engineer",
            "suggested_description": "# Role: ... \n\n## Mission: ... \n\n## Tech Stack: ..."
        }}
        """
        model = self.client.get_model(self.model_name)
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        import json
        return json.loads(text)

# Usage:
# analyzer = RequirementAnalyzer()
# jd_info = analyzer.extract_requirements("We need a Python dev with 5 years exp...")
# evaluation = analyzer.analyze_resume_v_jd("I am a junior dev...", jd_info.must_have_skills)
