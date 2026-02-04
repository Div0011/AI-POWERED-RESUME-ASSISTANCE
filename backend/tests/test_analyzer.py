import os
from services.analyzer import RequirementAnalyzer
from dotenv import load_dotenv

load_dotenv()
print(f"Checking GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY')[:5]}...")

analyzer = RequirementAnalyzer()
try:
    print("Attempting to generate job description...")
    result = analyzer.generate_job_description(["Python", "React"])
    print("SUCCESS!")
    print(result)
except Exception as e:
    print(f"FAILURE in analyzer: {e}")
