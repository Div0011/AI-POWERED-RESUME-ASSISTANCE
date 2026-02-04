import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env.")
else:
    print(f"API Key found in .env: {api_key[:5]}...{api_key[-5:]}")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Hello, are you working?")
        print(f"RESPONSE: {response.text}")
    except Exception as e:
        print(f"FAILURE: {e}")
