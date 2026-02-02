import subprocess
import time
import requests
import os

def run_test():
    # Start server
    print("Starting server...")
    server = subprocess.Popen(
        ["python", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8123"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    try:
        # Wait for server to start
        time.sleep(10)
        
        # Run test
        print("Running test...")
        URL = "http://localhost:8123/candidate/simulate"
        payload = {
            "resume_text": "I am a cyber security student with skills in Nmap and Wireshark. I know OWASP Top 10.",
            "job_id": 1
        }
        
        response = requests.post(URL, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Result: {response.text}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print("Stopping server...")
        server.terminate()
        # Print server output
        out, _ = server.communicate()
        print("--- SERVER LOG ---")
        print(out)

if __name__ == "__main__":
    run_test()
