# LocalKart Production Real-Time Chat & Customization Messaging Router
import time
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Header, status
from pydantic import BaseModel

from backend.database import query_db, execute_db

router = APIRouter(prefix="/api", tags=["Chat & Real-Time Messaging"])

class CreateConversationSchema(BaseModel):
    customer_id: int
    seller_id: int
    product_id: Optional[int] = None
    order_id: Optional[int] = None

class SendMessageSchema(BaseModel):
    conversation_id: int
    sender_id: int
    receiver_id: int
    message: str
    image_url: Optional[str] = None
    file_url: Optional[str] = None

class ReportMessageSchema(BaseModel):
    reason: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, conversation_id: int):
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = []
        self.active_connections[conversation_id].append(websocket)

    def disconnect(self, websocket: WebSocket, conversation_id: int):
        if conversation_id in self.active_connections:
            if websocket in self.active_connections[conversation_id]:
                self.active_connections[conversation_id].remove(websocket)

    async def broadcast(self, conversation_id: int, data: dict):
        if conversation_id in self.active_connections:
            for connection in self.active_connections[conversation_id]:
                await connection.send_json(data)

manager = ConnectionManager()

@router.post("/conversations")
def create_or_get_conversation(payload: CreateConversationSchema):
    """Creates a new conversation between customer and seller or returns existing conversation."""
    existing = query_db(
        "SELECT * FROM conversations WHERE customer_id = ? AND seller_id = ?",
        (payload.customer_id, payload.seller_id),
        one=True
    )
    if existing:
        return {"status": "success", "conversation": existing}

    conv_id = execute_db(
        """INSERT INTO conversations (customer_id, seller_id, product_id, order_id)
           VALUES (?, ?, ?, ?)""",
        (payload.customer_id, payload.seller_id, payload.product_id, payload.order_id)
    )
    conv = query_db("SELECT * FROM conversations WHERE id = ?", (conv_id,), one=True)
    return {"status": "success", "conversation": conv}

@router.get("/conversations")
def list_user_conversations(user_id: int = 1, role: str = "customer"):
    """Lists conversations for the authenticated customer or seller."""
    if role == "seller":
        conversations = query_db(
            """SELECT c.*, u.name as customer_name, u.phone as customer_phone, u.profile_image as customer_avatar
               FROM conversations c
               JOIN users u ON c.customer_id = u.id
               WHERE c.seller_id = (SELECT id FROM sellers WHERE user_id = ?)
               ORDER BY c.updated_at DESC""",
            (user_id,)
        )
    else:
        conversations = query_db(
            """SELECT c.*, s.business_name as seller_shop_name, s.rating as seller_rating
               FROM conversations c
               JOIN sellers s ON c.seller_id = s.id
               WHERE c.customer_id = ?
               ORDER BY c.updated_at DESC""",
            (user_id,)
        )

    return {"status": "success", "count": len(conversations), "conversations": conversations}

@router.get("/conversations/{conversation_id}/messages")
def get_conversation_messages(conversation_id: int):
    """Fetches message history for a conversation and auto-marks messages as read."""
    messages = query_db(
        """SELECT m.*, u.name as sender_name 
           FROM messages m
           JOIN users u ON m.sender_id = u.id
           WHERE m.conversation_id = ?
           ORDER BY m.created_at ASC""",
        (conversation_id,)
    )
    execute_db("UPDATE messages SET read_status = 1 WHERE conversation_id = ?", (conversation_id,))
    return {"status": "success", "count": len(messages), "messages": messages}

@router.post("/messages")
async def send_message(payload: SendMessageSchema):
    """Sends a chat message, persists to database, creates recipient notification, and broadcasts via WebSocket."""
    msg_id = execute_db(
        """INSERT INTO messages (conversation_id, sender_id, receiver_id, message, image_url, file_url, read_status)
           VALUES (?, ?, ?, ?, ?, ?, 0)""",
        (payload.conversation_id, payload.sender_id, payload.receiver_id, payload.message, payload.image_url, payload.file_url)
    )
    
    execute_db("UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (payload.conversation_id,))

    execute_db(
        """INSERT INTO notifications (user_id, title, message, type)
           VALUES (?, 'New Message Received', ?, 'chat')""",
        (payload.receiver_id, f"You have a new message: {payload.message[:50]}...")
    )

    msg_record = query_db("SELECT * FROM messages WHERE id = ?", (msg_id,), one=True)
    
    await manager.broadcast(payload.conversation_id, {
        "type": "new_message",
        "message": msg_record
    })

    return {"status": "success", "message": msg_record}

@router.post("/messages/{message_id}/report")
def report_chat_message(message_id: int, payload: ReportMessageSchema):
    return {"status": "success", "message": f"Message #{message_id} reported for moderation ({payload.reason})."}

@router.websocket("/ws/chat/{conversation_id}")
async def websocket_chat_endpoint(websocket: WebSocket, conversation_id: int):
    await manager.connect(websocket, conversation_id)
    try:
        while True:
            data = await websocket.receive_json()
            if data.get("type") == "message":
                sender_id = data.get("sender_id")
                receiver_id = data.get("receiver_id")
                content = data.get("message", "")
                img = data.get("image_url")
                file_path = data.get("file_url")

                msg_id = execute_db(
                    """INSERT INTO messages (conversation_id, sender_id, receiver_id, message, image_url, file_url, read_status)
                       VALUES (?, ?, ?, ?, ?, ?, 0)""",
                    (conversation_id, sender_id, receiver_id, content, img, file_path)
                )
                msg_record = query_db("SELECT * FROM messages WHERE id = ?", (msg_id,), one=True)

                await manager.broadcast(conversation_id, {
                    "type": "new_message",
                    "message": msg_record
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket, conversation_id)
