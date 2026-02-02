from database import SessionLocal
import models
import database, auth

def seed_users():
    models.Base.metadata.create_all(bind=database.engine)
    db = SessionLocal()
    try:
        # Create Test Recruiter
        recruiter = db.query(models.User).filter(models.User.email == "recruiter@getit.ai").first()
        if not recruiter:
            recruiter = models.User(
                email="recruiter@getit.ai",
                hashed_password=auth.get_password_hash("recruiter123"),
                role="recruiter"
            )
            db.add(recruiter)
            print("Test Recruiter created: recruiter@getit.ai / recruiter123")

        # Create Test Candidate
        candidate = db.query(models.User).filter(models.User.email == "candidate@getit.ai").first()
        if not candidate:
            candidate = models.User(
                email="candidate@getit.ai",
                hashed_password=auth.get_password_hash("candidate123"),
                role="candidate"
            )
            db.add(candidate)
            print("Test Candidate created: candidate@getit.ai / candidate123")

        db.commit()
    except Exception as e:
        import traceback
        print(f"Error seeding users: {e}")
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
