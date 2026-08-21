# LocalKart Delivery Partners API Router with Availability & Controlled Status Transitions
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_delivery

router = APIRouter(prefix="/api/delivery", tags=["Delivery Partner"])

class RegisterDeliverySchema(BaseModel):
    name: str
    vehicle_type: Optional[str] = "Two-Wheeler / Scooter"
    license_no: Optional[str] = ""
    pincode: str

class UpdateAvailabilitySchema(BaseModel):
    availability_status: str  # ONLINE, OFFLINE, BUSY

class UpdateDeliveryStatusSchema(BaseModel):
    task_id: int
    new_status: str  # ACCEPTED, ARRIVED_AT_SELLER, PICKED_UP, OUT_FOR_DELIVERY, ARRIVED_NEAR_CUSTOMER, DELIVERED
    lat: Optional[float] = None
    lng: Optional[float] = None

class UpdateLocationSchema(BaseModel):
    task_id: int
    lat: float
    lng: float

# Valid status progression sequence
VALID_STATUS_FLOW = {
    "READY_FOR_PICKUP": ["ASSIGNED", "ACCEPTED"],
    "ASSIGNED": ["ACCEPTED", "REJECTED"],
    "ACCEPTED": ["ARRIVED_AT_SELLER", "PICKED_UP"],
    "ARRIVED_AT_SELLER": ["PICKED_UP"],
    "PICKED_UP": ["OUT_FOR_DELIVERY"],
    "OUT_FOR_DELIVERY": ["ARRIVED_NEAR_CUSTOMER", "DELIVERED"],
    "ARRIVED_NEAR_CUSTOMER": ["DELIVERED", "DELIVERY_FAILED"],
}

@router.get("/portal", dependencies=[Depends(require_delivery)])
def get_delivery_portal_data(current_user: dict = Depends(get_current_user)):
    """Returns delivery dashboard active & assigned deliveries."""
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
        """INSERT INTO delivery_partners (user_id, name, phone, vehicle_type, license_no, location, pincode, approval_status, availability_status)
           VALUES (?, ?, ?, ?, ?, 'Bengaluru', ?, 'Approved', 'ONLINE')""",
        (current_user["id"], payload.name, current_user.get("phone", ""), payload.vehicle_type or "Bike", payload.license_no or "", payload.pincode)
    )

    execute_db("UPDATE users SET role = 'delivery_partner', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (current_user["id"],))
    partner = query_db("SELECT * FROM delivery_partners WHERE id = ?", (new_id,), one=True)
    return {"status": "success", "message": "Delivery partner registered successfully!", "partner": partner}

@router.post("/status", dependencies=[Depends(require_delivery)])
def update_availability(payload: UpdateAvailabilitySchema, current_user: dict = Depends(get_current_user)):
    partner = query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (current_user["id"],), one=True)
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found.")

    new_status = payload.availability_status.upper()
    if new_status not in ["ONLINE", "OFFLINE", "BUSY"]:
        raise HTTPException(status_code=400, detail="Invalid availability status. Must be ONLINE, OFFLINE, or BUSY.")

    execute_db("UPDATE delivery_partners SET availability_status = ? WHERE id = ?", (new_status, partner["id"]))
    return {"status": "success", "message": f"Availability updated to {new_status}", "availability": new_status}

@router.post("/update-status", dependencies=[Depends(require_delivery)])
def update_delivery_status(payload: UpdateDeliveryStatusSchema, current_user: dict = Depends(get_current_user)):
    partner = query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (current_user["id"],), one=True)
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found.")

    task = query_db("SELECT * FROM delivery_requests WHERE id = ?", (payload.task_id,), one=True)
    if not task:
        raise HTTPException(status_code=404, detail="Delivery task not found.")

    target_status = payload.new_status.upper()
    current_status = str(task.get("status", "AVAILABLE")).upper()

    # Validate state transition flow
    allowed = VALID_STATUS_FLOW.get(current_status, [])
    if allowed and target_status not in allowed and current_status != target_status:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status jump from '{current_status}' to '{target_status}'. Allowed: {allowed}"
        )

    execute_db("UPDATE delivery_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (target_status, payload.task_id))
    
    # Update main order status if DELIVERED or OUT_FOR_DELIVERY
    if target_status == "DELIVERED":
        execute_db("UPDATE orders SET status = 'DELIVERED', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (task.get("order_id"),))
    elif target_status == "OUT_FOR_DELIVERY":
        execute_db("UPDATE orders SET status = 'OUT_FOR_DELIVERY', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (task.get("order_id"),))

    return {
        "status": "success",
        "message": f"Delivery status updated to {target_status}",
        "task_id": payload.task_id,
        "new_status": target_status
    }

@router.post("/location", dependencies=[Depends(require_delivery)])
def update_live_location(payload: UpdateLocationSchema, current_user: dict = Depends(get_current_user)):
    partner = query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (current_user["id"],), one=True)
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found.")

    if partner.get("availability_status") != "ONLINE":
        raise HTTPException(status_code=400, detail="Cannot update location while OFFLINE.")

    execute_db("UPDATE delivery_partners SET current_lat = ?, current_lng = ? WHERE id = ?", (payload.lat, payload.lng, partner["id"]))
    return {"status": "success", "message": "Live location updated successfully."}
