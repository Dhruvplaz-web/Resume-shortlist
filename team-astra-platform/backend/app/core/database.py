from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# This will create a file named 'astra.db' in your backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./astra.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency tool to give our API access to the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()