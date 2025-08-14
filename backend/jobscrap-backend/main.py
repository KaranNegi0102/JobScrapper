from fastapi import FastAPI, Query
from fastapi.responses import RedirectResponse
from helper import get_google_auth_url, exchange_code_for_token, fetch_job_related_emails
from fastapi.middleware.cors import CORSMiddleware
from helper import create_calendar_reminder

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to Gmail Job Scraper"}

@app.get("/auth/login")
def login(redirect_uri: str = Query(default="http://localhost:3000")):
    return RedirectResponse(get_google_auth_url(redirect_uri))

@app.get("/auth/callback")
async def auth_callback(code: str, state: str = Query(None)):
    token_data = await exchange_code_for_token(code)
    access_token = token_data.get("access_token")

    # Use the state parameter to get the original redirect URI
    # If no state provided, default to dashboard
    redirect_uri = state if state else "http://localhost:3000/mainDashboard"
    
    # Pass token to frontend using query param
    redirect_url = f"{redirect_uri}?token={access_token}"
    return RedirectResponse(url=redirect_url)

@app.get("/emails")
async def get_emails(access_token: str = Query(...)):
    emails = await fetch_job_related_emails(access_token)
    # print(f"emails are {emails}")
    return emails

@app.post("/schedule-reminder")
def schedule_reminder(
    access_token: str = Query(...),
    title: str = Query(...),
    setDate: str = Query(...),  # format: YYYY-MM-DD
    description: str = Query(...)):

    print("these are my informations")
    print(title, setDate, description)
    result = create_calendar_reminder(access_token, title, setDate, description)
    return result



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)