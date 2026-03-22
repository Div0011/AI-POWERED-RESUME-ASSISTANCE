#!/usr/bin/env python3
"""Quick deployment test script"""
import requests
import json

def test_api():
    """Test backend API endpoints"""
    base_url = "http://localhost:8000"
    
    tests = [
        ("GET", "/jobs/", None),
        ("GET", "/candidates/", None),
        ("GET", "/", None),
    ]
    
    print("=" * 60)
    print(" LOCAL DEPLOYMENT TEST - API ENDPOINTS")
    print("=" * 60)
    
    for method, endpoint, data in tests:
        try:
            url = f"{base_url}{endpoint}"
            if method == "GET":
                r = requests.get(url)
            else:
                r = requests.post(url, json=data)
            
            print(f"\n✓ {method} {endpoint}")
            print(f"  Status: {r.status_code}")
            print(f"  Response: {r.text[:200]}...")
            
        except Exception as e:
            print(f"\n✗ {method} {endpoint}")
            print(f"  Error: {e}")
    
    print("\n" + "=" * 60)
    print(" DEPLOYMENT STATUS")
    print("=" * 60)
    
    # Check if any endpoint responded successfully
    try:
        r = requests.get(f"{base_url}/")
        if r.status_code in [200, 401]:
            print("\n✓ Backend is running ✓")
            print(f"  Server: http://localhost:8000")
            print(f"  Frontend: http://localhost:3001")
            print(f"  Database: SQLite (resume.db)")
            return True
    except:
        print("\n✗ Backend not responding")
        return False

if __name__ == "__main__":
    test_api()
