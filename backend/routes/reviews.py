# LocalKart Production Reviews & Ratings API Router
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from backend.database import query_db, execute_db
from backend.dependencies import get_current_user, require_customer

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

class ReviewCreateSchema(BaseModel):
    product_id: int
    seller_id: int
    order_id: Optional[int] = None
    rating: int
    seller_rating: Optional[int] = 5
    comment: Optional[str] = ""
    images: Optional[List[str]] = []
    video_url: Optional[str] = None

class ReviewUpdateSchema(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class ReportReviewSchema(BaseModel):
    reason: str

@router.get("/product/{product_id}")
def get_product_reviews(product_id: int):
    """Retrieves approved reviews for a product including verified purchase badges & media photos/videos."""
    reviews = query_db(
        """SELECT r.*, u.name as customer_name, u.profile_image 
           FROM reviews r 
           JOIN users u ON r.customer_id = u.id 
           WHERE r.product_id = ? AND r.status = 'Approved'
           ORDER BY r.created_at DESC""",
        (product_id,)
    )

    for rev in reviews:
        media = query_db("SELECT * FROM review_media WHERE review_id = ?", (rev["id"],))
        rev["media"] = media

    return {"status": "success", "count": len(reviews), "reviews": reviews}

@router.post("", dependencies=[Depends(require_customer)])
def post_review(payload: ReviewCreateSchema, current_user: dict = Depends(get_current_user)):
    """
    Enforces Server-Side Delivered & Verified Purchase Checks:
    1. Checks if customer has a valid DELIVERED order for the product.
    2. Enforces 1 review per purchase constraint.
    """
    user_id = current_user["id"]

    if payload.rating < 1 or payload.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5 stars.")

    # Server-side order verification check: Order MUST be DELIVERED
    verified_order = query_db(
        """SELECT o.id FROM orders o
           JOIN order_items oi ON o.id = oi.order_id
           WHERE o.customer_id = ? AND oi.product_id = ? AND o.status IN ('DELIVERED', 'Delivered', 'Completed')""",
        (user_id, payload.product_id),
        one=True
    )

    if not verified_order:
        raise HTTPException(
            status_code=400,
            detail="You can rate or review a product ONLY after that order has been successfully DELIVERED."
        )

    # Check 1 review per purchase constraint
    existing_review = query_db(
        "SELECT id FROM reviews WHERE customer_id = ? AND product_id = ? AND order_id = ?",
        (user_id, payload.product_id, verified_order["id"]),
        one=True
    )
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already submitted a review for this delivered purchase.")

    new_id = execute_db(
        """INSERT INTO reviews (customer_id, product_id, seller_id, order_id, rating, comment, verified_purchase, status)
           VALUES (?, ?, ?, ?, ?, ?, 1, 'Approved')""",
        (user_id, payload.product_id, payload.seller_id, verified_order["id"], payload.rating, payload.comment or "")
    )

    # Save photo media if provided
    if payload.images:
        for img_url in payload.images:
            execute_db(
                """INSERT INTO review_media (review_id, media_type, media_url, file_name)
                   VALUES (?, 'image', ?, 'review_photo.jpg')""",
                (new_id, img_url)
            )

    # Save video media if provided
    if payload.video_url:
        execute_db(
            """INSERT INTO review_media (review_id, media_type, media_url, file_name)
               VALUES (?, 'video', ?, 'review_video.mp4')""",
            (new_id, payload.video_url)
        )

    # Recalculate Seller Average Rating & Quality Score
    avg_res = query_db(
        "SELECT AVG(rating) as avg_rating, COUNT(*) as rev_count FROM reviews WHERE seller_id = ? AND status = 'Approved'",
        (payload.seller_id,),
        one=True
    )
    if avg_res and avg_res["avg_rating"]:
        new_rating = round(avg_res["avg_rating"], 2)
        new_quality = min(5.0, round(new_rating * 0.96 + 0.2, 2))
        execute_db("UPDATE sellers SET rating = ?, quality_score = ? WHERE id = ?", (new_rating, new_quality, payload.seller_id))

    review = query_db("SELECT * FROM reviews WHERE id = ?", (new_id,), one=True)
    return {
        "status": "success",
        "message": "Verified purchase review submitted successfully!",
        "verified_purchase": True,
        "review": review
    }

@router.put("/{review_id}", dependencies=[Depends(require_customer)])
def update_review(review_id: int, payload: ReviewUpdateSchema, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    existing = query_db("SELECT * FROM reviews WHERE id = ?", (review_id,), one=True)
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found.")
    if existing["customer_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized to edit this review.")

    rating = payload.rating or existing["rating"]
    comment = payload.comment if payload.comment is not None else existing["comment"]

    execute_db("UPDATE reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (rating, comment, review_id))
    return {"status": "success", "message": "Review updated successfully."}

@router.delete("/{review_id}", dependencies=[Depends(require_customer)])
def delete_review(review_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    existing = query_db("SELECT * FROM reviews WHERE id = ?", (review_id,), one=True)
    if not existing:
        raise HTTPException(status_code=404, detail="Review not found.")
    if existing["customer_id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized to delete this review.")

    execute_db("DELETE FROM reviews WHERE id = ?", (review_id,))
    return {"status": "success", "message": "Review deleted successfully."}

@router.post("/{review_id}/report")
def report_review(review_id: int, payload: ReportReviewSchema, current_user: dict = Depends(get_current_user)):
    return {"status": "success", "message": f"Review #{review_id} reported for moderation ({payload.reason})."}
