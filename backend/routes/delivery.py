# LocalKart Delivery Partners API Router
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_delivery

router = APIRouter(prefix="/api/delivery", tags=["Delivery Partner"])

class RegisterDeliverySchema(BaseModel):
    name: str
    vehicle_type: Optional[str] = "Two-Wheeler / Scooter"
    license_no: Optional[str] = ""
    pincode: str

@router.get("/portal", dependencies=[Depends(require_delivery)])
def get_delivery_portal_data(current_user: dict = Depends(get_current_user)):
    """
    Returns delivery dashboard active & assigned deliveries.
    Protected API: Customer & Seller roles CANNOT access this route.
    """
    partner = query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (current_user["id"],), one=True)
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner profile not found.")

    requests = query_db("SELECT * FROM delivery_requests WHERE delivery_partner_id = ? OR status = 'Available'", (partner["id"],))

    return {
        "status": "success",
        "partner": partner,
        "deliveries": requests
    }

@router.post("/register")
def register_delivery_partner(payload: RegisterDeliverySchema, current_user: dict = Depends(get_current_user)):
    existing = query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (current_user["id"],), one=True)
    if existing:
        return {"status": "success", "message": "Delivery partner profile already exists.", "partner": existing}

    new_id = execute_db(
        """INSERT INTO delivery_partners (user_id, name, phone, vehicle_type, license_no, location, pincode, approval_status)
           VALUES (?, ?, ?, ?, ?, 'Bengaluru', ?, 'Approved')""",
        (current_user["id"], payload.name, current_user.get("phone", ""), payload.vehicle_type or "Bike", payload.license_no or "", payload.pincode)
    )

    # Promote user role in PostgreSQL
    execute_db("UPDATE users SET role = 'delivery_partner', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (current_user["id"],))

    partner = query_db("SELECT * FROM delivery_partners WHERE id = ?", (new_id,), one=True)
    return {"status": "success", "message": "Delivery partner registered successfully!", "partner": partner}
