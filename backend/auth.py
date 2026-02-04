from datetime import datetime, timedelta
from typing import Optional
import os
import json
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import models, database

# 1. Initialize Firebase Admin
firebase_creds_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
if firebase_creds_json:
    try:
        creds_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(creds_dict)
        firebase_admin.initialize_app(cred)
        print("[SUCCESS] Firebase Admin initialized via environment variable.")
    except Exception as e:
        print(f"[ERROR] Error initializing Firebase Admin: {e}")
else:
    # Local fallback
    local_creds = "service-account.json"
    if not os.path.exists(local_creds):
        local_creds = os.path.join("backend", "service-account.json")
    
    if os.path.exists(local_creds):
        try:
            cred = credentials.Certificate(local_creds)
            firebase_admin.initialize_app(cred)
            print(f"[SUCCESS] Firebase Admin initialized via local file: {local_creds}")
        except Exception as e:
            print(f"[ERROR] Error initializing Firebase Admin via local file: {e}")
    else:
        print("[WARNING] Warning: Firebase Admin not initialized. Role-based features may fail.")

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    # 1. DEV_MODE Bypass (for local development)
    if os.getenv("DEV_MODE", "false").lower() == "true":
        print("[DEV_MODE] Bypassing authentication - using dev user")
        # Return or create a dev user
        dev_email = "dev@mowglai.in"
        user = db.query(models.User).filter(models.User.email == dev_email).first()
        if not user:
            user = models.User(email=dev_email, role="recruiter")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 2. Try Firebase Verification First
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        email = decoded_token.get("email")
        if email:
            user = db.query(models.User).filter(models.User.email == email).first()
            if not user:
                # Sync User to Local DB
                role = decoded_token.get("role", "candidate") # Default role
                user = models.User(email=email, role=role)
                db.add(user)
                db.commit()
                db.refresh(user)
            return user
    except Exception:
        # 3. Fallback to Local JWT if Firebase Fails
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email:
                user = db.query(models.User).filter(models.User.email == email).first()
                if user:
                    return user
        except JWTError:
            pass
            
    raise credentials_exception

def set_user_role_claim(uid: str, role: str):
    try:
        firebase_auth.set_custom_user_claims(uid, {"role": role})
        return True
    except Exception as e:
        print(f"Error setting custom claims: {e}")
        return False

class RoleChecker:
    def __init__(self, required_role: str):
        self.required_role = required_role

    def __call__(self, user: models.User = Depends(get_current_user)):
        if user.role != self.required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {user.role}. Required: {self.required_role}"
            )
        return user
