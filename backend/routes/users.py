# LocalKart Users API Router
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

class UpdateProfileSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    profile_image: Optional[str] = None
    pincode: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None

@router.get("/profile")
def get_user_profile(current_user: dict = Depends(get_current_user)):
    return {"status": "success", "user": current_user}

@router.put("/profile")
def update_user_profile(payload: UpdateProfileSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    name = payload.name if payload.name is not None else current_user.get("name", "")
    email = payload.email if payload.email is not None else current_user.get("email", "")
    image = payload.profile_image if payload.profile_image is not None else current_user.get("profile_image", "")
    pincode = payload.pincode if payload.pincode is not None else current_user.get("pincode", "560034")
    city = payload.city if payload.city is not None else current_user.get("city", "Bengaluru")
    state = payload.state if payload.state is not None else current_user.get("state", "Karnataka")

    execute_db(
        """UPDATE users 
           SET name = ?, email = ?, profile_image = ?, pincode = ?, city = ?, state = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?""",
        (name, email, image, pincode, city, state, user_id)
    )

    updated = query_db("SELECT * FROM users WHERE id = ?", (user_id,), one=True)
    return {"status": "success", "message": "Profile updated cleanly", "user": updated}
