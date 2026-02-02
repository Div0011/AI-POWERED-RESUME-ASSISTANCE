import os
from typing import List, Dict, Any
import google.generativeai as genai
from pydantic import BaseModel, Field
from loguru import logger
from dotenv import load_dotenv
from services.utils import retry_gemini

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.error("GEMINI_API_KEY not found in environment.")
else:
    genai.configure(api_key=api_key)

class JDRequirements(BaseModel):
    must_have_skills: List[str] = Field(description="Strict technical requirements or years of experience.")
    preferred_skills: List[str] = Field(description="Good to have skills.")
    summary: str = Field(description="Brief summary of the job role.")

class ResumeAnalysis(BaseModel):
    matched_must_haves: List[str] = Field(description="The must-have skills from the JD that are present in the resume.")
    missing_must_haves: List[str] = Field(description="The must-have skills from the JD that are not present in the resume.")
    reasoning: str = Field(description="Brief explanation of why the candidate was rated this way.")

class RequirementAnalyzer:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    @retry_gemini(max_retries=3, delay=10)
    def extract_requirements(self, jd_text: str) -> JDRequirements:
        """Extracts structured requirements from a JD text."""
        prompt = f"""
        Analyze the following Job Description and extract the 'Must-Have' technical skills and 'Preferred' skills.
        Be specific (e.g., '3+ years Python' instead of just 'Python').
        
        JD: {jd_text}
        
        Return only a JSON object matching the following structure:
        {{
            "must_have_skills": ["skill1", "skill2"],
            "preferred_skills": ["skill3"],
            "summary": "Short role summary"
        }}
        """
        response = self.model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return JDRequirements.model_validate_json(text)

    @retry_gemini(max_retries=3, delay=10)
    def analyze_resume_v_jd(self, resume_text: str, must_have_skills: List[str]) -> ResumeAnalysis:
        """Uses Gemini to smartly check if the candidate meets the must-have requirements."""
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
        response = self.model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return ResumeAnalysis.model_validate_json(text)

# Usage:
# analyzer = RequirementAnalyzer()
# jd_info = analyzer.extract_requirements("We need a Python dev with 5 years exp...")
# evaluation = analyzer.analyze_resume_v_jd("I am a junior dev...", jd_info.must_have_skills)
