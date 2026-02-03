
import sys
import os
import json

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from database import SessionLocal, init_db, engine
import models

def manual_seed():
    print("🚀 Manual Seeding Job ID 1...")
    init_db()
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if exists
        existing = db.query(models.Job).filter(models.Job.id == 1).first()
        if existing:
            print("✅ Job ID 1 already exists.")
            return

        print("Creating Cyber Security Job...")
        # Dummy embedding (384 dimensions)
        dummy_embedding = [0.1] * 384
        
        job = models.Job(
            id=1,
            title="Cyber Security Intern",
            description="""
            Job Title: Cyber Security Intern
            Location: Remote
            Requirements:
            - Knowledge of OWASP Top 10.
            - Familiarity with Nmap, Wireshark.
            - Python scripting.
            """,
            required_skills=["OWASP", "Nmap", "Wireshark", "Python"],
            embedding=dummy_embedding
        )
        
        db.add(job)
        db.commit()
        print("✅ Successfully seeded Job ID 1.")
        
    except Exception as e:
        print(f"❌ Seeding failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    manual_seed()
