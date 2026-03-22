import os
from loguru import logger
from dotenv import load_dotenv
from services.utils import retry_gemini_with_fallback
import json
from google import genai

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

class InterviewService:
    def __init__(self):
        api_key = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
        if not api_key:
            logger.error("GOOGLE_GENERATIVE_AI_API_KEY not found.")
            self.client = None
        else:
            self.client = genai.Client(api_key=api_key)
            # Use primary model with fallback chain
            self.model = "gemini-2.0-flash-exp"
            self.model_fallbacks = [
                "gemini-2.0-flash-exp",
                "gemini-1.5-flash",
                "gemini-1.5-flash-8b",
                "gemini-1.5-pro"
            ]
            logger.info("[SUCCESS] InterviewService initialized with 4-model fallback chain")

    @retry_gemini_with_fallback(max_retries=3, delay=2)
    def generate_ice_breaker(self, jd_text: str, resume_text: str) -> str:
        if not self.client:
            raise RuntimeError("Gemini client not initialized.")

        prompt = f"""
        You are an elite Senior FAANG Technical Interviewer. You are meeting the candidate for the first time.
        
        Job Description: {jd_text}
        Candidate Resume: {resume_text}
        
        Instructions:
        1. Start by introducing yourself briefly as the Lead Staff Engineer.
        2. Set a professional, slightly intense but encouraging tone.
        3. Ask exactly one initial opening question. It must combine their past experience with the complexity required by this job description.
        4. Focus on deep understanding: "I see you have experience with [Technology], can you walk me through the hardest architectural challenge you solved with it?"
        5. Do not ask multiple questions.
        
        Return ONLY the interviewer's spoken text.
        """
        
        for model in self.model_fallbacks:
            try:
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                logger.info(f"Ice breaker generated using {model}")
                return response.text.strip()
            except Exception as e:
                logger.warning(f"Model {model} failed: {e}")
                continue
        
        raise RuntimeError("All models failed to generate ice breaker")

    @retry_gemini_with_fallback(max_retries=3, delay=2)
    def conduct_interview_step(self, jd_text: str, resume_text: str, history: list) -> dict:
        if not self.client:
            raise RuntimeError("Gemini client not initialized.")

        history_str = "\n".join([f"{h['role']}: {h['content']}" for h in history])
        
        prompt = f"""
        You are an elite Senior FAANG Technical Interviewer. You are rigorous, direct, and expert-level.
        
        Job Description Requirements: {jd_text}
        Candidate Resume: {resume_text}
        
        Interview History so far:
        {history_str}
        
        Instructions:
        1. Critically evaluate the candidate's last response. Were they too shallow? Did they miss edge cases?
        2. Based on their answer, ask a follow-up question. If their answer was good, dive DEEPER into system architecture, scalability, or edge cases.
        3. If their answer was poor or vague, challenge them directly (professionally) to clarify their technical reasoning.
        4. Reference specific projects from their resume to ground the questions in their actual experience.
        5. Keep your tone professional, highly technical, and slightly demanding.
        6. Do NOT ask multiple questions. Ask exactly ONE precise technical question.
        
        Return a JSON object with this structure:
        {{
            "next_question": "your next question here",
            "hidden_evaluation": "brief assessment here"
        }}
        """
        
        for model in self.model_fallbacks:
            try:
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                logger.info(f"Interview step generated using {model}")
                text = response.text.strip()
                # Fix JSON if needed
                if not text.startswith('{'):
                    text = text[text.find('{'):text.rfind('}')+1]
                return json.loads(text)
            except Exception as e:
                logger.warning(f"Model {model} failed: {e}")
                continue
        
        raise RuntimeError("All models failed to conduct interview step")

    @retry_gemini_with_fallback(max_retries=3, delay=2)
    def generate_final_feedback(self, jd_text: str, history: list) -> str:
        if not self.client:
            raise RuntimeError("Gemini client not initialized.")

        history_str = "\n".join([f"{h['role']}: {h['content']}" for h in history])
        
        prompt = f"""
        As an Elite Security & Systems Architect, provide a "Holographic" Feedback Report for the candidate.
        
        Job Description Requirements: {jd_text}
        Interview History:
        {history_str}
        
        Provide the report in this format:
        1. Final Verdict: (STRONG HIRE / HIRE / LEANING NO HIRE / STRONG NO HIRE)
        2. Technical Accuracy (60%): Assess their technical knowledge, code logic, and DSA capability.
        3. Communication & Reasoning (40%): Assess their approach, communication, and edge-case thinking.
        4. Optimized Alternative: Provide an optimized code snippet or architectural diagram for the main problem.
        5. Lead Engineer's Summary: A 3-sentence assessment of their capability level.
        
        Keep it analytical, formatted cleanly in Markdown. Be direct and unvarnished.
        """
        
        for model in self.model_fallbacks:
            try:
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                logger.info(f"Feedback generated using {model}")
                return response.text.strip()
            except Exception as e:
                logger.warning(f"Model {model} failed: {e}")
                continue
        
        raise RuntimeError("All models failed to generate feedback")
