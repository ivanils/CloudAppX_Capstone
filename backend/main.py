import os

from dotenv import load_dotenv
from google import genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from logic import get_prioritized_tickets
from pydantic import BaseModel
from typing import List


load_dotenv()
# GEMINI API KEY setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ Error Crítico: No se encontró la GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=GEMINI_API_KEY)

# To get the updated list of models available
# print("Listing available models...")
# for model in client.models.list():
#     print(model.name)
    
# Initialize the FastAPI
app = FastAPI(
    title="CloudAppX Technical Debt API",
    description="API to prioritize technical debt tickets based on business value and severity.",
    version="1.0.0"
)

# CORS configuration (crucial for the communication between the front and the backend)
# Allow requests from localhost ports normally used by react.
origin_points = [
    "http://localhost:3000",  
    "http://localhost:5173",  
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin_points, 
    allow_credentials=True,      
    allow_methods=["*"],         
    allow_headers=["*"],         
)

# Data model for receiving tickets front the front end (just if needed in future)
class Ticket(BaseModel):
    id: str
    title: str
    severity: int
    business_value: int
    effort_hours: int

# API endopoints IMPROTANT 
@app.get("/")
def read_root():
    return {"message": "API is running correctly"}

@app.get("/api/tickets")
def read_tickets():
    # Main endpoint to fetch prioritized tickets )http://127.0.0.1:8000/api/tickets) It calls the logic to process data and returns the sorted JSON list.
    try:
        data = get_prioritized_tickets()
        return data
    except Exception as e:
        return {"error": str(e)}
@app.post("/api/analyze")
async def analyze_ticket():
    try:
        # getting the ticket details
        tickets = get_prioritized_tickets()
        # IA Prompt
        tickets_summary = "\n".join([
            f"- Ticket {t['id']}: {t['title']} (Severity: {t['severity']}, Business Value: {t['business_value']}, Effort Hours: {t['effort_hours']}h)"
            for t in tickets[:10]
        ])
        prompt = f"""
        You are an expert software project manager. You are analyzing the current technical debt of CloudAppX, which is a Saas company.
        Given the following technical debt ticket:
        {tickets_summary}
        
        Based on this data, provide a strictly professional executive summary (max 500 words) covering:
        1. The most critical risk detected.
        2. A strategic recommendation for the next sprint.
        3. The potential business impact if ignored.
        
        Provide the analysis in the most professional tone possible, using markdown formatting with headings and bullet points for clarity.
        ️Make sure to highlight key points using bold text where appropriate.
        
        """
        # Gemini Call
        response = client.models.generate_content(
            model="gemini-2.0-flash-001",
            contents=prompt
        )
        return {"analysis": response.text}
    
    except Exception as e:
        print(f"Error during ticket analysis: {e}")
        fallback_report = """
        ### ⚠️ AI Connectivity Issue (Offline Mode)

        **Critical Risk Analysis:**
        Based on the metadata, the **SQL Injection vulnerability (TIC-019)** is the highest priority threat. It exposes the entire database to unauthorized access, carrying a severity score of 5/5.

        **Strategic Recommendation:**
        Allocate senior backend resources immediately to patch TIC-019 and TIC-001 (Payment Gateway). Pause low-value UI tasks like "Dark Mode" until critical stability is restored.

        **Business Impact:**
        Ignoring these risks could result in a **major data breach** and payment processing failures, potentially costing CloudAppX over $50k in churn this quarter.
        """
        return {"analysis": fallback_report}
        
        
if __name__ == "__main__":
    import uvicorn
    print("Starting the API server at http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
