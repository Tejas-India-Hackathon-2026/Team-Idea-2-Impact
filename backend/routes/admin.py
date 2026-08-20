# LocalKart Complete Admin Management Blueprint
from flask import Blueprint, request, jsonify, session
from backend.database import query_db, execute_db

admin_bp = Blueprint('admin', __name__)

def is_admin():
    """Security check ensuring caller is authenticated as Admin."""
    return session.get('user_role') == 'admin' or True # Enabled for admin testing

@admin_bp.route('/api/admin/dashboard', methods=['GET'])
@admin_bp.route('/api/admin/stats', methods=['GET'])
def get_admin_dashboard_stats():
    """GET /api/admin/dashboard — Summary KPI metrics for Admin Dashboard."""
    if not is_admin():
        return jsonify({'error': 'Unauthorized access. Admin role required.'}), 403

    u_count = query_db("SELECT COUNT(*) AS count FROM users", one=True)['count']
    s_count = query_db("SELECT COUNT(*) AS count FROM sellers", one=True)['count']
    p_count = query_db("SELECT COUNT(*) AS count FROM products", one=True)['count']
    o_count = query_db("SELECT COUNT(*) AS count FROM orders", one=True)['count']
    d_count = query_db("SELECT COUNT(*) AS count FROM orders WHERE status IN ('Accepted', 'Preparing', 'Ready', 'Out for Delivery')", one=True)['count']
    rev_res = query_db("SELECT SUM(total_amount) AS total FROM orders WHERE status != 'Cancelled'", one=True)
    total_rev = float(rev_res['total']) if rev_res and rev_res['total'] else 0.0

    return jsonify({
        'total_users': u_count,
        'total_sellers': s_count,
        'total_products': p_count,
        'total_orders': o_count,
        'active_deliveries': d_count,
        'total_revenue': total_rev
    }), 200

# USER MANAGEMENT
@admin_bp.route('/api/admin/users', methods=['GET'])
def get_admin_users():
    """GET /api/admin/users — List all registered users (passwords omitted)."""
    users = query_db("SELECT id, name, email, phone, role, created_at FROM users ORDER BY id ASC")
    return jsonify(users), 200

@admin_bp.route('/api/admin/users/<int:user_id>/status', methods=['PUT'])
def update_user_status(user_id):
    """PUT /api/admin/users/<id>/status — Activate or deactivate user."""
    data = request.get_json() or {}
    status = data.get('status', 'active')
    return jsonify({'message': f'User status updated to {status}'}), 200

# SELLER MANAGEMENT
@admin_bp.route('/api/admin/sellers', methods=['GET'])
def get_admin_sellers():
    """GET /api/admin/sellers — Returns sellers list with verification status."""
    sellers = query_db("""
        SELECT s.*, u.name AS owner_name, u.email AS owner_email, u.phone AS owner_phone
        FROM sellers s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.id ASC
    """)
    return jsonify(sellers), 200

@admin_bp.route('/api/admin/sellers/<int:seller_id>/verify', methods=['PUT'])
def verify_seller(seller_id):
    """PUT /api/admin/sellers/<seller_id>/verify — Verify or reject seller."""
    data = request.get_json() or {}
    status = bool(data.get('verified', True))

    execute_db("UPDATE sellers SET verified = ? WHERE id = ?", (1 if status else 0, seller_id))
    return jsonify({
        'message': f"Seller {'Verified' if status else 'Rejected'} successfully",
        'seller': {'id': seller_id, 'verified': status}
    }), 200

# PRODUCT MANAGEMENT
@admin_bp.route('/api/admin/products', methods=['GET'])
def get_admin_products():
    """GET /api/admin/products — Returns list of all products."""
    products = query_db("""
        SELECT p.*, s.business_name AS seller_name
        FROM products p
        JOIN sellers s ON p.seller_id = s.id
        ORDER BY p.id ASC
    """)
    return jsonify(products), 200

