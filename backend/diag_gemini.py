import os
import sys
from loguru import logger
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

load_dotenv()

def diagnose_gemini():
    try:
        import google.generativeai as genai
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        test_model = genai.GenerativeModel('gemini-1.5-flash')
        print("Testing with gemini-1.5-flash...")
        res = test_model.generate_content("Hi")
        print(f"1.5-Flash Response: {res.text}")
    except Exception as e:
        print(f"1.5-Flash FAILED: {e}")

    try:
        from services.analyzer import RequirementAnalyzer
        analyzer = RequirementAnalyzer()
        print("Testing JD requirements extraction with current model...")
        jd = "We need a Python developer with 3 years of experience in Django."
        reqs = analyzer.extract_requirements(jd)
        print(f"Must-haves: {reqs.must_have_skills}")
    except Exception as e:
        print(f"Service Analyzer FAILED: {e}")

if __name__ == "__main__":
    diagnose_gemini()
