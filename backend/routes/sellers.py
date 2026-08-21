# LocalKart Sellers API Router
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_seller

router = APIRouter(prefix="/api/sellers", tags=["Sellers"])

class RegisterSellerSchema(BaseModel):
    business_name: str
    description: Optional[str] = ""
    pincode: str
    location: Optional[str] = "Bengaluru"
    self_delivery: Optional[bool] = True

@router.get("")
def list_sellers(pincode: Optional[str] = None):
    if pincode:
        sellers = query_db("SELECT * FROM sellers WHERE pincode = ?", (pincode,))
    else:
        sellers = query_db("SELECT * FROM sellers")
    return {"status": "success", "count": len(sellers), "sellers": sellers}

@router.get("/portal", dependencies=[Depends(require_seller)])
def get_seller_portal_data(current_user: dict = Depends(get_current_user)):
    """
    Returns seller dashboard overview data.
    Protected API: Customer role CANNOT access this route.
    """
    seller = query_db("SELECT * FROM sellers WHERE user_id = ?", (current_user["id"],), one=True)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller profile not found.")

    products = query_db("SELECT * FROM products WHERE seller_id = ?", (seller["id"],))
    orders = query_db("SELECT * FROM orders WHERE seller_id = ?", (seller["id"],))
    
    return {
        "status": "success",
        "seller": seller,
        "products_count": len(products),
        "orders_count": len(orders),
        "products": products,
        "orders": orders
    }

@router.post("/register")
def register_seller(payload: RegisterSellerSchema, current_user: dict = Depends(get_current_user)):
    existing = query_db("SELECT * FROM sellers WHERE user_id = ?", (current_user["id"],), one=True)
    if existing:
        return {"status": "success", "message": "Seller profile already exists.", "seller": existing}

    new_id = execute_db(
        """INSERT INTO sellers (user_id, business_name, description, location, pincode, self_delivery, approval_status)
           VALUES (?, ?, ?, ?, ?, ?, 'Approved')""",
        (current_user["id"], payload.business_name, payload.description or "", payload.location or "Bengaluru", payload.pincode, 1 if payload.self_delivery else 0)
    )

    # Promote user role to seller in database
    execute_db("UPDATE users SET role = 'seller', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (current_user["id"],))

    seller = query_db("SELECT * FROM sellers WHERE id = ?", (new_id,), one=True)
    return {"status": "success", "message": "Seller profile created successfully!", "seller": seller}
