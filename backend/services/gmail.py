import os
import base64
import json
import pickle
from typing import List, Dict, Any, Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from loguru import logger
import mailparser

# If modifying these SCOPES, delete the file token.pickle.
SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
]

class GmailService:
    _instance = None
    _service = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GmailService, cls).__new__(cls)
            cls._initialize_service()
        return cls._instance

    @classmethod
    def _initialize_service(cls):
        """Initializes the Gmail API service."""
        creds = None
        token_path = 'token.pickle'
        creds_path = 'credentials.json.json'

        # 1. Try Loading from Environment Variables (Production)
        env_token = os.getenv("GMAIL_TOKEN_JSON")
        env_creds = os.getenv("GMAIL_CREDENTIALS_JSON")

        if env_token:
            # Parse token directly from JSON string in env
            try:
                token_data = json.loads(env_token)
                # Reconstruct Credentials object from JSON data
                creds = Credentials.from_authorized_user_info(token_data, SCOPES)
            except Exception as e:
                logger.error(f"Failed to load token from environment: {e}")

        # 2. Fallback to Local File (Development)
        if not creds and os.path.exists(token_path):
            with open(token_path, 'rb') as token:
                try:
                    creds = pickle.load(token)
                except Exception:
                    pass
        
        # 3. If no valid credentials, log in (Local Dev Only)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    creds.refresh(Request())
                except Exception as e:
                    logger.error(f"Error refreshing token: {e}")
                    creds = None

            if not creds:
                if env_creds:
                    # Write env creds to temp file for flow
                    with open("temp_creds.json", "w") as f:
                        f.write(env_creds)
                    flow = InstalledAppFlow.from_client_secrets_file("temp_creds.json", SCOPES)
                elif os.path.exists(creds_path):
                    flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                else:
                    logger.warning("No credentials found. Gmail service will fail.")
                    return

                # Only run local server if we are truly local (not in production env without token)
                # In production, we MUST have the token in env.
                if not os.getenv("RENDER"): 
                    creds = flow.run_local_server(port=8000)
                    with open(token_path, 'wb') as token:
                        pickle.dump(creds, token)
                else:
                     logger.error("Cannot perform OAuth flow in production. Set GMAIL_TOKEN_JSON.")
                     return

        try:
            cls._service = build('gmail', 'v1', credentials=creds)
            logger.info("Gmail API service initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to build Gmail service: {e}")
            raise

    def get_unread_messages(self, query: str = "is:unread") -> List[Dict[str, str]]:
        """Fetches unread messages matching the query."""
        try:
            results = self._service.users().messages().list(userId='me', q=query).execute()
            messages = results.get('messages', [])
            return messages
        except Exception as e:
            logger.error(f"Error fetching messages: {e}")
            return []

    def get_message_details(self, msg_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves details for a specific message and parses it."""
        try:
            message = self._service.users().messages().get(userId='me', id=msg_id, format='raw').execute()
            msg_raw = base64.urlsafe_b64decode(message['raw'].encode('ASCII'))
            mail = mailparser.parse_from_bytes(msg_raw)
            
            attachments = []
            for attachment in mail.attachments:
                if attachment['mail_content_type'] == 'application/pdf':
                    # Decode and prepare for saving
                    attachments.append({
                        'filename': attachment['filename'],
                        'payload': attachment['payload'], # base64 encoded
                        'binary': base64.b64decode(attachment['payload'])
                    })

            # Extract clean from address
            sender_name = ""
            sender_email = ""
            if mail.from_:
                # mail.from_ is a list of tuples [('Name', 'email@addr.com')]
                name, email = mail.from_[0]
                sender_name = name or email
                sender_email = email

            return {
                'id': msg_id,
                'subject': mail.subject,
                'from': sender_name,
                'email': sender_email,
                'body': mail.text_plain[0] if mail.text_plain else "",
                'attachments': attachments
            }
        except Exception as e:
            logger.error(f"Error getting message {msg_id}: {e}")
            return None

    def mark_as_read(self, msg_id: str):
        """Removes the UNREAD label from a message."""
        try:
            self._service.users().messages().modify(
                userId='me', 
                id=msg_id, 
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
            logger.info(f"Message {msg_id} marked as READ.")
        except Exception as e:
            logger.error(f"Error marking message {msg_id} as read: {e}")

# Usage:
# gmail = GmailService()
# msgs = gmail.get_unread_messages()
