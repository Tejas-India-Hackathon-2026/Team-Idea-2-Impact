# LocalKart Wishlist API Router
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

class WishlistSchema(BaseModel):
    product_id: int

@router.get("", dependencies=[Depends(require_customer)])
def get_wishlist(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    items = query_db(
        """SELECT w.*, p.name, p.price, p.image, p.category 
           FROM wishlists w 
           JOIN products p ON w.product_id = p.id 
           WHERE w.user_id = ?""",
        (user_id,)
    )
    return {"status": "success", "count": len(items), "wishlist": items}

@router.post("", dependencies=[Depends(require_customer)])
def toggle_wishlist(payload: WishlistSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    existing = query_db("SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?", (user_id, payload.product_id), one=True)

    if existing:
        execute_db("DELETE FROM wishlists WHERE id = ?", (existing["id"],))
        return {"status": "success", "action": "removed", "message": "Removed from wishlist"}
    else:
        execute_db("INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)", (user_id, payload.product_id))
        return {"status": "success", "action": "added", "message": "Added to wishlist"}
