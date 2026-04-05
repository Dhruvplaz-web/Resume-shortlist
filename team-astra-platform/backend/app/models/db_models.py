from sqlalchemy import Column, Integer, String
from app.core.database import Base

class DBCandidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    score = Column(Integer)
    skillMatch = Column(Integer)
    experience = Column(Integer)
    status = Column(String)
    flags = Column(String)