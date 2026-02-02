import subprocess
import time
import requests
import sys
import os

def test_startup():
    print(f"Using executable: {sys.executable}")
    server = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8125"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        env=os.environ.copy()
    )
    
    try:
        time.sleep(20)
        print("Checking health...")
        response = requests.get("http://127.0.0.1:8125/")
        print(f"Status: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        server.terminate()
        out, _ = server.communicate()
        print("--- SERVER LOG ---")
        print(out)

if __name__ == "__main__":
    test_startup()
