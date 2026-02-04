import requests
import time

API_BASE = "http://127.0.0.1:8000"

def test_analytics():
    print("Checking Analytics Summary...")
    try:
        res = requests.get(f"{API_BASE}/analytics/summary")
        if res.status_code == 200:
            data = res.json()
            print("✅ Analytics Summary retrieved successfully!")
            print(f"Total Resumes: {data['total_resumes']}")
            print(f"Avg Score: {data['avg_score']:.2f}")
            print(f"Top Missing Skill: {data['top_missing_skill']}")
            print(f"Interview Ready: {data['interview_ready_count']}")
            print(f"Skill Gaps: {len(data['skill_gaps'])}")
            print(f"Binned Scores: {len(data['score_distribution'])}")
        else:
            print(f"❌ Analytics Retrieval failed with status {res.status_code}")
            print(res.text)
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")

if __name__ == "__main__":
    test_analytics()
