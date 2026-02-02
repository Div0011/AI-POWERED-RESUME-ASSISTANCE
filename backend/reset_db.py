import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from database import engine, init_db
from models import Base

def reset_db():
    print("Resetting database...")
    Base.metadata.drop_all(bind=engine)
    print("Done dropping tables.")
    Base.metadata.create_all(bind=engine)
    print("Database tables recreated successfully.")

if __name__ == "__main__":
    reset_db()
