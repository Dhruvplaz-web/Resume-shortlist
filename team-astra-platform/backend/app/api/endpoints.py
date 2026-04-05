from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.schemas import CandidateResponse, UploadResponse

# AI Tools
from app.core.pdf_parser import extract_text_from_pdf
from app.ai_engine.llm_structuring import parse_resume_with_gemini

# Database Tools
from app.core.database import get_db, engine
from app.models.db_models import DBCandidate, Base

# This line magically creates the database file and tables if they don't exist yet!
Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.get("/candidates", response_model=List[CandidateResponse])
async def get_candidates(db: Session = Depends(get_db)):
    """Fetches all candidates from the REAL SQLite database."""
    candidates = db.query(DBCandidate).all()
    return candidates

@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    github_url: str = Form(""),    # Accepting our new social links
    linkedin_url: str = Form(""),  # Accepting our new social links
    db: Session = Depends(get_db)
):
    """Receives file, parses with AI, and saves to the permanent database."""
    
    pdf_bytes = await resume.read()
    resume_text = await extract_text_from_pdf(pdf_bytes)
    
    if resume_text:
        # Ask Gemini to structure the data
        structured_data = parse_resume_with_gemini(resume_text, job_description)
        
        # Create a new database record
        db_candidate = DBCandidate(
            name=structured_data.get("name", "Unknown"),
            email=structured_data.get("email", "unknown@email.com"),
            score=structured_data.get("score", 0),
            skillMatch=structured_data.get("skillMatch", 0),
            experience=structured_data.get("experience", 0),
            status=structured_data.get("status", "Moderate"),
            flags=structured_data.get("flags", "None")
        )
        
        # Save it permanently to SQLite
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)
        
        return {
            "message": f"Successfully parsed {db_candidate.name}'s resume and saved to DB!", 
            "filename": resume.filename
        }
    
    return {"message": "Failed to extract text from PDF.", "filename": resume.filename}