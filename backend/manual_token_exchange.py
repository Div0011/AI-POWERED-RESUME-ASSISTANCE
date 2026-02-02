from google_auth_oauthlib.flow import InstalledAppFlow
import pickle
import sys

# The user provided the code and the redirect URI should be http://localhost:8000/
# We need to recreate the flow with the exact same parameters to swap the code.

SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
]
creds_path = 'credentials.json.json'

def exchange_code(auth_code):
    try:
        flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
        flow.redirect_uri = 'http://localhost:8000/' # Must match the one used to get the code
        
        print(f"Exchanging code: {auth_code}...")
        flow.fetch_token(code=auth_code)
        
        creds = flow.credentials
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
        print("\n✅ Success! token.pickle has been created manually.")
    except Exception as e:
        print(f"\n❌ Error during manual code exchange: {e}")

if __name__ == "__main__":
    # We'll take the code from the command line
    if len(sys.argv) > 1:
        exchange_code(sys.argv[1])
    else:
        print("Please provide the authorization code.")
