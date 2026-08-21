# LocalKart Production Centralized Notification Router
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from backend.database import query_db, execute_db

router = APIRouter(prefix="/api/notifications", tags=["Centralized Notifications"])

class CreateNotificationSchema(BaseModel):
    user_id: int
    title: str
    message: str
    type: str  # ORDER | PAYMENT | DELIVERY | REVIEW | RETURN | REFUND | CHAT | SELLER | PRODUCT | ADMIN | SYSTEM
    link: Optional[str] = None

@router.get("")
def list_user_notifications(user_id: int = 1, type: Optional[str] = None):
    """Lists notifications for authenticated user, with optional category filter."""
    if type:
        notifications = query_db(
            "SELECT * FROM notifications WHERE user_id = ? AND type = ? ORDER BY created_at DESC",
            (user_id, type)
        )
    else:
        notifications = query_db(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        )

    unread_count = len([n for n in notifications if n.get('read', 0) == 0])

    return {
        "status": "success",
        "unread_count": unread_count,
        "count": len(notifications),
        "notifications": notifications
    }

@router.post("")
def create_notification(payload: CreateNotificationSchema):
    """Creates a new structured notification."""
    notif_id = execute_db(
        """INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, ?, ?, ?)""",
        (payload.user_id, payload.title, payload.message, payload.type)
    )
    return {"status": "success", "id": notif_id}

@router.post("/mark-read/{notification_id}")
def mark_notification_as_read(notification_id: int):
    """Marks a single notification as read."""
    execute_db("UPDATE notifications SET read = 1 WHERE id = ?", (notification_id,))
    return {"status": "success", "message": "Notification marked as read."}

@router.post("/mark-all-read")
def mark_all_notifications_as_read(user_id: int = 1):
    """Marks all user notifications as read."""
    execute_db("UPDATE notifications SET read = 1 WHERE user_id = ?", (user_id,))
    return {"status": "success", "message": "All notifications marked as read."}
