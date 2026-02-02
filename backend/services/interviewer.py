import os
import google.generativeai as genai
from loguru import logger
from dotenv import load_dotenv
from services.utils import retry_gemini

load_dotenv()

class InterviewService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not found.")
        else:
            genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    @retry_gemini(max_retries=3, delay=10)
    def generate_ice_breaker(self, jd_text: str, resume_text: str) -> str:
        """
        Generates the first question of the interview based on the JD and Resume.
        """
        prompt = f"""
        You are a Senior Technical Interviewer.
        
        Job Description: {jd_text}
        Candidate Resume: {resume_text}
        
        Instructions:
        1. Start by introducing yourself briefly.
        2. Ask one engaging ice-breaker question that relates the candidate's specific background to the job requirements.
        3. Do not ask multiple questions at once.
        4. Keep the tone professional but encouraging.
        
        Return ONLY the interviewer's spoken text.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()

    @retry_gemini(max_retries=3, delay=10)
    def conduct_interview_step(self, jd_text: str, resume_text: str, history: list) -> dict:
        """
        Takes the interview history and generates the next technical question or follow-up.
        Returns both the next question and a hidden evaluation of the previous answer.
        """
        history_str = "\n".join([f"{h['role']}: {h['content']}" for h in history])
        
        prompt = f"""
        You are a Senior Technical Interviewer.
        
        Job Description: {jd_text}
        Candidate Resume: {resume_text}
        
        Interview History so far:
        {history_str}
        
        Instructions:
        1. Evaluate the candidate's last response internally.
        2. Based on their answer, ask a follow-up question or transition to a new topic from the JD.
        3. Challenge them appropriately if they are vague. 
        4. Reference their resume projects if applicable.
        
        Return the response in the following JSON format:
        {{
            "next_question": "the interviewer's next question",
            "hidden_evaluation": "a brief 1-sentence assessment of their last answer for internal tracking"
        }}
        """
        response = self.model.generate_content(prompt)
        # Clean markdown if Gemini adds it
        text = response.text.replace('```json', '').replace('```', '').strip()
        import json
        return json.loads(text)

    @retry_gemini(max_retries=3, delay=10)
    def generate_final_feedback(self, jd_text: str, history: list) -> str:
        """
        Generates a summary report after the interview ends.
        """
        history_str = "\n".join([f"{h['role']}: {h['content']}" for h in history])
        
        prompt = f"""
        As a Senior Technical Interviewer, provide a final feedback report for the candidate based on this interview.
        
        Job Description: {jd_text}
        Interview History:
        {history_str}
        
        Provide the report in the following format:
        1. Strengths: (3 points)
        2. Areas for Improvement: (3 points)
        3. Final Verdict: (Selected / Needs more work)
        4. Summary: A 3-sentence overall summary.
        
        Keep it professional and constructive.
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()
