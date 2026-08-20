# LocalKart Return Requests Blueprint
import uuid
from flask import Blueprint, request, jsonify, session
from backend.database import query_db, execute_db
from backend.models.notification import Notification

returns_bp = Blueprint('returns', __name__)

@returns_bp.route('/api/returns', methods=['POST'])
def create_return_request():
    """
    POST /api/returns
    Customer submits return request with reason and optional evidence image.
    """
    data = request.get_json() or {}
    customer_id = session.get('user_id') or data.get('customer_id') or 5
    order_id = data.get('order_id')
    product_id = data.get('product_id')
    reason = data.get('reason')
    details = data.get('details', '')
    evidence_url = data.get('evidence_url', '')

    if not order_id or not product_id or not reason:
        return jsonify({'error': 'order_id, product_id, and reason are required'}), 400

    return_code = f"RET-{uuid.uuid4().hex[:8].upper()}"

    ret_id = execute_db("""
        INSERT INTO return_requests (return_code, customer_id, order_id, product_id, reason, details, evidence_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Requested')
    """, (return_code, customer_id, order_id, product_id, reason, details, evidence_url))

    # Notify Seller & Admin
    order = query_db("SELECT seller_id FROM orders WHERE id = ?", (order_id,), one=True)
    if order:
        seller = query_db("SELECT user_id FROM sellers WHERE id = ?", (order['seller_id'],), one=True)
        if seller:
            Notification.create(
                seller['user_id'],
                "Return Request Received",
                f"Return request {return_code} submitted for Order #LK-100{order_id}.",
                "seller"
            )

    return jsonify({
        'message': 'Return request submitted successfully!',
        'return_request': {
            'id': ret_id,
            'return_code': return_code,
            'status': 'Requested'
        }
    }), 201

@returns_bp.route('/api/returns', methods=['GET'])
def get_return_requests():
    """
    GET /api/returns
    List return requests based on user role (Customer, Seller, or Admin).
    """
    user_id = session.get('user_id') or 5
    user_role = session.get('user_role', 'customer')
    seller_id = session.get('seller_id')

    if user_role == 'admin':
        returns = query_db("""
            SELECT r.*, u.name AS customer_name, p.name AS product_name, s.business_name AS seller_name
            FROM return_requests r
            JOIN users u ON r.customer_id = u.id
            JOIN products p ON r.product_id = p.id
            JOIN orders o ON r.order_id = o.id
            JOIN sellers s ON o.seller_id = s.id
            ORDER BY r.id DESC
        """)
    elif user_role == 'seller' and seller_id:
        returns = query_db("""
            SELECT r.*, u.name AS customer_name, p.name AS product_name
            FROM return_requests r
            JOIN users u ON r.customer_id = u.id
            JOIN products p ON r.product_id = p.id
            JOIN orders o ON r.order_id = o.id
            WHERE o.seller_id = ?
            ORDER BY r.id DESC
        """, (seller_id,))
    else:
        returns = query_db("""
            SELECT r.*, p.name AS product_name, p.image AS product_image
            FROM return_requests r
            JOIN products p ON r.product_id = p.id
            WHERE r.customer_id = ?
            ORDER BY r.id DESC
        """, (user_id,))

    return jsonify(returns), 200

@returns_bp.route('/api/returns/<int:return_id>/status', methods=['PUT'])
def update_return_status(return_id):
    """
    PUT /api/returns/<id>/status
    Seller / Admin approves or rejects return request.
    """
    data = request.get_json() or {}
    new_status = data.get('status') # 'Approved', 'Rejected', 'Refunded'

    valid_statuses = ['Approved', 'Rejected', 'Refunded']
    if not new_status or new_status not in valid_statuses:
        return jsonify({'error': f'Status must be one of {valid_statuses}'}), 400

    execute_db("UPDATE return_requests SET status = ? WHERE id = ?", (new_status, return_id))
    ret_req = query_db("SELECT * FROM return_requests WHERE id = ?", (return_id,), one=True)

    if ret_req:
        Notification.create(
            ret_req['customer_id'],
            "Return Request Updated",
            f"Your return request {ret_req['return_code']} status changed to {new_status}.",
            "order"
        )

    return jsonify({
        'message': f"Return request status updated to {new_status}",
        'return_request': ret_req
    }), 200
