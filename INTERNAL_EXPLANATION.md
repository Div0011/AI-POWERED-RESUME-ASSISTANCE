# Internal Deep Explanation: AI Powered Resume Screening & Preparation System (GET IT!)

**For Developer Use Only** - This document explains the "How" and "Why" of every single component in the system. Use this to study the codebase and explain it confidently in interviews.

---

## 1. Core Architecture & Tech Stack Choices

### **Backend: Python & FastAPI**
*   **Why Python?** It is the industry standard for AI/ML. Libraries like `langchain`, `sentence-transformers`, and `docling` are Python-native.
*   **Why FastAPI?**
    *   **Speed**: It's one of the fastest Python frameworks (built on Starlette).
    *   **Async Support**: Crucial for our AI tasks. When we call Groq or parse a PDF, the server doesn't "freeze"; it handles other requests while waiting.
    *   **Automatic Docs**: It generates Swagger UI (`/docs`) automatically, which is great for testing.

### **Frontend: Next.js & React (App Router)**
*   **Why Next.js?** It handles routing, server-side rendering (SSR), and optimization out of the box. We utilize the App Router for nested layouts (like the Sidebar).
*   **Why TypeScript?** It prevents bugs. For example, if we try to access `candidate.score` but the API returns `candidate.rating`, TypeScript will yell at us *before* we run the code.
*   **UI/UX Philosophy**: 
    *   "Glassmorphism" design using **Tailwind CSS**. 
    *   **Framer Motion** handles heavily animated transitions (e.g., the Landing Page split).
    *   **Lucide React** for consistent iconography.

### **Database: PostgreSQL**
*   **Why SQL?** Our data is structured (Users have Jobs, Jobs have Candidates). Relational databases enforce these links (Foreign Keys), ensuring data integrity.

---

## 2. System Architecture: The Dual-Side Platform

The application is now split into two distinct ecosystems: **Recruiters** and **Candidates**.

### **A. Landng Page & Navigation**
*   **Role Selection**: The root page (`/`) forces a choice: "Recruiters" or "Candidates". This keeps the UX clean and targeted.
*   **Context-Aware Sidebar**:
    *   Located on the **Right** (non-standard, to stand out).
    *   **Collapsible**: Expands on hover.
    *   **Smart**: It automatically detects the user's "Zone" (URL starting with `/recruiter` or `/candidate`) and changes its menu items accordingly.

### **B. Recruiter Ecosystem**
Tools designed to automate volume hiring.
1.  **Job Dashboard (`/dashboard`)**: The classic ATS view. Post jobs, see applicant lists, and AI scores.
2.  **Smart Inbox (`/recruiter/inbox`)**:
    *   **Goal**: Replace the need to check Gmail.
    *   **Mock Logic**: Simulates real-time email parsing. It identifies incoming resumes, auto-scores them, and assigns a status (processed, ignored).
3.  **Analytics (`/recruiter/analytics`)**:
    *   **Goal**: Visual insights.
    *   **Tech**: Custom CSS-animated bar charts and conversion funnels to visualize "Time to Hire" and "Pipeline Health".

### **C. Candidate Ecosystem**
Tools designed to help applicants "hack" the hiring process.
1.  **Resume Improver (`/candidate/resume`)**:
    *   **Goal**: Automated critique.
    *   **Flow**: User uploads PDF -> Simulated AI Agent analyzes -> Returns ATS Score (0-100) + Generative text improvements.
2.  **Job Match (`/candidate/jobs`)**:
    *   **Goal**: Reverse search. Instead of searching for jobs, the system finds jobs matching the *candidate's* resume vector.
3.  **Interview Prep (`/candidate/interview`)**:
    *   **Goal**: Mock simulation.
    *   **Tech**: A chat interface that mimics a recruiter. It asks behavioral questions, waits for answers, and (simulated) provides feedback.

---

## 3. Feature Deep Dives (AI Logic)

### **Feature 1: Resume Parsing (The "Docling" Advantage)**
*   **Goal**: Convert a messy PDF into clean text that an LLM can understand.
*   **Files**: `backend/parser.py`.
*   **Why Docling?** Most parsers (like `PyPDF2`) just dump text. Docling understands **layout**. It knows that a two-column layout should be read column-by-column, not line-by-line.

### **Feature 2: Multi-step LLM Screening (LangGraph)**
*   **Goal**: Go beyond keyword matching. "Reason" about the candidate.
*   **Files**: `backend/agents/screening_agent.py`.
*   **Flow**:
    1.  **Screening Node**: Extracts structured data (Skills, Exp) using Groq.
    2.  **Reasoning Node**: Compares *Claims* (Skills section) with *Evidence* (Projects/Work History).
    3.  **Logs**: Real-time thought process displayed on the frontend.

### **Feature 3: Ranking & Scoring (Vectors)**
*   **Goal**: Give a single number (0-100) to rank candidates.
*   **Files**: `backend/services/matching.py`.
*   **Logic**:
    *   **Skills (50%)**: Simple math (Matches / Total Required).
    *   **Experience (30%)**: Years of experience check.
    *   **Semantic (20%)**: Uses `sentence-transformers` (Cosine Similarity) to find hidden matches (e.g., "Django" ≈ "Flask").

---

## 4. Dependencies Explained

### Backend
*   `fastapi`: Web framework.
*   `uvicorn`: Server.
*   `sqlalchemy` + `psycopg2-binary`: Database ORM and Driver.
*   `passlib[bcrypt]`: Password hashing.
*   `python-jose`: JWT Tokens.
*   `sentence-transformers`: Vector embeddings.
*   `groq`: Fast LLM inference.
*   `langgraph`: AI Agent workflow loops.

### Frontend (New Additions)
*   **Framer Motion**: Used extensively for the "Card Reveal", "Sidebar Expansion", and "Page Transitions".
*   **Lucide React**: The icon set used in the Sidebar and Cards.

---

## 5. End-to-End User Journeys

### **Journey 1: The Recruiter**
1.  Lands on `GET IT!` home page.
2.  Selects "RECRUITERS". Leads to **Recruiter Hub**.
3.  Opens **Smart Inbox** to see auto-filtered emails.
4.  Clicks on a high-scoring candidate -> Redirects to **Dashboard**.
5.  Views detailed AI reasoning and "Hires" the candidate.
6.  Checks **Analytics** to see the "Time to Hire" metric improve.

### **Journey 2: The Candidate**
1.  Lands on `GET IT!` home page.
2.  Selects "CANDIDATES". Leads to **Candidate Hub**.
3.  Opens **Resume Improver**. Uploads their PDF.
4.  Gets a score of 72/100 and specific advice to fix "Passive Verbs".
5.  Goes to **Job Match**. Sees they are now a 94% match for a "Senior Frontend" role.
6.  Uses **Interview Prep** to practice telling their story before the real interview.

---

## 6. Known Limitations & Future Work
-   **Mock Data**: The "Smart Inbox" and "Interview Chat" currently use hardcoded simulation logic (setTimeout) for the MVP demo. connecting them to real Gmail API and OpenAI Realtime API is the next step.
-   **Resume Parsing Accuracy**: PDF tables can sometimes confuse the parser.
-   **Bias**: The system relies on keyword/semantic matches, which can bias against non-traditional backgrounds if not carefully prompted.
