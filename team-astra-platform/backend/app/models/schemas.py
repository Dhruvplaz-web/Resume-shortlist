from pydantic import BaseModel
from typing import Optional, List

# This exactly matches the data structure in your frontend mockData.js
class CandidateBase(BaseModel):
    name: str
    email: str
    score: int
    skillMatch: int
    experience: int
    status: str
    flags: str

class CandidateResponse(CandidateBase):
    id: int

class UploadResponse(BaseModel):
    message: str
    filename: str