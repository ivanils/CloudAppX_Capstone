from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from logic import get_prioritized_tickets

# Initialize the FastAPI
app = FastAPI(
    title="CloudAppX Technical Debt API",
    description="API to prioritize technical debt tickets based on business value and severity.",
    version="1.0.0"
)

# CORS configuration, it's crucial for the frontend to communicate with the backend.
# Allow requests from localhost ports commonly used by React.
origin_points = [
    "http://localhost:3000",  # Common React port (Create React App)
    "http://localhost:5173",  # Common Vite port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin_points, # List of allowed origins
    allow_credentials=True,      # Allow cookies/auth headers
    allow_methods=["*"],         # Allow all HTTP methods
    allow_headers=["*"],         # Allow all headers
)

# API  ENDPOINTS 
@app.get("/")
def read_root():
    # check endpoint to verify the server is running.
    
    return {"message": "API is running correctly"}

@app.get("/api/tickets")
def read_tickets():
    # Main endpoint to fetch prioritized tickets )http://127.0.0.1:8000/api/tickets) It calls the logic engine to process data and returns the sorted JSON list.
    try:
        # Call the function from logic.py
        data = get_prioritized_tickets()
        return data
    except Exception as e:
        # In case of error it return a message
        return {"error": str(e)}
    
# To run the server: uvicorn main:app --reload