# LocalKart Cart API Router
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/cart", tags=["Cart"])

class CartAddSchema(BaseModel):
    product_id: int
    quantity: int = 1

@router.get("", dependencies=[Depends(require_customer)])
def get_cart(current_user: dict = Depends(get_current_user)):
    return {"status": "success", "cart": []}

@router.post("", dependencies=[Depends(require_customer)])
def add_to_cart(payload: CartAddSchema, current_user: dict = Depends(get_current_user)):
    return {"status": "success", "message": "Product added to cart"}
