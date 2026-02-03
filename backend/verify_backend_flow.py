
import requests
import os
import json

BASE_URL = "http://127.0.0.1:8002"

def run_flow():
    print("🚀 STARTING AI FLOW VERIFICATION...")

    # 1. Create a dummy resume file
    resume_content = """
    John Doe
    Python Developer
    
    Experience:
    - Senior Python Developer at Tech Corp (3 years)
    - Built REST APIs using FastAPI and Flask.
    - Experience with Docker, Kubernetes, and AWS.
    - Strong knowledge of Cyber Security principles.
    
    Skills: Python, FastAPI, SQL, Docker, AWS, React.
    """
    
    with open("dummy_resume.txt", "w") as f:
        f.write(resume_content)
        
    # 2. Test /candidate/parse
    print("\n[1] Testing PARSE endpoint...")
    try:
        files = {'file': ('dummy_resume.txt', open('dummy_resume.txt', 'rb'), 'text/plain')}
        res = requests.post(f"{BASE_URL}/candidate/parse", files=files)
        
        if res.status_code != 200:
            print(f"❌ Parse Failed: {res.text}")
            return
            
        data = res.json()
        print(f"✅ Parse Success! Extracted {len(data['text'])} chars.")
        parsed_text = data['text']
        
    except Exception as e:
        print(f"❌ Parse Exception: {e}")
        return

    # 3. Test /candidate/simulate (AI Check)
    print("\n[2] Testing ATS SIMULATION endpoint...")
    try:
        payload = {
            "resume_text": parsed_text,
            "job_id": 1
        }
        res = requests.post(f"{BASE_URL}/candidate/simulate", json=payload)
        
        if res.status_code != 200:
            print(f"❌ Simulation Failed: {res.text}")
            # Don't return, try to proceed to interview to check connectivity there too
        else:
            data = res.json()
            print(f"✅ Simulation Success! Score: {data['score']}")
            print(f"   Reasoning: {data['student_reasoning'][:100]}...")

    except Exception as e:
        print(f"❌ Simulation Exception: {e}")

    # 4. Test /interview/start (AI Interviewer)
    print("\n[3] Testing INTERVIEW START endpoint...")
    try:
        payload = {
            "job_id": 1,
            "resume_text": parsed_text
        }
        res = requests.post(f"{BASE_URL}/interview/start", json=payload)
        
        if res.status_code != 200:
            print(f"❌ Interview Start Failed: {res.text}")
            return
            
        data = res.json()
        question = data['next_question']
        print(f"✅ Interview Started! Question: {question}")
        
        # 5. Test /interview/respond (AI Reply)
        print("\n[4] Testing INTERVIEW RESPOND endpoint...")
        reply_payload = {
            "job_id": 1,
            "resume_text": parsed_text,
            "history": [
                {"role": "interviewer", "content": question},
                {"role": "candidate", "content": "I have 3 years of experience building scalable APIs using FastAPI."}
            ]
        }
        res_reply = requests.post(f"{BASE_URL}/interview/respond", json=reply_payload)
        
        if res_reply.status_code != 200:
            print(f"❌ Interview Respond Failed: {res_reply.text}")
        else:
            data_reply = res_reply.json()
            print(f"✅ Interview Respond Success! Next Question: {data_reply['next_question']}")
            
    except Exception as e:
        print(f"❌ Interview Exception: {e}")
        
    # Cleanup
    if os.path.exists("dummy_resume.txt"):
        os.remove("dummy_resume.txt")

if __name__ == "__main__":
    run_flow()
