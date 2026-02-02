import requests
import json

def test_simulation():
    URL = "http://localhost:8000/candidate/simulate"
    payload = {
        "resume_text": "I am a cyber security student with skills in Nmap and Wireshark. I know OWASP Top 10.",
        "job_id": 1
    }
    
    try:
        print("Testing ATS Simulation...")
        response = requests.post(URL, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Result: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_simulation()
