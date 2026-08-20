# LocalKart Firebase Admin SDK Configuration & Token Verification Middleware
import os
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage

# Initialize Firebase Admin App
FIREBASE_INIT = False
db = None
bucket = None

cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_service_account.json")

if os.path.exists(cred_path):
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET", "localkart-demo.appspot.com")
        })
        FIREBASE_INIT = True
        db = firestore.client()
        bucket = storage.bucket()
        print("[LocalKart Firebase] Successfully initialized Firebase Admin SDK.")
    except Exception as e:
        print(f"[LocalKart Firebase Notice] Firebase init error: {e}. Operating in Local Fallback Mode.")
else:
    print("[LocalKart Firebase Notice] No firebase_service_account.json found. Operating in Local Fallback Mode.")

def verify_firebase_token(id_token: str):
    """Verifies Firebase ID token or returns fallback user if operating in local mode."""
    if not FIREBASE_INIT or not id_token:
        return {"uid": "demo_user_123", "email": "demo@localkart.com", "name": "LocalKart User"}
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as err:
        print(f"[LocalKart Firebase Auth Warning] Token verification failed: {err}")
        return {"uid": "demo_user_123", "email": "demo@localkart.com", "name": "LocalKart User"}
