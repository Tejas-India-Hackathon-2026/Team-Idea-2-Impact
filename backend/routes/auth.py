# LocalKart Production Authentication API Router
import time
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel

from backend.firebase_config import verify_firebase_token
from backend.database import query_db, execute_db
from backend.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class VerifyTokenSchema(BaseModel):
    id_token: str
    requested_role: Optional[str] = "customer"

class RegisterProfileSchema(BaseModel):
    id_token: str
    name: str
    email: Optional[str] = ""
    role: str  # "customer", "seller", "delivery_partner"
    pincode: Optional[str] = "560034"
    city: Optional[str] = "Bengaluru"
    state: Optional[str] = "Karnataka"

@router.post("/verify-token")
def verify_firebase_id_token(payload: VerifyTokenSchema):
    """
    Verifies Firebase ID token sent after client-side SMS OTP verification.
    Finds or provisions user in PostgreSQL database.
    """
    decoded = verify_firebase_token(payload.id_token)
    if not decoded or "uid" not in decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token."
        )

    firebase_uid = decoded["uid"]
    raw_phone = decoded.get("phone_number", "")
    phone = raw_phone.replace("+91", "").replace("+", "").strip() or "9876543210"

    user = query_db("SELECT * FROM users WHERE firebase_uid = ?", (firebase_uid,), one=True)

    if not user:
        # Check by phone number
        user = query_db("SELECT * FROM users WHERE phone = ?", (phone,), one=True)
        if user:
            # Update firebase_uid on existing phone user
            execute_db("UPDATE users SET firebase_uid = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (firebase_uid, user["id"]))
            user = query_db("SELECT * FROM users WHERE id = ?", (user["id"],), one=True)
        else:
            # Provision new user in PostgreSQL
            new_id = execute_db(
                """INSERT INTO users (firebase_uid, phone, role, name, status, pincode, city, state)
                   VALUES (?, ?, ?, ?, 'active', '560034', 'Bengaluru', 'Karnataka')""",
                (firebase_uid, phone, payload.requested_role or "customer", f"User {phone[-4:]}")
            )
            user = query_db("SELECT * FROM users WHERE id = ?", (new_id,), one=True)

    return {
        "success": True,
        "authenticated": True,
        "user": user,
        "token": payload.id_token,
        "message": "Firebase ID Token verified successfully against production backend database!"
    }

@router.post("/register-profile")
def register_user_profile(payload: RegisterProfileSchema):
    """
    Completes user profile registration with role, name, location in database.
    """
    decoded = verify_firebase_token(payload.id_token)
    if not decoded or "uid" not in decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token."
        )

    firebase_uid = decoded["uid"]
    phone = decoded.get("phone_number", "").replace("+91", "").replace("+", "").strip() or "9876543210"

    existing = query_db("SELECT * FROM users WHERE firebase_uid = ?", (firebase_uid,), one=True)

    if existing:
        execute_db(
            """UPDATE users 
               SET name = ?, email = ?, role = ?, pincode = ?, city = ?, state = ?, updated_at = CURRENT_TIMESTAMP
               WHERE firebase_uid = ?""",
            (payload.name, payload.email or "", payload.role, payload.pincode or "560034", payload.city or "Bengaluru", payload.state or "Karnataka", firebase_uid)
        )
        user = query_db("SELECT * FROM users WHERE firebase_uid = ?", (firebase_uid,), one=True)
    else:
        new_id = execute_db(
            """INSERT INTO users (firebase_uid, phone, role, name, email, pincode, city, state, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')""",
            (firebase_uid, phone, payload.role, payload.name, payload.email or "", payload.pincode or "560034", payload.city or "Bengaluru", payload.state or "Karnataka")
        )
        user = query_db("SELECT * FROM users WHERE id = ?", (new_id,), one=True)

    return {
        "success": True,
        "message": f"Profile registered successfully as {payload.role.upper()}",
        "user": user
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """
    Returns current authenticated user profile verified against PostgreSQL.
    """
    return {
        "authenticated": True,
        "user": current_user
    }
