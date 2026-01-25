from sentence_transformers import SentenceTransformer, util
import json

# Load model once (lightweight model)
model = SentenceTransformer('all-MiniLM-L6-v2')

def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculates cosine similarity between two texts using SentenceTransformers.
    """
    embeddings1 = model.encode(text1, convert_to_tensor=True)
    embeddings2 = model.encode(text2, convert_to_tensor=True)
    return util.cos_sim(embeddings1, embeddings2).item()

def rank_candidate(job_description: str, resume_text: str, analysis: dict) -> dict:
    """
    Calculates a Hybrid Score for a candidate.
    Formula: Final Score = (Rule Score * 0.6) + (Vector Score * 0.4)
    """
    # 1. Rule Score (Skills & Exp)
    matching_skills = len(analysis.get("matching_skills", []))
    missing_skills = len(analysis.get("missing_skills", []))
    total_skills = matching_skills + missing_skills
    skills_score = (matching_skills / total_skills) * 100 if total_skills > 0 else 0
    
    rule_score = skills_score # Simplified for now, can add exp logic
    
    # 2. Vector Score (Semantic)
    vector_score = calculate_similarity(job_description, resume_text) * 100
    
    # 3. Hybrid Combination
    final_score = (rule_score * 0.6) + (vector_score * 0.4)
    
    return {
        "final_score": round(final_score, 2),
        "rule_score": round(rule_score, 2),
        "vector_score": round(vector_score, 2)
    }
