import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

print(f"API KEY: {api_key}")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')
try:
    response = model.generate_content("Say 'Operational'")
    print(f"RESULT: {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
