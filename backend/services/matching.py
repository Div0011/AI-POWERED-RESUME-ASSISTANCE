from typing import List, Dict, Any, Optional
import numpy as np
from loguru import logger
from services.embedding import EmbeddingService
from services.analyzer import RequirementAnalyzer

def rank_candidate(
    jd_text: str, 
    resume_text: str, 
    jd_embedding: List[float], 
    resume_embedding: List[float],
    must_have_skills: List[str]
) -> Dict[str, Any]:
    """
    Upgraded Hybrid Scoring Logic:
    1. Gemini-based 'Must-Have' validation (60% weight)
    2. Vector Similarity (40% weight)
    
    Statuses: 'selected', 'under recruiter review', 'rejected'
    """
    try:
        # 1. Vector Similarity (The 'Vibe' check)
        jd_vec = np.array(jd_embedding)
        res_vec = np.array(resume_embedding)
        
        if np.linalg.norm(jd_vec) == 0 or np.linalg.norm(res_vec) == 0:
            vector_sim = 0.0
        else:
            vector_sim = np.dot(jd_vec, res_vec) / (np.linalg.norm(jd_vec) * np.linalg.norm(res_vec))
        
        # 2. Smart Constraint Check via Gemini
        analyzer = RequirementAnalyzer()
        eval_result = analyzer.analyze_resume_v_jd(resume_text, must_have_skills)
        
        # Calculate constraint score based on matches
        total_reqs = len(must_have_skills)
        if total_reqs == 0:
            constraint_score = 1.0
        else:
            # We give a 0.2 base if some matched, but strictly penalize missing
            constraint_score = len(eval_result.matched_must_haves) / total_reqs

        # 3. Hybrid Calculation
        final_score = (0.6 * constraint_score) + (0.4 * float(vector_sim))
        
        # 4. Categorization
        if final_score >= 0.8:
            status = "selected"
        elif final_score >= 0.5:
            status = "under recruiter review"
        else:
            status = "rejected"
            
        logger.info(f"Brain Result -> Final: {final_score:.4f} | Status: {status} | Reasoning: {eval_result.reasoning}")
        
        return {
            "final_score": final_score,
            "status": status,
            "reasoning": eval_result.reasoning,
            "matched_skills": eval_result.matched_must_haves,
            "missing_skills": eval_result.missing_must_haves,
            "breakdown": {
                "constraint_score": constraint_score,
                "vector_similarity": float(vector_sim)
            }
        }
    except Exception as e:
        logger.error(f"Error in hybrid scoring: {e}")
        return {
            "final_score": 0.0, 
            "status": "rejected", 
            "reasoning": f"System error during analysis: {str(e)}",
            "missing_skills": [],
            "matched_skills": [],
            "breakdown": {
                "constraint_score": 0.0,
                "vector_similarity": 0.0
            }
        }
