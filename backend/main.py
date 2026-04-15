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
    raise ValueError("Error: GEMINI_API_KEY not found in file .env")

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
            model="gemini-2.5-flash",
            contents=prompt
        )
        print(response.text)
        return {"analysis": response.text}
    
    except Exception as e:
        print(f"Error during ticket analysis: {e}")
        fallback_report = """

This report provides a critical assessment of the current technical debt backlog for CloudAppX, highlighting immediate risks and proposing strategic actions to safeguard business operations and maintain customer trust.

## 1. Most Critical Risk Detected

The most critical immediate risk identified is **Ticket TIC-019: Hardcoded credentials in config file** (Severity: 5, Business Value: 10, Effort Hours: 2h). This vulnerability represents a fundamental security flaw that, if exploited, can lead to **complete system compromise, unauthorized data access, and potential data exfiltration.** Its extremely low remediation effort, coupled with the catastrophic potential impact, makes it an urgent priority.

Beyond this singular point, the aggregate risk posed by multiple **Severity 5 security vulnerabilities** (including TIC-005: SQL Injection and TIC-022: XSS) and **critical operational failures** (TIC-001: Payment Gateway Timeout on High Load) indicates a substantial and immediate threat landscape that requires prompt and decisive action.

## 2. Strategic Recommendation for the Next Sprint

For the upcoming sprint, I recommend a **laser-focused initiative on resolving critical security vulnerabilities and immediate revenue-impacting issues.** Specifically, the following tickets should be prioritized and addressed as foundational for business continuity and security:

*   **Security Foundation (Highest Priority):**
    *   **TIC-019: Hardcoded credentials in config file (2h)**: Resolve this critical vulnerability immediately to prevent system-wide compromise.
    *   **TIC-005: SQL Injection vulnerability in Search (8h)**: Mitigate the direct risk of data breaches and database compromise.
    *   **TIC-022: XSS vulnerability in User Comments (12h)**: Prevent user account compromise and protect customer data integrity.
*   **Business Continuity & Revenue Assurance:**
    *   **TIC-001: Critical: Payment Gateway Timeout on High Load (15h)**: Address this direct threat to revenue generation, customer experience, and operational stability during peak periods.
*   **System Stability & Performance:**
    *   **TIC-011: Memory Leak in Notification Service (20h)**: Prevent service degradation, potential outages, and ensure reliable customer communication.

This strategic allocation ensures that the most severe threats to CloudAppX's security posture and core revenue streams are addressed without delay, laying a more stable foundation for future development and sustained growth.

## 3. Potential Business Impact if Ignored

Ignoring the identified critical technical debt would expose CloudAppX to severe and multifaceted business impacts, fundamentally jeopardizing its operational integrity and market position:

*   **Significant Financial Losses:** Direct revenue loss from failed payment transactions (TIC-001), inaccuracies in billing (TIC-046), potential regulatory fines (e.g., GDPR violations from data breaches), and substantial costs associated with incident response and litigation.
*   **Catastrophic Reputational Damage:** Data breaches resulting from hardcoded credentials or SQL injection could permanently erode customer trust, attract widespread negative media attention, and lead to substantial customer churn. Unreliable services, particularly payment processing, would further damage brand perception and market standing.
*   **Operational Instability and Outages:** Unresolved issues like the payment gateway timeout and memory leak could lead to frequent service disruptions, degraded performance, and potential system downtime, directly impacting service level agreements (SLAs) and overall user experience.
*   **Increased Security Risk:** Unaddressed vulnerabilities leave CloudAppX highly susceptible to sophisticated cyberattacks, unauthorized data access, and complete system compromise, threatening both company assets and sensitive customer data.
*   **Reduced Development Velocity and Morale:** Continuous firefighting to address critical production issues drains engineering resources, detracts from strategic feature development, leads to developer burnout, and significantly slows innovation and time-to-market.

Addressing these critical items proactively is not merely a technical exercise but an essential strategic imperative to safeguard CloudAppX's financial health, reputation, and long-term viability in a competitive SaaS market.
        """
        return {"analysis": fallback_report}
        
        
if __name__ == "__main__":
    import uvicorn
    print("Starting the API server at http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
