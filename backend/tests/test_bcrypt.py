from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test():
    print("Starting test...")
    password = "testpassword" * 10
    
    # Test finding the limit
    print("\n--- Finding length limit ---")
    for length in range(50, 80):
        test_str = "a" * length
        try:
            pwd_context.hash(test_str)
            print(f"Length {length}: OK")
        except Exception as e:
            print(f"Length {length}: FAILED - {e}")
            break
            
    print(f"\nContext: {pwd_context.to_dict()}")

if __name__ == "__main__":
    test()
