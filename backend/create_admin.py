from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import auth

def create_admin_user():
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        email = "admin@123.login"
        password = "12345"
        
        # Check if user already exists
        existing_user = db.query(models.User).filter(models.User.email == email).first()
        if existing_user:
            print(f"User {email} already exists.")
            return

        # Create new user
        hashed_password = auth.get_password_hash(password)
        new_user = models.User(
            email=email,
            hashed_password=hashed_password,
            role="recruiter"
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"Successfully created admin user: {email}")
        
    except Exception as e:
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
