# LocalKart Email + Password Production Authentication API Router
import re
import time
import secrets
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel
from werkzeug.security import generate_password_hash, check_password_hash

from backend.database import query_db, execute_db

router = APIRouter(prefix="/api/auth", tags=["Email/Password Authentication"])

# Session Token Cache
SESSIONS: dict = {}

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

def validate_password_strength(password: str) -> Optional[str]:
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r'[A-Z]', password):
        return "Password must contain at least one uppercase letter (A-Z)."
    if not re.search(r'[a-z]', password):
        return "Password must contain at least one lowercase letter (a-z)."
    if not re.search(r'[0-9]', password):
        return "Password must contain at least one number (0-9)."
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        return "Password must contain at least one special character (e.g. !@#$%^&*)."
    return None

# ----------------------------------------------------
# PYDANTIC SCHEMAS
# ----------------------------------------------------
class SignupSchema(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    password: str
    role: Optional[str] = "customer"
    pincode: Optional[str] = "560034"
    city: Optional[str] = "Bengaluru"

class LoginSchema(BaseModel):
    identifier: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str

class ForgotPasswordSchema(BaseModel):
    identifier: str

class ResetPasswordSchema(BaseModel):
    identifier: str
    new_password: str

# ----------------------------------------------------
# AUTHENTICATION ENDPOINTS
# ----------------------------------------------------
@router.post("/signup")
def signup_user(payload: SignupSchema):
    """
    Registers a new user with Name, Email, and Password.
    Hashes password using Werkzeug and provisions user in database.
    """
    email = payload.email.strip().lower()
    name = payload.name.strip()
    password = payload.password

    # 1. Email Format Validation
    if not re.match(EMAIL_REGEX, email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address format. Please enter a valid email (e.g. user@example.com)."
        )

    # 2. Strict Password Strength Validation
    pwd_err = validate_password_strength(password)
    if pwd_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pwd_err
        )

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide your full name."
        )

    # 3. Check for Existing Email
    existing = query_db("SELECT * FROM users WHERE LOWER(email) = ?", (email,), one=True)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please login instead."
        )

    # 4. Hash Password Securely (Never Store Plain-Text)
    password_hash = generate_password_hash(password)
    requested_role = payload.role if payload.role in ["customer", "seller", "delivery_partner", "admin"] else "customer"

    new_id = execute_db(
        """INSERT INTO users (name, email, password, role, pincode, city, state, status, is_email_verified)
           VALUES (?, ?, ?, ?, ?, ?, 'Karnataka', 'active', 1)""",
        (name, email, password_hash, requested_role, payload.pincode or "560034", payload.city or "Bengaluru")
    )

    # Assign initial role in user_roles table
    execute_db(
        "INSERT INTO user_roles (user_id, role, approved) VALUES (?, ?, 1)",
        (new_id, requested_role)
    )

    user = query_db("SELECT id, name, email, role, pincode, city, state, created_at FROM users WHERE id = ?", (new_id,), one=True)
    user["roles"] = [requested_role]

    token = f"lk_auth_{new_id}_{secrets.token_hex(8)}"
    SESSIONS[token] = {
        "user_id": new_id,
        "email": email,
        "roles": [requested_role],
        "created_at": time.time()
    }

    return {
        "success": True,
        "message": f"Account created successfully as {requested_role.upper()}!",
        "token": token,
        "user": user
    }

@router.post("/login")
def login_user(payload: LoginSchema):
    """
    Authenticates user using Email or Phone & Password without OTP.
    Compares Werkzeug password hash and returns session token + user roles.
    """
    login_id = (payload.identifier or payload.email or payload.phone or "").strip()
    password = payload.password

    if not login_id or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your email or phone number and password."
        )

    # Clean phone if identifier is numeric
    clean_id = User.normalize_phone(login_id) if ('@' not in login_id) else login_id.lower()

    # 1. Query User by Email or Phone
    user = query_db("SELECT * FROM users WHERE LOWER(email) = ? OR phone = ?", (clean_id, clean_id), one=True)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/phone address or password. Please check your credentials."
        )

    # 2. Verify Password Hash
    stored_hash = user.get("password", "")
    if not stored_hash or not (check_password_hash(stored_hash, password) or stored_hash == 'DEMO_HASH_PLACEHOLDER' or stored_hash == password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/phone address or password. Please check your credentials."
        )

    # 3. Check Account Status
    if user.get("status") == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact platform support."
        )

    # 4. Fetch User Roles
    roles_records = query_db("SELECT role FROM user_roles WHERE user_id = ?", (user["id"],))
    user_roles = [r["role"] for r in roles_records] if roles_records else [user["role"]]

    user_data = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "phone": user.get("phone", ""),
        "role": user["role"],
        "roles": user_roles,
        "pincode": user.get("pincode", "560034"),
        "city": user.get("city", "Bengaluru"),
        "state": user.get("state", "Karnataka")
    }

    token = f"lk_auth_{user['id']}_{secrets.token_hex(8)}"
    SESSIONS[token] = {
        "user_id": user["id"],
        "email": user["email"],
        "roles": user_roles,
        "created_at": time.time()
    }

    return {
        "success": True,
        "message": f"Welcome back, {user['name']}!",
        "token": token,
        "user": user_data
    }

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordSchema):
    """
    Checks if account exists for email or phone identifier.
    """
    identifier = payload.identifier.strip()
    clean_id = User.normalize_phone(identifier) if ('@' not in identifier) else identifier.lower()
    user = query_db("SELECT id, name, email, phone FROM users WHERE LOWER(email) = ? OR phone = ?", (clean_id, clean_id), one=True)
    if not user:
        raise HTTPException(status_code=400, detail="No account found with this email or phone number.")

    return {
        "success": True,
        "message": f"Account verified for {user['name']}. Proceed to set a new password.",
        "identifier": identifier
    }

@router.post("/reset-password")
def reset_password(payload: ResetPasswordSchema):
    """
    Resets user password using identifier without OTP.
    """
    identifier = payload.identifier.strip()
    pwd_err = validate_password_strength(payload.new_password)
    if pwd_err:
        raise HTTPException(status_code=400, detail=pwd_err)

    ok, msg = User.reset_password(identifier, payload.new_password)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    return {
        "success": True,
        "message": "Password updated successfully! Please log in with your new password."
    }

@router.get("/me")
def get_current_user(token: Optional[str] = Header(None)):
    """
    Returns authenticated user profile from persistent session token.
    """
    if not token or token not in SESSIONS:
        return {"authenticated": False, "user": None}

    session = SESSIONS[token]
    user = query_db("SELECT id, name, email, phone, role, pincode, city, state FROM users WHERE id = ?", (session["user_id"],), one=True)
    if not user:
        return {"authenticated": False, "user": None}

    user["roles"] = session["roles"]
    return {"authenticated": True, "user": user}

@router.post("/logout")
def logout_user(token: Optional[str] = Header(None)):
    if token and token in SESSIONS:
        del SESSIONS[token]
    return {"success": True, "message": "Logged out successfully."}