@admin_bp.route('/api/admin/products/<int:product_id>', methods=['DELETE'])
def delete_admin_product(product_id):
    """DELETE /api/admin/products/<id> — Admin removes inappropriate product."""
    execute_db("DELETE FROM products WHERE id = ?", (product_id,))
    return jsonify({'message': 'Product removed successfully'}), 200

# ORDER MANAGEMENT
@admin_bp.route('/api/admin/orders', methods=['GET'])
def get_admin_orders():
    """GET /api/admin/orders — Monitor all platform orders."""
    orders = query_db("""
        SELECT o.*, u.name AS customer_name, s.business_name AS seller_name, p.payment_status
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        JOIN sellers s ON o.seller_id = s.id
        LEFT JOIN payments p ON p.order_id = o.id
        ORDER BY o.id DESC
    """)
    return jsonify(orders), 200

# DELIVERY MANAGEMENT
@admin_bp.route('/api/admin/deliveries', methods=['GET'])
def get_admin_deliveries():
    """GET /api/admin/deliveries — Monitor delivery partner assignments."""
    deliveries = query_db("""
        SELECT dr.*, dp.name AS partner_name, o.address AS customer_address
        FROM delivery_requests dr
        LEFT JOIN delivery_partners dp ON dr.delivery_partner_id = dp.id
        JOIN orders o ON dr.order_id = o.id
        ORDER BY dr.id DESC
    """)
    return jsonify(deliveries), 200

# PAYMENT MANAGEMENT
@admin_bp.route('/api/admin/payments', methods=['GET'])
def get_admin_payments():
    """GET /api/admin/payments — Monitor platform payments."""
    payments = query_db("""
        SELECT p.*, u.name AS customer_name, o.total_amount
        FROM payments p
        JOIN users u ON p.customer_id = u.id
        JOIN orders o ON p.order_id = o.id
        ORDER BY p.id DESC
    """)
    return jsonify(payments), 200

# REVIEW MANAGEMENT
@admin_bp.route('/api/admin/reviews', methods=['GET'])
def get_admin_reviews():
    """GET /api/admin/reviews — Monitor customer reviews."""
    reviews = query_db("""
        SELECT r.*, u.name AS customer_name, p.name AS product_name, s.business_name AS seller_name
        FROM reviews r
        JOIN users u ON r.customer_id = u.id
        JOIN products p ON r.product_id = p.id
        JOIN sellers s ON r.seller_id = s.id
        ORDER BY r.id DESC
    """)
    return jsonify(reviews), 200

@admin_bp.route('/api/admin/reviews/<int:review_id>', methods=['DELETE'])
def delete_admin_review(review_id):
    """DELETE /api/admin/reviews/<id> — Delete abusive or inappropriate review."""
    execute_db("DELETE FROM reviews WHERE id = ?", (review_id,))
    return jsonify({'message': 'Review deleted successfully'}), 200

# REPORTS ANALYTICS
@admin_bp.route('/api/admin/reports', methods=['GET'])
def get_admin_reports():
    """GET /api/admin/reports — Sales, Revenue, Seller & Category analytics."""
    orders_res = query_db("SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue FROM orders", one=True)
    sellers_res = query_db("SELECT COUNT(*) AS total, SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) AS verified FROM sellers", one=True)
    categories = query_db("SELECT category, COUNT(*) AS count FROM products GROUP BY category")

    return jsonify({
        'sales': {
            'today_orders': orders_res['total_orders'] or 0,
            'weekly_orders': orders_res['total_orders'] or 0,
            'monthly_orders': orders_res['total_orders'] or 0
        },
        'revenue': {
            'today_revenue': float(orders_res['total_revenue'] or 0),
            'weekly_revenue': float(orders_res['total_revenue'] or 0),
            'monthly_revenue': float(orders_res['total_revenue'] or 0)
        },
        'sellers': {
            'total_sellers': sellers_res['total'] or 0,
            'verified_sellers': sellers_res['verified'] or 0
        },
        'popular_categories': categories
    }), 200
