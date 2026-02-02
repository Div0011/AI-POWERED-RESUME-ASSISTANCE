# GET IT! - AI-Powered Recruitment Intelligence 🚀

An end-to-end recruiter-candidate synchronization platform designed for the 2026 talent landscape. Automate your polling, rank candidates with hybrid intelligence, and provide a world-class preparation sandbox for your talent pool.

## 🚀 Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Framer Motion (Glassmorphism), Recharts, Tailwind CSS v4.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy, SQLite with Hybrid Vector optimization.
- **Intelligence**: 
  - **Gemini 2.0 Flash**: Deep reasoning, resume breakdown, and AI Interviewing.
  - **Hugging Face**: Sentence Embeddings (`all-MiniLM-L6-v2`) for semantic search.
- **Automation**: Gmail API (OAuth2) for automated heartbeat polling.

---

## 💡 Project Architecture: The "Success Metric"

### 1. 60/40 Hybrid Scoring Logic
Most systems fail because they only look at keywords OR only look at semantic similarity. **GET IT!** uses a weighted decision engine:
- **60% LLM Reasoning**: Gemini 2.0 Flash performs an "Internal Interview" of the resume, checking for project impact, hidden red flags, and cultural alignment.
- **40% Semantic Match**: Using Hugging Face embeddings to understand the "soul" of the resume. If the JD asks for "Cyber Security" and the candidate has "Network Defense," we find them.

### 2. SQLite Vector Search
We optimized the candidate discovery process by implementing a vector-aware layer on top of SQLite. Embeddings are stored as JSON blobs, and we use high-performance NumPy calculations to rank thousands of candidates in milliseconds, providing "Google-style" semantic search for recruiters.

---

## 🛠 Repository Structure
- **/backend**: FastAPI server, database models, and AI agent logic.
- **/frontend**: Next.js 16 application with premium obsidian-themed UI.

---

## 🚀 Getting Started

### 1. Repository Preparation
```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Setup Backend
cd backend
pip install -r requirements.txt
cp .env.example .env # Fix your keys here

# Setup Frontend
cd ../frontend
npm install
npm run dev
```

### 2. Environment Template
Ensure you have a `.env` in the `backend/` folder with:
- `GEMINI_API_KEY`: For reasoning & matching.
- `GMAIL_USER_EMAIL`: The account to poll.
- `credentials.json.json`: OAuth2 credentials from Google Cloud.

---

## 📤 Distribution (Git Push)

To upload your changes to the repository, run:

```bash
git add .
git commit -m "Final Submission: AI Interviewer, Analytics, and Hybrid Brain Integration"
git push origin main
```

---
Built with ❤️ for Advanced Agentic Coding.
