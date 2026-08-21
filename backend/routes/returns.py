# LocalKart Returns API Router
import secrets
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/returns", tags=["Returns"])

class ReturnRequestSchema(BaseModel):
    order_id: int
    product_id: int
    reason: str
    details: Optional[str] = ""

@router.get("")
def list_returns(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    returns = query_db("SELECT * FROM return_requests WHERE customer_id = ? ORDER BY created_at DESC", (user_id,))
    return {"status": "success", "count": len(returns), "returns": returns}

@router.post("", dependencies=[Depends(require_customer)])
def create_return_request(payload: ReturnRequestSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return_code = f"RET-{secrets.token_hex(4).upper()}"
    new_id = execute_db(
        """INSERT INTO return_requests (return_code, customer_id, order_id, product_id, reason, details, status)
           VALUES (?, ?, ?, ?, ?, ?, 'Requested')""",
        (return_code, user_id, payload.order_id, payload.product_id, payload.reason, payload.details or "")
    )
    request = query_db("SELECT * FROM return_requests WHERE id = ?", (new_id,), one=True)
    return {"status": "success", "message": "Return request filed successfully!", "return": request}
