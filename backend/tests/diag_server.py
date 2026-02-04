import subprocess
import time
import sys

def run_server():
    print(f"Running backend/main.py with {sys.executable}")
    # We'll run it and just capture the first 30 seconds of output
    proc = subprocess.Popen(
        [sys.executable, "main.py"],
        cwd="backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    
    try:
        # Give it a lot of time to start
        end_time = time.time() + 40
        while time.time() < end_time:
            line = proc.stdout.readline()
            if line:
                print(f"OUT: {line.strip()}")
            if proc.poll() is not None:
                print(f"PROCESS EXITED with code {proc.returncode}")
                break
    except Exception as e:
        print(f"Caught: {e}")
    finally:
        if proc.poll() is None:
            proc.terminate()
        out, _ = proc.communicate()
        print(out)

if __name__ == "__main__":
    run_server()
