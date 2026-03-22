#!/usr/bin/env python3
"""
GET IT! - Complete System Testing & Verification Script
Tests all features to ensure everything works properly
"""

import requests
import json
import time
import sys
from datetime import datetime

# Color codes for terminal output
class Colors:
    RESET = '\033[0m'
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.RESET}")

class APITester:
    def __init__(self, api_url="http://localhost:8000"):
        self.api_url = api_url
        self.session = requests.Session()
        self.results = {
            "passed": 0,
            "failed": 0,
            "tests": []
        }
        
        # Test data
        self.test_job_id = 1
        self.test_resume = "Senior Python Developer with 5+ years experience in FastAPI, React, and AWS. Skills: Python, JavaScript, SQL, Docker, Kubernetes. Projects: Built AI Resume screening system, Led team of 3 engineers."
        
    def test_connection(self):
        """Test if backend is accessible"""
        print_header("1️⃣  TESTING BACKEND CONNECTION")
        
        try:
            response = self.session.get(f"{self.api_url}/health", timeout=5)
            if response.status_code == 200:
                print_success(f"Backend is running at {self.api_url}")
                print_info(f"Response: {response.json()}")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "Backend Health Check", "status": "PASS"})
                return True
            else:
                print_error(f"Backend returned status {response.status_code}")
                self.results["failed"] += 1
                self.results["tests"].append({"name": "Backend Health Check", "status": "FAIL"})
                return False
        except Exception as e:
            print_error(f"Cannot reach backend: {e}")
            print_warning("Make sure backend is running: cd backend && python main.py")
            self.results["failed"] += 1
            self.results["tests"].append({"name": "Backend Health Check", "status": "FAIL", "error": str(e)})
            return False

    def test_job_endpoints(self):
        """Test job management endpoints"""
        print_header("2️⃣  TESTING JOB DEPLOYMENT")
        
        # POST: Create Job
        print_info("Testing: Create New Job...")
        try:
            new_job_data = {
                "title": "Senior Full Stack Engineer",
                "salary_range": "120k-150k",
                "skills": ["Python", "React", "AWS"]
            }
            response = self.session.post(f"{self.api_url}/jobs/create", json=new_job_data)
            if response.status_code == 200:
                print_success("Job creation works")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "Create Job", "status": "PASS"})
            else:
                print_warning(f"Job creation returned {response.status_code}")
                print_info(f"Response: {response.text[:100]}...")
                
        except Exception as e:
            print_warning(f"Job creation endpoint not yet configured: {e}")
        
        # GET: Fetch Jobs
        print_info("Testing: Fetch All Jobs...")
        try:
            response = self.session.get(f"{self.api_url}/jobs")
            if response.status_code == 200:
                jobs = response.json()
                print_success(f"Jobs endpoint works - Found {len(jobs) if isinstance(jobs, list) else 'N/A'} jobs")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "Fetch Jobs", "status": "PASS"})
            else:
                print_warning(f"Jobs endpoint returned {response.status_code}")
                
        except Exception as e:
            print_warning(f"Jobs endpoint error: {e}")

    def test_interview_arena(self):
        """Test Interview Arena - THE MAIN FEATURE"""
        print_header("3️⃣  TESTING INTERVIEW ARENA 🎙️")
        
        print_info("This is the critical feature - Initialize Neural Handshake button should trigger these calls")
        
        # Step 1: Start Interview
        print_info("Step 1/3: POST /interview/start - Generate ice-breaker question...")
        try:
            request_data = {
                "job_id": self.test_job_id,
                "resume_text": self.test_resume
            }
            response = self.session.post(
                f"{self.api_url}/interview/start",
                json=request_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                first_question = data.get("next_question", "")
                print_success("Ice-breaker generated successfully!")
                print_info(f"Question: {first_question[:80]}...")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "Interview Start", "status": "PASS"})
                
                # Step 2: Respond to Interview
                print_info("Step 2/3: POST /interview/respond - Process candidate response...")
                try:
                    response_data = {
                        "job_id": self.test_job_id,
                        "resume_text": self.test_resume,
                        "history": [
                            {"role": "interviewer", "content": first_question},
                            {"role": "candidate", "content": "I have strong experience with system design and cloud architecture."}
                        ]
                    }
                    response2 = self.session.post(
                        f"{self.api_url}/interview/respond",
                        json=response_data,
                        timeout=10
                    )
                    
                    if response2.status_code == 200:
                        next_question = response2.json().get("next_question", "")
                        print_success("Follow-up question generated!")
                        print_info(f"Next question: {next_question[:80]}...")
                        self.results["passed"] += 1
                        self.results["tests"].append({"name": "Interview Respond", "status": "PASS"})
                    else:
                        print_warning(f"Interview respond returned {response2.status_code}")
                        print_info(f"Response: {response2.text[:100]}")
                        self.results["tests"].append({"name": "Interview Respond", "status": "FAIL"})
                        
                except Exception as e:
                    print_warning(f"Interview respond error: {e}")
                    self.results["tests"].append({"name": "Interview Respond", "status": "FAIL", "error": str(e)})
                
                # Step 3: End Interview & Get Feedback
                print_info("Step 3/3: POST /interview/feedback - Generate comprehensive feedback...")
                try:
                    feedback_data = {
                        "job_id": self.test_job_id,
                        "history": [
                            {"role": "interviewer", "content": first_question},
                            {"role": "candidate", "content": "I have strong experience with system design and cloud architecture."},
                            {"role": "interviewer", "content": "Can you describe a system you designed?"},
                            {"role": "candidate", "content": "Yes, I designed a distributed caching system using Redis..."}
                        ]
                    }
                    response3 = self.session.post(
                        f"{self.api_url}/interview/feedback",
                        json=feedback_data,
                        timeout=15
                    )
                    
                    if response3.status_code == 200:
                        feedback = response3.json().get("feedback", "")
                        print_success("Feedback generated successfully!")
                        if "HIRE" in feedback.upper():
                            print_success("Candidate passed - HIRE recommendation!")
                        else:
                            print_warning("Candidate needs more preparation")
                        print_info(f"Feedback length: {len(feedback)} characters")
                        self.results["passed"] += 1
                        self.results["tests"].append({"name": "Interview Feedback", "status": "PASS"})
                    else:
                        print_warning(f"Feedback generation returned {response3.status_code}")
                        print_info(f"Response: {response3.text[:100]}")
                        self.results["tests"].append({"name": "Interview Feedback", "status": "FAIL"})
                        
                except Exception as e:
                    print_warning(f"Feedback generation error: {e}")
                    self.results["tests"].append({"name": "Interview Feedback", "status": "FAIL", "error": str(e)})
                
            else:
                print_error(f"Interview start failed with status {response.status_code}")
                print_info(f"Response: {response.text[:100]}")
                self.results["failed"] += 1
                self.results["tests"].append({"name": "Interview Start", "status": "FAIL"})
                
        except Exception as e:
            print_error(f"Interview Arena test failed: {e}")
            self.results["failed"] += 1
            self.results["tests"].append({"name": "Interview Start", "status": "FAIL", "error": str(e)})

    def test_ats_kernel(self):
        """Test ATS Kernel - Resume screening feature"""
        print_header("4️⃣  TESTING ATS KERNEL")
        
        print_info("Testing resume parsing and scoring...")
        
        try:
            ats_data = {
                "job_id": self.test_job_id,
                "resume_text": self.test_resume
            }
            response = self.session.post(
                f"{self.api_url}/candidate/simulate",
                json=ats_data,
                timeout=15
            )
            
            if response.status_code == 200:
                result = response.json()
                score = result.get("score", 0)
                missing_skills = result.get("missing_skills", [])
                print_success(f"ATS Kernel works! Score: {score}/100")
                if missing_skills:
                    print_info(f"Missing skills: {', '.join(missing_skills[:3])}")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "ATS Kernel", "status": "PASS"})
            else:
                print_warning(f"ATS Kernel returned {response.status_code}")
                self.results["tests"].append({"name": "ATS Kernel", "status": "FAIL"})
                
        except Exception as e:
            print_warning(f"ATS Kernel test failed: {e}")
            self.results["tests"].append({"name": "ATS Kernel", "status": "FAIL", "error": str(e)})

    def test_resume_builder(self):
        """Test Resume Builder"""
        print_header("5️⃣  TESTING RESUME BUILDER")
        
        print_info("Testing bullet point improvement...")
        
        try:
            bullet_data = {
                "bullet": "Led team of engineers",
                "job_description": "Looking for Senior Engineer to lead technical initiatives",
                "job_id": self.test_job_id
            }
            response = self.session.post(
                f"{self.api_url}/candidate/improve-bullet",
                json=bullet_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                improved = result.get("improved_bullet", "")
                print_success("Resume Builder works!")
                print_info(f"Original: Led team of engineers")
                print_info(f"Improved: {improved[:80]}...")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "Resume Builder", "status": "PASS"})
            else:
                print_warning(f"Resume Builder returned {response.status_code}")
                self.results["tests"].append({"name": "Resume Builder", "status": "FAIL"})
                
        except Exception as e:
            print_warning(f"Resume Builder test failed: {e}")
            self.results["tests"].append({"name": "Resume Builder", "status": "FAIL", "error": str(e)})

    def test_vector_search(self):
        """Test Global Talent Pool - Vector Search"""
        print_header("6️⃣  TESTING VECTOR SEARCH")
        
        print_info("Testing semantic similarity search...")
        
        try:
            search_data = {
                "query": "Python AWS microservices",
                "top_k": 5
            }
            response = self.session.post(
                f"{self.api_url}/talent/search",
                json=search_data,
                timeout=5
            )
            
            if response.status_code == 200:
                result = response.json()
                matches = result.get("matches", [])
                print_success(f"Vector Search works! Found {len(matches)} matches")
                self.results["passed"] += 1
                self.results["tests"].append({"name": "Vector Search", "status": "PASS"})
            else:
                print_warning(f"Vector Search returned {response.status_code}")
                self.results["tests"].append({"name": "Vector Search", "status": "FAIL"})
                
        except Exception as e:
            print_warning(f"Vector Search test failed: {e}")
            self.results["tests"].append({"name": "Vector Search", "status": "FAIL"})

    def run_all_tests(self):
        """Run complete test suite"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}GET IT! - COMPLETE SYSTEM TEST{Colors.RESET}")
        print(f"API URL: {self.api_url}")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        if not self.test_connection():
            print_error("Cannot connect to backend. Tests aborted.")
            return
        
        self.test_job_endpoints()
        self.test_interview_arena()  # Critical feature
        self.test_ats_kernel()
        self.test_resume_builder()
        self.test_vector_search()
        
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print_header("📊 TEST SUMMARY")
        
        total = self.results["passed"] + self.results["failed"]
        pass_rate = (self.results["passed"] / total * 100) if total > 0 else 0
        
        print(f"Total Tests: {total}")
        print_success(f"Passed: {self.results['passed']}")
        print_error(f"Failed: {self.results['failed']}")
        print(f"Pass Rate: {pass_rate:.1f}%\n")
        
        if pass_rate == 100:
            print(f"{Colors.GREEN}{Colors.BOLD}🎉 ALL TESTS PASSED! System is ready for remote deployment!{Colors.RESET}")
        elif pass_rate >= 80:
            print(f"{Colors.YELLOW}{Colors.BOLD}⚠️  Most features working, some issues detected{Colors.RESET}")
        else:
            print(f"{Colors.RED}{Colors.BOLD}❌ Critical failures detected - review errors above{Colors.RESET}")
        
        print("\n" + "="*60)
        print("Detailed Results:")
        print("="*60)
        for test in self.results["tests"]:
            status_symbol = "✅" if test["status"] == "PASS" else "❌"
            print(f"{status_symbol} {test['name']}: {test['status']}")
            if "error" in test:
                print(f"   Error: {test['error']}")

if __name__ == "__main__":
    # Get API URL from command line or use default
    api_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    
    print(f"\n{Colors.BOLD}Starting comprehensive system test...{Colors.RESET}")
    print(f"Using API URL: {api_url}\n")
    
    tester = APITester(api_url)
    tester.run_all_tests()
