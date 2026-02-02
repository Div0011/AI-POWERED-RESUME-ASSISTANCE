import os
import google.generativeai as genai
from loguru import logger
from dotenv import load_dotenv
from services.utils import retry_gemini

load_dotenv()

class ResumeBuilder:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not found. ResumeBuilder will fail.")
        else:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    @retry_gemini(max_retries=3, delay=10)
    def improve_bullet_point(self, bullet_point: str, jd_context: str) -> str:
        """
        Rewrites a resume bullet point to better align with the specific 
        Must-Have requirements of a Job Description while maintaining truthfulness.
        """
        prompt = f"""
        You are an expert AI Resume Builder.
        Given a candidate's current bullet point and the context of a Job Description (JD), 
        rewrite the bullet point to be more high-impact, metrics-driven, and aligned with 
        the 'Must-Haves' of the JD. 
        
        Candidate's Original Bullet: "{bullet_point}"
        Job Description / Requirements: "{jd_context}"
        
        Instructions:
        1. Use strong action verbs.
        2. Quantify results if possible (even if you have to use [X]% as a placeholder).
        3. Explicitly touch upon the Must-Have keywords from the JD if applicable.
        4. Keep it concise (1-2 lines).
        
        Return ONLY the improved bullet point. No preamble.
        """
        
        response = self.model.generate_content(prompt)
        improved_text = response.text.strip()
        
        logger.info(f"ResumeBuilder -> Improved: '{bullet_point[:30]}...' -> '{improved_text[:30]}...'")
        return improved_text
