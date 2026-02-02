import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

try:
    print("Testing Gemini 1.5 Flash...")
    response = model.generate_content("Say 'Hello GEMINI' if you can hear me.")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
