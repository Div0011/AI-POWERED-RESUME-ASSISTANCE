from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from collections import Counter
import json
from loguru import logger

router = APIRouter(dependencies=[Depends(auth.RoleChecker("recruiter"))])

@router.get("/summary", response_model=schemas.AnalyticsSummaryResponse)
def get_analytics_summary(db: Session = Depends(get_db)):
    """
    Analyzes recruitment data to provide skill gap insights and score distributions.
    """
    try:
        candidates = db.query(models.Candidate).all()
        
        if not candidates:
            return schemas.AnalyticsSummaryResponse(
                total_resumes=0,
                avg_score=0.0,
                top_missing_skill="None",
                skill_gaps=[],
                score_distribution=[]
            )

        total_resumes = len(candidates)
        total_score = 0.0
        missing_skills_counter = Counter()
        scores = []

        for cand in candidates:
            total_score += cand.score or 0.0
            scores.append(cand.score or 0.0
            )
            
            # Aggregate missing skills from analysis JSON
            if cand.analysis:
                analysis_data = cand.analysis
                if isinstance(analysis_data, str):
                    analysis_data = json.loads(analysis_data)
                
                missing = analysis_data.get("missing_skills", [])
                for skill in missing:
                    missing_skills_counter[skill] += 1

        avg_score = total_score / total_resumes
        
        # Format Top Missing Skills
        top_skills = [
            schemas.AnalyticsSkillGap(skill=s, count=c) 
            for s, c in missing_skills_counter.most_common(5)
        ]
        top_missing_skill = top_skills[0].skill if top_skills else "N/A"

        # Create Score Distribution Bins (0.0-0.2, 0.2-0.4, etc.)
        bins = {
            "0-20%": 0,
            "20-40%": 0,
            "40-60%": 0,
            "60-80%": 0,
            "80-100%": 0
        }
        for s in scores:
            if s < 0.2: bins["0-20%"] += 1
            elif s < 0.4: bins["20-40%"] += 1
            elif s < 0.6: bins["40-60%"] += 1
            elif s < 0.8: bins["60-80%"] += 1
            else: bins["80-100%"] += 1
        
        score_distribution = [
            schemas.AnalyticsScoreBin(bin=b, count=c) 
            for b, c in bins.items()
        ]

        # Interview Ready Metric (from Simulation table)
        interview_ready_count = db.query(models.Simulation).filter(models.Simulation.score > 0.7).count()

        return schemas.AnalyticsSummaryResponse(
            total_resumes=total_resumes,
            avg_score=avg_score,
            top_missing_skill=top_missing_skill,
            interview_ready_count=interview_ready_count,
            skill_gaps=top_skills,
            score_distribution=score_distribution
        )

    except Exception as e:
        logger.error(f"Failed to generate analytics: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Analytics generation failed")
