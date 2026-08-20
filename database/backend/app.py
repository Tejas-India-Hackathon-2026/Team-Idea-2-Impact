# LocalKart Flask REST API Application Entry Point
import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS

from backend.config import Config
from backend.database import init_db
from backend.routes.auth import auth_bp
from backend.routes.products import products_bp
from backend.routes.sellers import sellers_bp
from backend.routes.delivery import delivery_bp
from backend.routes.orders import orders_bp
from backend.routes.reviews import reviews_bp
from backend.routes.admin import admin_bp
from backend.routes.payments import payments_bp
from backend.routes.notifications import notifications_bp

app = Flask(__name__, static_folder='../frontend', static_url_path='')
app.config.from_object(Config)

# Enable CORS for frontend React dev server (http://localhost:5173)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]}}, supports_credentials=True)

# Register API Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)
app.register_blueprint(sellers_bp)
app.register_blueprint(delivery_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(reviews_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(payments_bp)
app.register_blueprint(notifications_bp)

# Health Check API
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "LocalKart API is running"
    }), 200

# Categories API
@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify([
        "Handmade",
        "Farm Products",
        "Clothing",
        "Food",
        "Home Products",
        "Local Manufacturing"
    ]), 200

# Serve Uploaded Review Media Files
@app.route('/uploads/reviews/images/<path:filename>')
def serve_review_images(filename):
    img_dir = os.path.join(app.static_folder, 'uploads', 'reviews', 'images')
    return send_from_directory(img_dir, filename)

@app.route('/uploads/reviews/videos/<path:filename>')
def serve_review_videos(filename):
    vid_dir = os.path.join(app.static_folder, 'uploads', 'reviews', 'videos')
    return send_from_directory(vid_dir, filename)

# Frontend Static Page Routes
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_pages(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Something went wrong on the server. Please try again later.'}), 500

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    print("[LocalKart] Starting Flask Backend Server at http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
