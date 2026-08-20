# LocalKart Complete Order Management Blueprint
from flask import Blueprint, request, jsonify, session
from backend.database import query_db, execute_db
from backend.models.order import Order
from backend.models.seller import Seller
from backend.models.payment import Payment
from backend.models.notification import Notification

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/api/orders', methods=['POST'])
def create_order():
    """
    POST /api/orders
    Creates a new order, payment record, and sends in-app notifications.
    """
    data = request.get_json() or {}
    customer_id = data.get('customer_id') or session.get('user_id') or 5
    seller_id = int(data.get('seller_id', 1))
    total_amount = float(data.get('total_amount', 0))
    delivery_fee = float(data.get('delivery_fee', 30))
    delivery_method = data.get('delivery_method', 'Local Delivery Partner')
    payment_method = data.get('payment_method', 'COD')
    address = data.get('address', 'Koramangala 4th Block')
    pincode = data.get('pincode', '560034')
    items = data.get('items', [])

    if not items or total_amount <= 0:
        return jsonify({'error': 'Order items and valid total_amount are required'}), 400

    order = Order.create(customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode, items)
    order_id = order['id']

    # Create Payment Record
    Payment.create(order_id, customer_id, total_amount, payment_method)

    # Create delivery_request if delivery method is not Store Pickup
    if delivery_method != 'Store Pickup':
        seller = Seller.find_by_id(seller_id)
        pickup_loc = f"{seller['business_name']} ({seller['location']})" if seller else "Seller Studio"
        
        execute_db("""
            INSERT INTO delivery_requests (order_id, pickup_location, customer_location, distance, delivery_fee, status)
            VALUES (?, ?, ?, 2.5, ?, 'Available')
        """, (order_id, pickup_loc, f"{address} (PIN: {pincode})", delivery_fee))

    # Send Notifications
    seller_obj = Seller.find_by_id(seller_id)
    seller_user_id = seller_obj['user_id'] if seller_obj else 1

    Notification.create(
        customer_id,
        "Order Placed",
        f"Your order #LK-100{order_id} has been placed successfully.",
        "order"
    )
    Notification.create(
        seller_user_id,
        "New Order Received",
        f"You received a new order #LK-100{order_id}.",
        "seller"
    )

    return jsonify({'message': 'Order placed successfully!', 'order': order}), 201

@orders_bp.route('/api/orders', methods=['GET'])
def get_orders():
    """GET /api/orders — Retrieve customer or seller order list."""
    user_id = session.get('user_id') or 5
    role = session.get('user_role', 'customer')
    seller_id = session.get('seller_id')

    if role == 'seller' and seller_id:
        orders = Order.get_by_seller(seller_id)
    else:
        orders = Order.get_by_customer(user_id)

    return jsonify(orders), 200

@orders_bp.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """GET /api/orders/<id> — View details of a specific order."""
    order = Order.find_by_id(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify(order), 200

@orders_bp.route('/api/orders/<int:order_id>/status', methods=['PUT'])
@orders_bp.route('/api/seller/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """
    PUT /api/orders/<id>/status or /api/seller/orders/<id>/status
    Seller / Admin status transition:
    Placed → Accepted → Preparing → Ready → Picked Up / Completed
    """
    data = request.get_json() or {}
    new_status = data.get('status')

    valid_statuses = [
        'Placed', 'Accepted', 'Preparing', 'Ready', 'Ready for Pickup',
        'Picked Up by Customer', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled'
    ]
    if not new_status or new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400

    updated = Order.update_status(order_id, new_status)
    if updated:
        if new_status == 'Accepted':
            Notification.create(
                updated['customer_id'],
                "Order Accepted",
                f"{updated['seller_name']} accepted your order #LK-100{order_id}.",
                "order"
            )
        elif new_status in ['Ready', 'Ready for Pickup']:
            Notification.create(
                updated['customer_id'],
                "Order Ready",
                f"Your order #LK-100{order_id} is ready for delivery/pickup.",
                "order"
            )

    return jsonify({'message': f'Order status updated to {new_status}', 'order': updated}), 200
