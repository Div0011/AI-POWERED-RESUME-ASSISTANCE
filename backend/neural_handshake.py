"""
NEURAL HANDSHAKE VERIFICATION
Tests the 4-model fallback chain with exponential backoff
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from services.analyzer import ResumeAnalyzer
from dotenv import load_dotenv

# Load root .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

print("=" * 60)
print("NEURAL HANDSHAKE VERIFICATION")
print("=" * 60)
print(f"API Key: {os.getenv('GEMINI_API_KEY')[:10]}...")
print()

analyzer = ResumeAnalyzer()

print("Testing Job Description Generation...")
print("Expected: Model fallback chain activation if quota hit")
print()

try:
    result = analyzer.generate_job_description(["Python", "FastAPI", "AI"])
    print("[SUCCESS]")
    print(f"Title: {result.get('suggested_title')}")
    print(f"Description Preview: {result.get('suggested_description')[:100]}...")
except Exception as e:
    print(f"[FAILURE]: {e}")
    print()
    print("This is expected if ALL models in fallback chain are quota-exhausted.")
    print("Check logs above for model switching attempts.")

print()
print("=" * 60)
print("Check terminal output above for fallback chain logs:")
print("  - 'Attempting with model: gemini-2.0-flash-exp'")
print("  - 'Model failed, trying next...'")
print("=" * 60)
