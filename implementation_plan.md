# Implementation Plan: Closing the Recruiter Loop

To complete the recruiter side, we are implementing an automated communication layer that bridges AI analysis with final candidate outreach.

## 1. Outgoing Response Service
- **Location**: `backend/services/communication.py`
- **Logic**: 
    - Use the Gmail API's `users.messages.send` method.
    - Requires updating OAuth scopes to include `https://www.googleapis.com/auth/gmail.send`.
    - **Drafting**: Use Gemini to generate personalized email bodies based on:
        - Candidate Name.
        - Job Title.
        - Decision (Accepted/Rejected).
        - Specific reasoning snippet from the AI analysis.

## 2. Job-Candidate Matcher (Background Task)
- **Location**: `backend/worker.py`
- **Task**: `match_existing_candidates_to_new_job`
- **Logic**:
    1. Triggered when a new `Job` is created.
    2. Query all existing `Candidate` profiles.
    3. Generate vector similarity and hybrid scores for each candidate against the new job.
    4. If score > 0.7, trigger the `CommunicationService` to send an "Invitation to Apply" email.

## 3. API Integration
- **Router**: Add endpoints to `backend/routers/candidates.py` for manual "Send Decision" actions by the recruiter.
- **Payload**: `{"candidate_id": int, "decision": "accept" | "reject"}`.

## 4. Verification Plan
- **Mock Outreach**: Create `backend/tests/test_communication.py`.
- **Step**:
    1. Seed a candidate and a job.
    2. Run the decision drafter.
    3. Execute the send command.
    4. Verify the email arrives in the recruiter's "Sent" folder or the recipient's inbox.

---
**Status**: Pending Approval
