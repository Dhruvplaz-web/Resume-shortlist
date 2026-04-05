import os
import json
from google import genai
from dotenv import load_dotenv

# Load our .env file to securely get the API key
load_dotenv()

# Initialize the new, modern GenAI client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def parse_resume_with_gemini(resume_text: str, jd_text: str) -> dict:
    """
    Sends the raw resume text and job description to Gemini, 
    forcing it to return a strictly formatted JSON response.
    """
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) parser.
    Your job is to read a raw resume and compare it against a Job Description.
    
    JOB DESCRIPTION:
    {jd_text}
    
    RESUME TEXT:
    {resume_text}
    
    Extract the candidate's details and evaluate their fit. 
    Return ONLY a valid JSON object matching this exact structure:
    {{
        "name": "Candidate Full Name",
        "email": "Email Address",
        "score": 0-100 (Overall fit score),
        "skillMatch": 0-100 (How well skills align with JD),
        "experience": 0-100 (How well years of experience align),
        "status": "Excellent", "Good", or "Moderate",
        "flags": "None", "Mismatch", or other warnings
    }}
    Do not include markdown formatting like ```json. Return ONLY the raw JSON string.
    """
    
    try:
        # The new way to call the model using the client
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        # Clean up the response in case Gemini includes markdown formatting
        clean_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"Gemini Parsing Error: {e}")
        # Fallback dummy data if the AI fails
        return {
            "name": "Unknown", "email": "error@parse.com", "score": 0, 
            "skillMatch": 0, "experience": 0, "status": "Error", "flags": "AI Failed"
        }