from passlib.context import CryptContext
import hashlib
import base64

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test():
    print("Testing Base64 encoded SHA256")
    password = "testpassword"
    
    # Generate SHA256 bytes
    sha256_bytes = hashlib.sha256(password.encode('utf-8')).digest()
    print(f"SHA256 raw bytes length: {len(sha256_bytes)}") # Should be 32
    
    # Base64 encode
    base64_hash = base64.b64encode(sha256_bytes).decode('utf-8')
    print(f"Base64 hash: {base64_hash}")
    print(f"Base64 hash length: {len(base64_hash)}") # Should be ~44
    
    try:
        hashed = pwd_context.hash(base64_hash)
        print("Success! Base64 hash accepted.")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test()
