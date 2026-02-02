import os
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
creds_path = 'credentials.json.json'

def get_url():
    flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
    flow.redirect_uri = 'http://localhost:8000'
    auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
    
    print("\n" + "="*50)
    print("GOOGLE AUTHORIZATION URL (Broken for Terminal Visibility):")
    # Break into 50 char chunks
    for i in range(0, len(auth_url), 50):
        print(auth_url[i:i+50])
    print("="*50 + "\n")

if __name__ == "__main__":
    get_url()
