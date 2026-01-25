# AI Powered Resume Screening & Hiring Assistance

🚀 **A premium, agentic system for ranking candidates using LLMs, LangGraph, and Docling.**

[![Loom Video Placeholder](https://img.shields.io/badge/Loom-Video_Demo-blueviolet?style=for-the-badge&logo=loom)](https://loom.com/placeholder)

## ✨ Features
- **Docling Integration**: High-accuracy PDF/DOCX parsing.
- **Agentic Reasoning**: Uses **LangGraph** and **Groq (Llama 3.3 70B)** to perform deep analysis.
- **Live Reasoning (CoT)**: Watch the agent's internal "Chain of Thought" as it verifies skills.
- **Fake Claim Detection**: Heuristics to flag skills claimed without project evidence (Low Confidence).
- **Premium UI**: Built with Next.js, Tailwind CSS, and Framer Motion.

## 🛠️ Tech Stack
- **Backend**: FastAPI, LangGraph, Groq, Docling, FAISS.
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide React.
- **Database**: PostgreSQL (Dockerized).
- **Deployment**: Vercel (Frontend), Render/Railway (Backend).

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/resume-screener.git
cd resume-screener
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Create a .env file with your GROQ_API_KEY
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Docker (Optional)
```bash
docker-compose up --build
```

## 🧠 How it Works
1. **Parsing**: Docling converts the resume into a structured Markdown format.
2. **Screening**: The agent extracts skills and experience using Groq.
3. **Reasoning**: A second agent node reviews the claims against the project evidence. If a skill is mentioned but not demonstrated in a project, it flags it as **"Low Confidence"**.
4. **Ranking**: Candidates are ranked based on their alignment with the Job Description.

---
Built with ❤️ by [Your Name]
