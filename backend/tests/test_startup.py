import subprocess
import time
import requests

def test_startup():
    print("Starting server...")
    server = subprocess.Popen(
        ["python", "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8124"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    try:
        time.sleep(15) # Wait longer
        print("Checking health...")
        response = requests.get("http://localhost:8124/")
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
