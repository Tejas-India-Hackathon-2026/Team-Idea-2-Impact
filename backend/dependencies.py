# LocalKart Production Authentication & Role-Based Access Control (RBAC) Dependencies
import os
from typing import List, Optional, Callable
from fastapi import Header, HTTPException, Depends, status
import firebase_admin
from firebase_admin import auth as firebase_auth

from backend.firebase_config import verify_firebase_token
from backend.database import query_db

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """
    Verifies Firebase ID token from Authorization header and returns
    the authenticated user profile from the database.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing or malformed Authorization header."
        )

    id_token = authorization.split("Bearer ")[1].strip()
    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )

    # Verify token via Firebase Admin SDK
    decoded_token = verify_firebase_token(id_token)
    if not decoded_token or "uid" not in decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase ID token verification failed or expired."
        )

    firebase_uid = decoded_token["uid"]
    phone_number = decoded_token.get("phone_number", "")

    # Query PostgreSQL / Database for authenticated user
    user = query_db("SELECT * FROM users WHERE firebase_uid = ?", (firebase_uid,), one=True)
    
    if not user and phone_number:
        clean_phone = phone_number.replace("+91", "").replace("+", "").strip()
        user = query_db("SELECT * FROM users WHERE phone = ? OR phone = ?", (phone_number, clean_phone), one=True)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found. Please complete profile registration."
        )

    if user.get("status") == "suspended":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact support."
        )

    return user

def require_roles(allowed_roles: List[str]):
    """
    Dependency factory that restricts API access to authorized roles.
    Never trusts roles passed by client side.
    """
    async def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "customer")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of authorized roles: {', '.join(allowed_roles)}"
            )
        return current_user

    return role_checker

# Pre-built Role Dependencies
require_customer = require_roles(["customer", "admin"])
require_seller = require_roles(["seller", "admin"])
require_delivery = require_roles(["delivery_partner", "admin"])
require_admin = require_roles(["admin"])
