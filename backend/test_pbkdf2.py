from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def test():
    print("Testing pbkdf2_sha256")
    password = "tests" * 20 # 100 chars
    print(f"Password length: {len(password)}")
    
    try:
        hashed = pwd_context.hash(password)
        print(f"Success! Hashed: {hashed[:20]}...")
        
        if pwd_context.verify(password, hashed):
            print("Verification successful")
        else:
            print("Verification failed")
            
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test()
