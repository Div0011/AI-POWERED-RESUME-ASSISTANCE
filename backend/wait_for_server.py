import subprocess
import time
import sys

def wait_for_server():
    print("Starting server and waiting for signal...")
    proc = subprocess.Popen(
        [sys.executable, "main.py"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    try:
        # Give it 60 seconds
        start_time = time.time()
        while time.time() - start_time < 60:
            line = proc.stdout.readline()
            if line:
                print(line.strip())
                if "Uvicorn running on" in line:
                    print("\n✅ SERVER IS UP!")
                    return True
            if proc.poll() is not None:
                print(f"❌ PROCESS EXITED with code {proc.returncode}")
                return False
        print("❌ TIMEOUT")
        return False
    finally:
        proc.terminate()

if __name__ == "__main__":
    wait_for_server()
