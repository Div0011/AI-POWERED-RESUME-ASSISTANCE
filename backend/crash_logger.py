import subprocess
import sys

def run():
    with open("crash_log.txt", "w") as f:
        proc = subprocess.Popen(
            [sys.executable, "main.py"],
            cwd="backend",
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        for line in proc.stdout:
            f.write(line)
            f.flush()
        proc.wait()

if __name__ == "__main__":
    run()
