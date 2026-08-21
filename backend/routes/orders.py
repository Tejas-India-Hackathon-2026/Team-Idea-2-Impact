# LocalKart Orders API Router
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/orders", tags=["Orders"])

class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int
    price: float

class CreateOrderSchema(BaseModel):
    seller_id: int
    items: List[OrderItemSchema]
    total_amount: float
    delivery_address: str
    pincode: str

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

    order_id = execute_db(
        """INSERT INTO orders (customer_id, seller_id, total_amount, address, pincode, status)
           VALUES (?, ?, ?, ?, ?, 'Placed')""",
        (user_id, payload.seller_id, payload.total_amount, payload.delivery_address, payload.pincode)
    )

    for item in payload.items:
        execute_db(
            """INSERT INTO order_items (order_id, product_id, quantity, price)
               VALUES (?, ?, ?, ?)""",
            (order_id, item.product_id, item.quantity, item.price)
        )

    created_order = query_db("SELECT * FROM orders WHERE id = ?", (order_id,), one=True)
    return {"status": "success", "message": "Order placed successfully!", "order": created_order}
