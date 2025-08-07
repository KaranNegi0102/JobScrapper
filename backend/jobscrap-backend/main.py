from fastapi import FastAPI, Query
from fastapi.responses import RedirectResponse
from helper import get_google_auth_url, exchange_code_for_token, fetch_job_related_emails
from fastapi.middleware.cors import CORSMiddleware

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
def login():
    return RedirectResponse(get_google_auth_url())

@app.get("/auth/callback")
async def auth_callback(code: str):
    token_data = await exchange_code_for_token(code)
    access_token = token_data.get("access_token")

    # Pass token to frontend using query param (optional)
    redirect_url = f"http://localhost:3000/?token={access_token}"
    return RedirectResponse(url=redirect_url)

@app.get("/emails")
async def get_emails(access_token: str = Query(...)):
    emails = await fetch_job_related_emails(access_token)
    # print(f"emails are {emails}")
    return emails


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)