from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, auth, database
from datetime import timedelta

router = APIRouter()

@router.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}

@router.post("/google-login", response_model=schemas.Token)
def google_login(req: schemas.GoogleLoginRequest, db: Session = Depends(database.get_db)):
    try:
        decoded_token = auth.firebase_auth.verify_id_token(req.token)
        email = decoded_token.get("email")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
             # Default role if not found, though ideally user should signup first or we create here
             role = decoded_token.get("role", "candidate")
             user = models.User(email=email, role=role)
             db.add(user)
             db.commit()
             db.refresh(user)
        
        return {"access_token": req.token, "token_type": "bearer", "role": user.role}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google login failed: {str(e)}")

@router.post("/google-signup", response_model=schemas.Token)
def google_signup(req: schemas.GoogleSignupRequest, db: Session = Depends(database.get_db)):
    try:
        decoded_token = auth.firebase_auth.verify_id_token(req.token)
        email = decoded_token.get("email")
        uid = decoded_token.get("uid")
        if not email or not uid:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            # Update role if already exists? Or just return existing
            user.role = req.role
        else:
            user = models.User(email=email, role=req.role)
            db.add(user)
        
        # Set Custom Claim for RBAC
        auth.set_user_role_claim(uid, req.role)
        
        db.commit()
        db.refresh(user)
        
        return {"access_token": req.token, "token_type": "bearer", "role": user.role}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Google signup failed: {str(e)}")

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role or "candidate"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
