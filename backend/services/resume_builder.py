import os
from google import genai
from loguru import logger
from dotenv import load_dotenv
from services.utils import retry_gemini_with_fallback

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

class ResumeBuilder:
    def __init__(self):
        api_key = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
        if not api_key:
            logger.error("GOOGLE_GENERATIVE_AI_API_KEY not found. ResumeBuilder will fail.")
            self.client = None
        else:
            self.client = genai.Client(api_key=api_key)
        self.model = 'gemini-2.0-flash'

    @retry_gemini_with_fallback(max_retries=3, delay=10)
    def improve_bullet_point(self, bullet_point: str, jd_context: str) -> str:
        """
        Rewrites a resume bullet point to better align with the specific 
        Must-Have requirements of a Job Description while maintaining truthfulness.
        """
        if not self.client:
            raise RuntimeError("Gemini client not initialized")
            
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
        
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        improved_text = response.text.strip()
        
        logger.info(f"ResumeBuilder -> Improved: '{bullet_point[:30]}...' -> '{improved_text[:30]}...'")
        return improved_text

    @retry_gemini_with_fallback(max_retries=3, delay=10)
    def improve_full_resume(self, resume_text: str) -> dict:
        """
        Rewrites the entire resume to be ATS friendly and extracts PII/Key info.
        Returns a JSON object with:
        - improved_resume (str)
        - extracted_data (dict inside of name, email, phone, location, skills, expected_salary)
        """
        if not self.client:
            raise RuntimeError("Gemini client not initialized")
            
        prompt = f"""
        You are an expert ATS Resume Optimizer and AI Recruiter.
        I will provide you with a raw resume text.
        Your tasks:
        1. Improve the entire resume. Fix formatting (use clear Markdown sections), enhance bullet points using impact-driven metrics and strong action verbs, and make sure it is extremely ATS-friendly. Keep it professional.
        2. Extract key candidate details from the original text: name, email, phone, location, a list of up to 10 top technical/soft skills, and their expected salary (if mentioned, otherwise null).

        Return ONLY a raw JSON strictly adhering to the following structure (do NOT wrap in ```json ... ``` tags):
        {{
            "improved_resume": "The full improved resume text in Markdown format...",
            "extracted_data": {{
                "name": "Jane Doe",
                "email": "jane@example.com",
                "phone": "555-1234",
                "location": "New York, NY",
                "skills": ["Python", "React", "Project Management"],
                "expected_salary": "$100k (or null if not found)"
            }}
        }}

        Raw Resume: 
        {resume_text}
        """

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        
        raw_text = response.text.strip()
        
        # Clean up in case Gemini wraps in markdown codeblocks anyway
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        import json
        try:
            parsed = json.loads(raw_text.strip())
            return parsed
        except Exception as e:
            logger.error(f"Failed to parse JSON from AI resume builder: {e}")
            raise ValueError("AI returned malformed JSON structure")
