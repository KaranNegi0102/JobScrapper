import os
from urllib.parse import urlencode
import httpx
from dotenv import load_dotenv
import re

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

def get_google_auth_url():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": "https://www.googleapis.com/auth/gmail.readonly",
        "access_type": "offline",
        "prompt": "consent"
    }
    return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"

async def exchange_code_for_token(code: str):
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        return response.json()

async def fetch_job_related_emails(access_token: str):
    base_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages"
    headers = {"Authorization": f"Bearer {access_token}"}
    job_emails = []

    async with httpx.AsyncClient() as client:
        message_list = await client.get(
            base_url,
            headers=headers,
            params={"labelIds": "INBOX", "maxResults": 50}
        )
        messages = message_list.json().get("messages", [])
        # print(f"number of messages are = {messages}")

        for msg in messages:
            detail = await client.get(f"{base_url}/{msg['id']}", headers=headers)
            data = detail.json()
            # print(f"data is {data}")
            snippet = data.get("snippet", "")
            subject = ""

            for header in data.get("payload", {}).get("headers", []):
                name=header["name"].lower()
                if name == "subject":
                    subject = header["value"]
                elif name == "from":
                    full_sender = header["value"]
                    match = re.match(r"(.*?)(?:\s*<.*?>)?$", full_sender)
                    sender = match.group(1).strip() if match else full_sender


            # Add your filter conditions here
            if any(word in subject.lower() for word in ["job", "interview", "position", "hiring", "resume"]) \
               or any(company in sender.lower() for company in [
                   "naukri", "internshala", "linkedin", "job hai", "career", "indeed", "vijay"
               ]):
                job_emails.append({
                    "id": msg["id"],
                    "subject": subject,
                    "sender": sender,
                    "snippet": snippet,
                     "link": f"https://mail.google.com/mail/u/0/#inbox/{msg['id']}"
                })

    return job_emails
