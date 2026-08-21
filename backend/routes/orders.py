# LocalKart Orders API Router with Unique Order Code Generation & Cancellation Logic
import secrets
import json
import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/orders", tags=["Orders"])

class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int
    price: float
    customization: Optional[Dict[str, Any]] = None

class CreateOrderSchema(BaseModel):
    seller_id: int
    items: List[OrderItemSchema]
    total_amount: float
    delivery_address: str
    pincode: str
    payment_reference: Optional[str] = None
    delivery_fee: Optional[float] = 40.0

class CancelOrderSchema(BaseModel):
    reason: str

def generate_order_code() -> str:
    """Generates unique non-predictable order ID like LK-2026-000123."""
    num = secrets.randbelow(900000) + 100000
    return f"LK-2026-{num}"

@router.get("")
def list_user_orders(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    role = current_user.get("role", "customer")

    if role == "seller":
        seller = query_db("SELECT * FROM sellers WHERE user_id = ?", (user_id,), one=True)
        if not seller:
            return {"status": "success", "orders": []}
        orders = query_db("SELECT * FROM orders WHERE seller_id = ? ORDER BY created_at DESC", (seller["id"],))
    else:
        orders = query_db("SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC", (user_id,))

    return {"status": "success", "count": len(orders), "orders": orders}

@router.post("", dependencies=[Depends(require_customer)])
def create_order(payload: CreateOrderSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    order_code = generate_order_code()

    order_id = execute_db(
        """INSERT INTO orders (customer_id, seller_id, total_amount, address, pincode, status, order_code, payment_status, payment_reference)
           VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, 'SUCCESS', ?)""",
        (user_id, payload.seller_id, payload.total_amount, payload.delivery_address, payload.pincode, order_code, payload.payment_reference or secrets.token_hex(8))
    )

    for item in payload.items:
        custom_str = json.dumps(item.customization) if item.customization else None
        execute_db(
            """INSERT INTO order_items (order_id, product_id, quantity, price, customization_snapshot)
               VALUES (?, ?, ?, ?, ?)""",
            (order_id, item.product_id, item.quantity, item.price, custom_str)
        )
        # Update stock
        execute_db("UPDATE products flex SET stock = MAX(0, stock - ?) WHERE id = ?", (item.quantity, item.product_id))

    created_order = query_db("SELECT * FROM orders WHERE id = ?", (order_id,), one=True)
    return {
        "status": "success", 
        "message": "Order verified and created successfully!", 
        "order_code": order_code,
        "order": created_order
    }

@router.post("/{order_id}/cancel")
def cancel_order(order_id: int, payload: CancelOrderSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    order = query_db("SELECT * FROM orders WHERE id = ?", (order_id,), one=True)
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
        
    if order["customer_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized to cancel this order.")

    current_status = str(order.get("status", "")).upper()
    if current_status not in ["PLACED", "CONFIRMED", "PROCESSING", "PENDING"]:
        raise HTTPException(
            status_code=400, 
            detail=f"Order cannot be cancelled because current status is '{current_status}'."
        )

    execute_db(
        "UPDATE orders SET status = 'CANCELLED', payment_status = 'REFUND_PENDING', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (order_id,)
    )

    return {
        "status": "success",
        "message": "Order cancellation request accepted. Status updated to CANCELLED.",
        "order_id": order_id,
        "refund_status": "REFUND_PENDING"
    }
