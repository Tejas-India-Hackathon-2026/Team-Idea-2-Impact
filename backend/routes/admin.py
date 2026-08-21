# LocalKart Production Admin Portal API Router
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Portal"], dependencies=[Depends(require_admin)])

class ActionReasonSchema(BaseModel):
    reason: Optional[str] = ""

@router.get("/overview")
def get_admin_overview():
    """
    Returns platform key metrics for admin overview dashboard.
    """
    users_count = len(query_db("SELECT id FROM users"))
    sellers_count = len(query_db("SELECT id FROM sellers"))
    pending_sellers = len(query_db("SELECT id FROM sellers WHERE approval_status = 'Pending'"))
    verified_sellers = len(query_db("SELECT id FROM sellers WHERE verified = 1 OR approval_status = 'Approved'"))
    delivery_count = len(query_db("SELECT id FROM delivery_partners"))
    orders_count = len(query_db("SELECT id FROM orders"))
    products_count = len(query_db("SELECT id FROM products"))
    complaints_count = len(query_db("SELECT id FROM complaints WHERE status = 'Open'"))

    return {
        "status": "success",
        "metrics": {
            "total_users": users_count,
            "total_sellers": sellers_count,
            "pending_sellers": pending_sellers,
            "verified_sellers": verified_sellers,
            "delivery_partners": delivery_count,
            "total_orders": orders_count,
            "total_products": products_count,
            "open_complaints": complaints_count
        }
    }

@router.get("/users")
def get_all_users():
    users = query_db("SELECT id, firebase_uid, name, email, phone, role, status, pincode, city, state, created_at FROM users ORDER BY created_at DESC")
    return {"status": "success", "count": len(users), "users": users}

@router.get("/sellers")
def get_all_sellers(status_filter: Optional[str] = None):
    if status_filter:
        sellers = query_db(
            "SELECT s.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email FROM sellers s JOIN users u ON s.user_id = u.id WHERE s.approval_status = ? ORDER BY s.created_at DESC",
            (status_filter,)
        )
    else:
        sellers = query_db(
            "SELECT s.*, u.name as owner_name, u.phone as owner_phone, u.email as owner_email FROM sellers s JOIN users u ON s.user_id = u.id ORDER BY s.created_at DESC"
        )
    return {"status": "success", "count": len(sellers), "sellers": sellers}

@router.post("/sellers/{seller_id}/approve")
def approve_seller(seller_id: int):
    """
    Approves seller application, assigns ✓ Verified Seller badge, and sends seller notification.
    """
    seller = query_db("SELECT * FROM sellers WHERE id = ?", (seller_id,), one=True)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found.")

    execute_db("UPDATE sellers SET approval_status = 'Approved', verified = 1 WHERE id = ?", (seller_id,))
    
    # Send seller notification
    execute_db(
        """INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, 'Seller Application Approved!', ?, 'seller')""",
        (seller["user_id"], f"Congratulations! Your seller application for '{seller['business_name']}' has been approved with a ✓ Verified Seller badge.")
    )

    updated_seller = query_db("SELECT * FROM sellers WHERE id = ?", (seller_id,), one=True)
    return {"status": "success", "message": f"Seller '{seller['business_name']}' approved successfully!", "seller": updated_seller}

@router.post("/sellers/{seller_id}/reject")
def reject_seller(seller_id: int, payload: ActionReasonSchema):
    seller = query_db("SELECT * FROM sellers WHERE id = ?", (seller_id,), one=True)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found.")

    execute_db("UPDATE sellers SET approval_status = 'Rejected', verified = 0 WHERE id = ?", (seller_id,))
    
    execute_db(
        """INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, 'Seller Application Notice', ?, 'seller')""",
        (seller["user_id"], f"Your seller application for '{seller['business_name']}' was not approved. Reason: {payload.reason or 'Document verification incomplete.'}")
    )

    return {"status": "success", "message": "Seller application marked as rejected."}

@router.post("/sellers/{seller_id}/suspend")
def suspend_seller(seller_id: int, payload: ActionReasonSchema):
    seller = query_db("SELECT * FROM sellers WHERE id = ?", (seller_id,), one=True)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found.")

    execute_db("UPDATE sellers SET approval_status = 'Suspended', verified = 0 WHERE id = ?", (seller_id,))
    
    execute_db(
        """INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, 'Seller Account Suspended', ?, 'seller')""",
        (seller["user_id"], f"Your seller account '{seller['business_name']}' has been suspended due to platform policy review.")
    )

    return {"status": "success", "message": "Seller account suspended."}

@router.get("/notifications")
def get_admin_notifications():
    notifications = query_db("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50")
    return {"status": "success", "count": len(notifications), "notifications": notifications}
