from google_auth_oauthlib.flow import InstalledAppFlow
import pickle
import sys

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
creds_path = 'credentials.json.json'

def run_flow():
    try:
        print("Starting Google Auth Flow...")
        print("A browser window should open. If not, copy the URL from the terminal logic below.")
        flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
        # run_local_server will attempt to open a browser and wait for the redirect
        creds = flow.run_local_server(port=8000, open_browser=True)

        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
        print("\n✅ Success! token.pickle has been created.")
    except Exception as e:
        print(f"\n❌ Error during Auth Flow: {e}")

if __name__ == "__main__":
    run_flow()
