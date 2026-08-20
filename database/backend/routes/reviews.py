# LocalKart Enhanced Reviews & Media Upload Blueprint
import os
import uuid
from flask import Blueprint, request, jsonify, session, send_from_directory
from werkzeug.utils import secure_filename
from backend.models.review import Review
from backend.models.product import Product

reviews_bp = Blueprint('reviews', __name__)

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'webm', 'mov'}

UPLOAD_IMAGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'frontend', 'uploads', 'reviews', 'images')
UPLOAD_VIDEO_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'frontend', 'uploads', 'reviews', 'videos')

def allowed_file(filename, allowed_set):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_set

@reviews_bp.route('/api/reviews', methods=['POST'])
def submit_review():
    """
    POST /api/reviews
    Customer submits rating and review with verified purchase check.
    """
    customer_id = session.get('user_id') or 5
    product_id = request.form.get('product_id') or (request.json.get('product_id') if request.is_json else None)
    rating = request.form.get('rating') or (request.json.get('rating') if request.is_json else None)
    comment = request.form.get('comment') or (request.json.get('comment') if request.is_json else '')

    if not product_id or not rating:
        return jsonify({'error': 'product_id and rating (1-5) are required'}), 400

    product_id = int(product_id)
    rating = int(rating)

    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    seller_id = product['seller_id']

    # Eligibility Check (Verified Purchase & Delivered Status)
    order_id = Review.check_eligibility(customer_id, product_id)
    verified_purchase = bool(order_id)

    # Create review
    review = Review.create(customer_id, product_id, seller_id, order_id, rating, comment, verified_purchase)
    review_id = review['id']

    # Process Photo Uploads (Max 5 photos)
    photos = request.files.getlist('photos')
    for photo in photos[:5]:
        if photo and photo.filename and allowed_file(photo.filename, ALLOWED_IMAGE_EXTENSIONS):
            ext = photo.filename.rsplit('.', 1)[1].lower()
            safe_name = f"img_{review_id}_{uuid.uuid4().hex[:8]}.{ext}"
            save_path = os.path.join(UPLOAD_IMAGE_FOLDER, safe_name)
            photo.save(save_path)
            media_url = f"/uploads/reviews/images/{safe_name}"
            Review.add_media(review_id, 'image', media_url, safe_name)

    # Process Video Upload (Max 1 video)
    video = request.files.get('video')
    if video and video.filename and allowed_file(video.filename, ALLOWED_VIDEO_EXTENSIONS):
        ext = video.filename.rsplit('.', 1)[1].lower()
        safe_name = f"vid_{review_id}_{uuid.uuid4().hex[:8]}.{ext}"
        save_path = os.path.join(UPLOAD_VIDEO_FOLDER, safe_name)
        video.save(save_path)
        media_url = f"/uploads/reviews/videos/{safe_name}"
        Review.add_media(review_id, 'video', media_url, safe_name)

    full_review = Review.find_by_id(review_id)
    return jsonify({
        'message': 'Review submitted successfully!',
        'review': full_review
    }), 201

@reviews_bp.route('/api/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    """GET /api/products/<id>/reviews — Fetch product reviews with rating and media filters."""
    rating_filter = request.args.get('rating')
    media_filter = request.args.get('media') # 'photos', 'videos'

    reviews = Review.get_by_product(product_id, rating_filter, media_filter)
    
    # Calculate stats
    total_count = len(reviews)
    avg_rating = round(sum(r['rating'] for r in reviews) / total_count, 1) if total_count > 0 else 5.0

    return jsonify({
        'average_rating': avg_rating,
        'total_reviews': total_count,
        'reviews': reviews
    }), 200

@reviews_bp.route('/api/sellers/<int:seller_id>/reviews', methods=['GET'])
def get_seller_reviews(seller_id):
    """GET /api/sellers/<id>/reviews — Fetch reviews for seller profile."""
    reviews = Review.get_by_seller(seller_id)
    total_count = len(reviews)
    avg_rating = round(sum(r['rating'] for r in reviews) / total_count, 1) if total_count > 0 else 4.8

    return jsonify({
        'seller_rating': avg_rating,
        'total_reviews': total_count,
        'reviews': reviews
    }), 200

@reviews_bp.route('/api/reviews/<int:review_id>/helpful', methods=['POST'])
def mark_review_helpful(review_id):
    """POST /api/reviews/<id>/helpful — Vote review as helpful."""
    Review.mark_helpful(review_id)
    return jsonify({'message': 'Marked review as helpful'}), 200

@reviews_bp.route('/api/reviews/<int:review_id>/report', methods=['POST'])
def report_review(review_id):
    """POST /api/reviews/<id>/report — Report inappropriate review."""
    customer_id = session.get('user_id') or 5
    data = request.get_json() or {}
    reason = data.get('reason', 'Inappropriate or spam content')

    Review.report(review_id, customer_id, reason)
    return jsonify({'message': 'Review reported to admin moderation team'}), 200
