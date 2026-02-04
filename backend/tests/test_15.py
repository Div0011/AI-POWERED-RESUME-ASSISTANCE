import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)
# Testing with 1.5 flash just in case
model = genai.GenerativeModel('gemini-1.5-flash')
try:
    response = model.generate_content("Say 'Operational'")
    print(f"RESULT: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
