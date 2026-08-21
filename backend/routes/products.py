# LocalKart Products API Router
from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import Optional, List

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_seller, require_customer

router = APIRouter(prefix="/api/products", tags=["Products"])

class ProductCreateSchema(BaseModel):
    name: str
    price: float
    original_price: Optional[float] = None
    category: str
    quantity: Optional[int] = 10
    description: Optional[str] = ""
    image: Optional[str] = ""
    is_handmade: Optional[bool] = True
    prep_time: Optional[str] = "Ready to Ship"
    material: Optional[str] = ""

@router.get("")
def list_products(
    q: Optional[str] = "",
    category: Optional[str] = "all",
    pincode: Optional[str] = None
):
    query_str = f"%{(q or '').strip().lower()}%"
    
    if category and category != "all":
        products = query_db(
            """SELECT p.*, s.business_name as seller_name, s.rating as seller_rating 
               FROM products p
               LEFT JOIN sellers s ON p.seller_id = s.id
               WHERE (LOWER(p.name) LIKE ? OR LOWER(p.category) LIKE ?) AND LOWER(p.category) = ?""",
            (query_str, query_str, category.lower())
        )
    else:
        products = query_db(
            """SELECT p.*, s.business_name as seller_name, s.rating as seller_rating 
               FROM products p
               LEFT JOIN sellers s ON p.seller_id = s.id
               WHERE LOWER(p.name) LIKE ? OR LOWER(p.category) LIKE ?""",
            (query_str, query_str)
        )

    return {"status": "success", "count": len(products), "products": products}

@router.get("/{product_id}")
def get_product_details(product_id: int):
    product = query_db(
        """SELECT p.*, s.business_name as seller_name, s.rating as seller_rating, s.location as seller_location
           FROM products p
           LEFT JOIN sellers s ON p.seller_id = s.id
           WHERE p.id = ?""",
        (product_id,),
        one=True
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"status": "success", "product": product}

@router.post("", dependencies=[Depends(require_seller)])
def create_product(payload: ProductCreateSchema, current_user: dict = Depends(get_current_user)):
    seller = query_db("SELECT * FROM sellers WHERE user_id = ?", (current_user["id"],), one=True)
    if not seller:
        raise HTTPException(status_code=400, detail="Seller account not registered.")

    new_id = execute_db(
        """INSERT INTO products (seller_id, name, price, original_price, category, quantity, description, image, is_handmade, prep_time, material)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (seller["id"], payload.name, payload.price, payload.original_price or (payload.price + 50), payload.category, payload.quantity or 10, payload.description or "", payload.image or "", 1 if payload.is_handmade else 0, payload.prep_time or "Ready to Ship", payload.material or "")
    )

    created = query_db("SELECT * FROM products WHERE id = ?", (new_id,), one=True)
    return {"status": "success", "message": "Product created successfully", "product": created}
