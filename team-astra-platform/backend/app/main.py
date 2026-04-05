from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(title="Team Astra Core API")

# Allow our React frontend to talk to FastAPI without CORS errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach our routes
app.include_router(api_router, prefix="/api")

@app.get("/")
async def health_check():
    return {"status": "online", "message": "Team Astra backend is ready."}