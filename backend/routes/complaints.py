# LocalKart Complaints & Support Ticket API Router
import secrets
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

class ComplaintSchema(BaseModel):
    issue_type: str  # Delivery, Product, Seller, Payment, Return
    description: str
    order_id: Optional[int] = None
    seller_id: Optional[int] = None

class ComplaintMessageSchema(BaseModel):
    message: str

@router.get("")
def list_complaints(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    complaints = query_db("SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    return {"status": "success", "count": len(complaints), "complaints": complaints}

@router.post("", dependencies=[Depends(require_customer)])
def file_complaint(payload: ComplaintSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    code = f"CMP-{secrets.token_hex(4).upper()}"
    new_id = execute_db(
        """INSERT INTO complaints (complaint_code, user_id, order_id, seller_id, issue_type, description, status)
           VALUES (?, ?, ?, ?, ?, ?, 'OPEN')""",
        (code, user_id, payload.order_id, payload.seller_id, payload.issue_type, payload.description)
    )
    complaint = query_db("SELECT * FROM complaints WHERE id = ?", (new_id,), one=True)
    return {
        "status": "success", 
        "message": "Customer support complaint ticket created successfully!", 
        "complaint_code": code,
        "complaint": complaint
    }
