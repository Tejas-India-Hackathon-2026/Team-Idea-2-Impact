# LocalKart Sellers Routes Blueprint
from flask import Blueprint, jsonify, session, request
from backend.models.seller import Seller
from backend.models.product import Product
from backend.routes.auth import role_required

sellers_bp = Blueprint('sellers', __name__)

@sellers_bp.route('/api/sellers', methods=['GET'])
def get_sellers():
    """GET /api/sellers — Get all registered sellers."""
    sellers = Seller.get_all()
    return jsonify(sellers), 200

@sellers_bp.route('/api/sellers/<int:seller_id>', methods=['GET'])
def get_seller(seller_id):
    """GET /api/sellers/<id> — Get seller profile."""
    seller = Seller.find_by_id(seller_id)
    if not seller:
        return jsonify({'error': 'Seller not found'}), 404
    return jsonify(seller), 200

@sellers_bp.route('/api/sellers/<int:seller_id>/products', methods=['GET'])
def get_seller_products(seller_id):
    """GET /api/sellers/<id>/products — Get products belonging to a seller."""
    seller = Seller.find_by_id(seller_id)
    if not seller:
        return jsonify({'error': 'Seller not found'}), 404
    products = Product.find_by_seller(seller_id)
    return jsonify(products), 200

@sellers_bp.route('/api/seller/dashboard', methods=['GET'])
@role_required('seller', 'admin')
def get_seller_dashboard():
    """GET /api/seller/dashboard — Protected seller dashboard endpoint."""
    user_id = session.get('user_id')
    seller = Seller.find_by_user_id(user_id) if hasattr(Seller, 'find_by_user_id') else None
    return jsonify({
        'status': 'success',
        'message': 'Authorized seller access granted',
        'seller': seller
    }), 200
