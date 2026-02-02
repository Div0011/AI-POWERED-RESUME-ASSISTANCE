import requests
import json

def test_bullet_improver():
    URL = "http://localhost:8000/candidate/improve-bullet"
    payload = {
        "bullet_point": "I fixed some bugs in Python",
        "job_id": 1 # Cyber Security Intern
    }
    
    try:
        print("Testing Bullet Point Improver...")
        # Note: Make sure the backend server is running!
        # Since I am an agent, I might need to start it if it's not.
        # But usually, I'm just verifying logic.
        # I'll try to call it.
        response = requests.post(URL, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Result: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_bullet_improver()
