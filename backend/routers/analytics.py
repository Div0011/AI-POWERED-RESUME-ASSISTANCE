from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from collections import Counter
import json
from loguru import logger

router = APIRouter(dependencies=[Depends(auth.RoleChecker("recruiter"))])

@router.get("/summary", response_model=schemas.AnalyticsSummaryResponse)
def get_analytics_summary(job_id: int = None, db: Session = Depends(get_db)):
    """
    Analyzes recruitment data to provide skill gap insights and score distributions.
    Optional filtering by job_id.
    """
    try:
        query = db.query(models.Candidate)
        if job_id:
            query = query.filter(models.Candidate.job_id == job_id)
        candidates = query.all()
        
        if not candidates:
            logger.info(f"No candidates found for job_id={job_id}")
            return schemas.AnalyticsSummaryResponse(
                total_resumes=0,
                avg_score=0.0,
                top_missing_skill="None",
                interview_ready_count=0,
                skill_gaps=[],
                score_distribution=[]
            )

        total_resumes = len(candidates)
        total_score = 0.0
        missing_skills_counter = Counter()
        scores = []

        for cand in candidates:
            try:
                total_score += cand.score or 0.0
                scores.append(cand.score or 0.0)
                
                # Aggregate missing skills from analysis JSON
                if cand.analysis:
                    try:
                        analysis_data = cand.analysis
                        if isinstance(analysis_data, str):
                            analysis_data = json.loads(analysis_data)
                        
                        missing = analysis_data.get("missing_skills", [])
                        if missing and isinstance(missing, list):
                            for skill in missing:
                                if skill:
                                    missing_skills_counter[str(skill)] += 1
                    except (json.JSONDecodeError, AttributeError, TypeError) as parse_err:
                        logger.warning(f"Failed to parse analysis for candidate {cand.id}: {parse_err}")
                        continue
            except Exception as e:
                logger.warning(f"Error processing candidate {cand.id}: {e}")
                continue

        if total_resumes == 0:
            return schemas.AnalyticsSummaryResponse(
                total_resumes=0,
                avg_score=0.0,
                top_missing_skill="None",
                interview_ready_count=0,
                skill_gaps=[],
                score_distribution=[]
            )

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
        try:
            sim_query = db.query(models.Simulation).filter(models.Simulation.score > 0.7)
            if job_id:
                sim_query = sim_query.filter(models.Simulation.job_id == job_id)
            interview_ready_count = sim_query.count()
        except Exception as sim_err:
            logger.warning(f"Failed to query simulations: {sim_err}")
            interview_ready_count = 0

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
