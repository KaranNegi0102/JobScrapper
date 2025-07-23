from fastapi import FastAPI, Query
from fastapi.responses import RedirectResponse
from helper import get_google_auth_url, exchange_code_for_token, fetch_job_related_emails

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Welcome to Gmail Job Scraper"}

@app.get("/auth/login")
def login():
    return RedirectResponse(get_google_auth_url())

@app.get("/auth/callback")
async def auth_callback(code: str):
    token_data = await exchange_code_for_token(code)
    return token_data  # Frontend should extract and save the access_token

@app.get("/emails")
async def get_emails(access_token: str = Query(...)):
    emails = await fetch_job_related_emails(access_token)
    return emails


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)