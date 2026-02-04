import os
import google.generativeai as genai
from services.analyzer import RequirementAnalyzer
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print("--- NEURAL LINK VERIFICATION ---")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env.")
else:
    print(f"API Key found: {api_key[:5]}...{api_key[-5:]}")
    
    # Test 1: Direct Generation
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Ping")
        print(f"TEST 1 (Direct API): PASSED - Response: {response.text.strip()}")
    except Exception as e:
        print(f"TEST 1 (Direct API): FAILED - {e}")

    # Test 2: RequirementAnalyzer (The brain of the app)
    try:
        analyzer = RequirementAnalyzer()
        print("TEST 2 (Neural Expansion): Running...")
        result = analyzer.generate_job_description(["Python", "React", "AI"])
        print(f"TEST 2 (Neural Expansion): PASSED - Suggested Title: {result.get('suggested_title')}")
    except Exception as e:
        print(f"TEST 2 (Neural Expansion): FAILED - {e}")
print("--- END OF VERIFICATION ---")
