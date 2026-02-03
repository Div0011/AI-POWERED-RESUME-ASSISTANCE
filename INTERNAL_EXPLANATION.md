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

### **Database: SQLite (Development) / PostgreSQL (Production)**
*   **Why SQL?** Our data is highly relational: Users (Recruiters/Candidates), Jobs, Resumes, and Simulations.
*   **Vector Support**: We use a hybrid approach. 60% of scoring is LLM-based (Gemini), while 40% is Semantic Vector Similarity (Cosine).

---

## 2. System Architecture: The "Gatekeeper" RBAC
The application is strictly governed by **Role-Based Access Control (RBAC)**, ensuring data privacy and a customized experience for each side.

### **A. Authentication Layer (The Foundation)**
*   **JWT Implementation**: Located in `backend/auth.py`. We use `pbkdf2_sha256` for hashing and `python-jose` for JWT signing.
*   **The Session Handshake**:
    1.  **Login/Signup**: User selects a role ('candidate' or 'recruiter') during registration.
    2.  **Token Issuance**: The JWT payload contains the user's `sub` (email) and the response includes their `role`.
    3.  **Client-Side Persistence**: `AuthContext.tsx` stores the token and role in `localStorage` for UI state and `document.cookie` for server-side middleware.

### **B. Client-Side RBAC (Route Guards)**
*   **File**: `frontend/src/components/ClientLayoutWrapper.tsx`.
*   **Logic**: Due to Static Site Generation (SSG) constraints, routing logic runs in the browser.
    *   **Hook**: `useAuth()` provides the current user state.
    *   **Effect**: A `useEffect` listener monitors the URL path.
        *   If a Candidate tries to access `/recruiter/*`, they are immediately pushed to `/candidate/check`.
        *   If an Unauthenticated user tries to access protected routes, they are pushed to `/login`.

### **C. Backend Router Security (FastAPI Dependencies)**
*   **RoleChecker**: A custom class in `backend/auth.py` used as a FastAPI dependency.
*   **Usage**: 
    ```python
    router = APIRouter(dependencies=[Depends(auth.RoleChecker("recruiter"))])
    ```
*   **Enforcement**: This ensures that even if a user bypasses the frontend, the API will return a `403 Forbidden` if the role doesn't match.

---

## 3. Ecosystem Deep Dives

### **A. Recruiter Portal (`/recruiter/*`)**
1.  **Dashboard**: Central hub for managing job posts and candidates.
2.  **Job Creation (`/recruiter/jobs/create`)**:
    *   **Workflow**: Recruiter enters a JD -> DB stores it.
    *   **Automatic Intelligence**: 
        *   **Requirement Extraction**: Gemini 2.0 extracts skills.
        *   **Vectorization**: `sentence-transformers` creates a 384-dim embedding.
        *   **Instant Match**: A background worker immediately scans *all* existing candidates for high-similarity matches and notifies the recruiter.
3.  **Talent Pool**: Searchable database of all candidates who have applied or matched.
4.  **Analytics**: Secured view of pipeline health.

### **B. Candidate Portal (`/candidate/*`)**
1.  **Mission Board (`/candidate/jobs`)**:
    *   **Discovery**: View all active job postings from all recruiters.
2.  **ATS Simulator (`/candidate/check`)**:
    *   **The Check**: Candidates upload a resume for a specific `job_id`.
    *   **The Result**: 0-100 score + "Coaching Feedback" (rewritten by AI to be helpful, not just evaluative).
3.  **AI Technical Interviewer (`/candidate/interview`)**:
    *   **Real-time Interaction**: A structured interview loop (Ice-breaker -> Follow-ups -> Feedback).

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

### **Journey 1: The Modern Recruiter**
1.  **Identity Portal**: Logs in as "Recruiter".
2.  **Job Deployment**: Create a new "Senior Engineer" job post.
3.  **Talent Sourcing**: Opens the **Talent Pool** or **Dashboard** to see AI-ranked matches.
4.  **Decision**: Approves a candidate, triggering an automated email via the `CommunicationService`.

### **Journey 2: The Empowered Candidate**
1.  **Identity Portal**: Logs in as "Candidate".
2.  **Discovery**: Browses the **Mission Board**. Finds an interesting role.
3.  **Simulation**: Runs the **ATS Simulator**. Gets a 65% score.
4.  **Improvization**: Uses the **Bullet Point Improver** until the score hits 90%.
5.  **Preparation**: Runs a mock **AI Interview** and gets a feedback report.

---

## 6. Known Limitations & Future Work
-   **Email Polling**: The system polls Gmail every 60 seconds (using Celery beat).
-   **Resume Parsing Accuracy**: PDF tables can sometimes confuse the parser.
-   **Bias**: The system relies on keyword/semantic matches, which can bias against non-traditional backgrounds if not carefully prompted.
