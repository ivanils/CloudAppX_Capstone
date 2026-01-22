from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from logic import get_prioritized_tickets

# Initialize the FastAPI
app = FastAPI(
    title="CloudAppX Technical Debt API",
    description="API to prioritize technical debt tickets based on business value and severity.",
    version="1.0.0"
)

# CORS configuration (crucial for the frontend to communicate with the backend.)
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
    
# To run the server: uvicorn main:app --reload