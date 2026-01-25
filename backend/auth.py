from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import models, database
import os

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Using pbkdf2_sha256 because bcrypt has issues with password length in this environment
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
    # BYPASS AUTHENTICATION FOR DEVELOPMENT
    # Always return the admin user regardless of token
    admin_email = "admin@123.login"
    user = db.query(models.User).filter(models.User.email == admin_email).first()
    
    if not user:
        # Fallback if admin wasn't created yet, return the first user
        user = db.query(models.User).first()
        
    if not user:
         # If absolutely no user exists, create a dummy one in memory (fragile but works for now)
         # Better to rely on the seed script having run.
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No users found in DB. Please run create_admin.py",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user
