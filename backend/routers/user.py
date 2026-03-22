from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, auth, database, schemas

router = APIRouter()

@router.post("/settings/update")
def update_user_settings(
    settings: schemas.UserSettingsUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Update user profile and notification settings"""
    try:
        # Fetch user from DB
        user = db.query(models.User).filter(models.User.id == current_user.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update fields
        if settings.display_name is not None:
            user.name = settings.display_name
        if settings.email_notifications is not None:
            user.email_notifications = settings.email_notifications
        if settings.message_notifications is not None:
            user.message_notifications = settings.message_notifications
        if settings.marketing_emails is not None:
            user.marketing_emails = settings.marketing_emails
        
        db.commit()
        db.refresh(user)
        
        return {
            "success": True,
            "message": "Settings updated successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "email_notifications": user.email_notifications,
                "message_notifications": user.message_notifications,
                "marketing_emails": user.marketing_emails
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update settings: {str(e)}")

@router.get("/profile")
def get_user_profile(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    """Get user profile information"""
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "email_notifications": user.email_notifications,
        "message_notifications": user.message_notifications,
        "marketing_emails": user.marketing_emails
    }
