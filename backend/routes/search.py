# LocalKart Role-Tailored Search Engine Blueprint
from flask import Blueprint, request, jsonify, session
from backend.database import query_db

search_bp = Blueprint('search', __name__)

# 1. CUSTOMER SEARCH ENDPOINT
@search_bp.route('/api/search/customer', methods=['GET'])
def search_customer():
    query = request.args.get('q', '').strip()
    category = request.args.get('category', 'all').strip()
    user_pincode = request.args.get('pincode', '560034').strip()

    if not query and category == 'all':
        # Return popular items
        items = query_db("SELECT p.*, s.business_name, s.rating AS seller_rating, s.verified AS seller_verified FROM products p JOIN sellers s ON p.seller_id = s.id LIMIT 10")
        return jsonify({'products': items, 'suggestions': ['handmade candle', 'bamboo basket', 'mango pickle', 'organic honey']}), 200

    sql = """
        SELECT p.*, s.business_name, s.location AS seller_location, s.rating AS seller_rating, s.verified AS seller_verified, s.pincode AS seller_pincode
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        WHERE (p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR s.business_name LIKE ?)
    """
    params = [f"%{query}%", f"%{query}%", f"%{query}%", f"%{query}%"]
    
    if category != 'all':
        sql += " AND p.category = ?"
        params.append(category)

    sql += " ORDER BY CASE WHEN s.pincode = ? THEN 0 ELSE 1 END, p.id DESC"
    params.append(user_pincode)

    products = query_db(sql, params)
    
    # Also fetch matching shops/sellers
    sellers = query_db("SELECT * FROM sellers WHERE business_name LIKE ? OR description LIKE ? OR location LIKE ?", [f"%{query}%", f"%{query}%", f"%{query}%"])

    return jsonify({
        'query': query,
        'products': products,
        'sellers': sellers,
        'total': len(products)
    }), 200

# 2. SELLER SEARCH ENDPOINT
@search_bp.route('/api/search/seller', methods=['GET'])
def search_seller():
    user_role = session.get('user_role')
    seller_id = session.get('seller_id') or 1
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify({'products': [], 'orders': [], 'inventory': []}), 200

    # Search seller's own products
    products = query_db("SELECT * FROM products WHERE seller_id = ? AND (name LIKE ? OR description LIKE ?)", (seller_id, f"%{query}%", f"%{query}%"))
    
    # Search seller's own orders (e.g. LK1024 or customer name)
    orders = query_db("""
        SELECT o.*, u.name AS customer_name, u.phone AS customer_phone
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        WHERE o.seller_id = ? AND (CAST(o.id AS TEXT) LIKE ? OR u.name LIKE ? OR o.address LIKE ?)
    """, (seller_id, f"%{query}%", f"%{query}%", f"%{query}%"))

    # Search low stock inventory
    inventory = query_db("SELECT * FROM products WHERE seller_id = ? AND quantity <= 5", (seller_id,)) if query.lower() == 'low stock' else []

    return jsonify({
        'query': query,
        'products': products,
        'orders': orders,
        'inventory': inventory
    }), 200

# 3. DELIVERY PARTNER SEARCH ENDPOINT
@search_bp.route('/api/search/delivery', methods=['GET'])
def search_delivery():
    partner_id = session.get('delivery_partner_id') or 1
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify({'deliveries': []}), 200

    deliveries = query_db("""
        SELECT dr.*, o.address AS customer_address, o.status AS order_status
        FROM delivery_requests dr
        JOIN orders o ON dr.order_id = o.id
        WHERE (dr.delivery_partner_id = ? OR dr.status = 'Available')
        AND (CAST(dr.id AS TEXT) LIKE ? OR CAST(dr.order_id AS TEXT) LIKE ? OR dr.pickup_location LIKE ? OR dr.customer_location LIKE ?)
    """, (partner_id, f"%{query}%", f"%{query}%", f"%{query}%", f"%{query}%"))

    return jsonify({
        'query': query,
        'deliveries': deliveries
    }), 200
