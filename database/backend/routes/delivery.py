# LocalKart Smart Delivery Engine, GPS Live Tracking & Order Delivery Routes
from flask import Blueprint, request, jsonify, session
from backend.config import Config
from backend.database import query_db, execute_db
from backend.models.seller import Seller
from backend.models.delivery_partner import DeliveryPartner
from backend.models.notification import Notification
from backend.services.sms_service import SMSService

delivery_bp = Blueprint('delivery', __name__)

@delivery_bp.route('/api/delivery/check', methods=['POST'])
def check_delivery():
    """
    POST /api/delivery/check
    Smart Delivery Decision Engine based on LocalKart Pitch Deck Principles.
    """
    data = request.get_json() or {}
    customer_pincode = str(data.get('customer_pincode', '')).strip()
    seller_pincode = str(data.get('seller_pincode', '')).strip()
    seller_radius = float(data.get('seller_delivery_radius', 5.0))

    if not customer_pincode:
        return jsonify({'error': 'Customer PIN code is required'}), 400

    if customer_pincode == seller_pincode:
        distance_km = 2.3
    elif customer_pincode[:4] == seller_pincode[:4]:
        distance_km = 3.8
    elif customer_pincode[:3] == seller_pincode[:3]:
        distance_km = 6.5
    else:
        distance_km = 12.0

    delivery_fee, estimated_time = Config.calculate_delivery_fee(distance_km)

    options = []
    is_available = False
    delivery_method = 'Store Pickup'

    if distance_km <= seller_radius:
        is_available = True
        delivery_method = 'Seller Direct Delivery'
        options.append('Seller Direct Delivery')
        options.append('Store Pickup')
        message = 'Delivery Available via Local Seller!'
    elif distance_km <= 10.0:
        is_available = True
        delivery_method = 'Local Delivery Partner'
        options.append('Local Delivery Partner')
        options.append('Store Pickup')
        message = 'Delivery Available via Nearby Delivery Partner!'
    else:
        is_available = False
        delivery_method = 'Store Pickup'
        options.append('Store Pickup')
        message = f"This seller cannot deliver to your location (PIN {customer_pincode})."

    alternative_sellers = []
    if not is_available or distance_km > seller_radius:
        all_sellers = Seller.get_all()
        alternative_sellers = [
            s for s in all_sellers
            if s['pincode'] == customer_pincode or s['pincode'][:4] == customer_pincode[:4]
        ]

    return jsonify({
        'available': is_available,
        'distance': f"{distance_km} km",
        'distance_km': distance_km,
        'delivery_method': delivery_method,
        'delivery_fee': delivery_fee,
        'estimated_time': estimated_time,
        'message': message,
        'options': options,
        'alternative_sellers': alternative_sellers
    }), 200

@delivery_bp.route('/api/delivery/available', methods=['GET'])
def get_available_deliveries():
    """GET /api/delivery/available — List unassigned pending delivery requests."""
    requests = query_db("""
        SELECT dr.*, o.address AS customer_address, o.pincode AS customer_pincode, o.status AS order_status
        FROM delivery_requests dr
        JOIN orders o ON dr.order_id = o.id
        WHERE dr.status = 'Available'
        ORDER BY dr.id DESC
    """)
    return jsonify(requests), 200

@delivery_bp.route('/api/delivery/accept', methods=['POST'])
def accept_delivery_request():
    """POST /api/delivery/accept — Delivery partner accepts request."""
    data = request.get_json() or {}
    req_id = data.get('request_id')
    partner_id = session.get('delivery_partner_id') or 1

    if not req_id:
        return jsonify({'error': 'request_id is required'}), 400

    execute_db("""
        UPDATE delivery_requests
        SET delivery_partner_id = ?, status = 'Accepted', accepted_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (partner_id, req_id))

    req_obj = query_db("SELECT * FROM delivery_requests WHERE id = ?", (req_id,), one=True)
    if req_obj:
        execute_db("UPDATE orders SET delivery_partner_id = ?, status = 'Accepted' WHERE id = ?", (partner_id, req_obj['order_id']))
        order_obj = query_db("SELECT o.*, u.phone AS customer_phone FROM orders o JOIN users u ON o.customer_id = u.id WHERE o.id = ?", (req_obj['order_id'],), one=True)
        if order_obj:
            Notification.create(
                order_obj['customer_id'],
                "Delivery Partner Assigned",
                f"A local delivery partner has been assigned to order #LK-100{order_obj['id']}.",
                "delivery"
            )
            SMSService.send_sms(order_obj['customer_phone'], f"LocalKart: A delivery partner has been assigned to order #LK-100{order_obj['id']}.")

    return jsonify({'message': 'Delivery request accepted!', 'delivery_request': req_obj}), 200

@delivery_bp.route('/api/delivery/<int:request_id>/status', methods=['PUT'])
def update_request_status(request_id):
    """PUT /api/delivery/<id>/status — Updates delivery status, triggers notifications & SMS."""
    data = request.get_json() or {}
    new_status = data.get('status')
    partner_id = session.get('delivery_partner_id') or 1

    valid_statuses = ['Accepted', 'Picked Up', 'Out for Delivery', 'Delivered', 'Cancelled']
    if not new_status or new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400

    if new_status == 'Delivered':
        execute_db("""
            UPDATE delivery_requests
            SET status = 'Delivered', completed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (request_id,))

        req_obj = query_db("SELECT * FROM delivery_requests WHERE id = ?", (request_id,), one=True)
        if req_obj:
            execute_db("UPDATE orders SET status = 'Delivered' WHERE id = ?", (req_obj['order_id'],))
            execute_db("""
                UPDATE delivery_partners
                SET total_deliveries = total_deliveries + 1, earnings = earnings + ?
                WHERE id = ?
            """, (req_obj['delivery_fee'], partner_id))

            order_obj = query_db("SELECT o.*, u.phone AS customer_phone FROM orders o JOIN users u ON o.customer_id = u.id WHERE o.id = ?", (req_obj['order_id'],), one=True)
            if order_obj:
                Notification.create(
                    order_obj['customer_id'],
                    "Order Delivered",
                    f"Your order #LK-100{order_obj['id']} has been delivered successfully.",
                    "delivery"
                )
                SMSService.send_sms(order_obj['customer_phone'], f"LocalKart: Order #LK-100{order_obj['id']} delivered! Please rate your experience.")
    else:
        execute_db("UPDATE delivery_requests SET status = ? WHERE id = ?", (new_status, request_id))
        req_obj = query_db("SELECT * FROM delivery_requests WHERE id = ?", (request_id,), one=True)
        if req_obj:
            execute_db("UPDATE orders SET status = ? WHERE id = ?", (new_status, req_obj['order_id']))
            order_obj = query_db("SELECT o.*, u.phone AS customer_phone FROM orders o JOIN users u ON o.customer_id = u.id WHERE o.id = ?", (req_obj['order_id'],), one=True)
            if order_obj and new_status == 'Out for Delivery':
                Notification.create(
                    order_obj['customer_id'],
                    "Order Out for Delivery",
                    f"Your order #LK-100{order_obj['id']} is on the way!",
                    "delivery"
                )
                SMSService.send_sms(order_obj['customer_phone'], f"LocalKart: Order #LK-100{order_obj['id']} is out for delivery with Ramesh Express.")

    return jsonify({'message': f'Status updated to {new_status}'}), 200

@delivery_bp.route('/api/delivery/<int:partner_id>/location', methods=['PUT'])
def update_delivery_gps_location(partner_id):
    """
    PUT /api/delivery/<id>/location
    Delivery partner app posts live GPS coordinates (latitude, longitude).
    """
    data = request.get_json() or {}
    lat = float(data.get('latitude', 12.9352))
    lng = float(data.get('longitude', 77.6245))

    execute_db("UPDATE delivery_partners SET current_lat = ?, current_lng = ? WHERE id = ?", (lat, lng, partner_id))
    execute_db("UPDATE delivery_requests SET current_lat = ?, current_lng = ? WHERE delivery_partner_id = ? AND status IN ('Accepted', 'Picked Up', 'Out for Delivery')", (lat, lng, partner_id))

    return jsonify({'message': 'Live GPS location updated successfully', 'lat': lat, 'lng': lng}), 200

@delivery_bp.route('/api/orders/<int:order_id>/tracking', methods=['GET'])
def get_order_live_tracking(order_id):
    """
    GET /api/orders/<id>/tracking
    Returns live GPS tracking coordinates for interactive map rendering.
    """
    order = query_db("SELECT o.*, s.business_name, s.location AS seller_location FROM orders o JOIN sellers s ON o.seller_id = s.id WHERE o.id = ?", (order_id,), one=True)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    req = query_db("SELECT * FROM delivery_requests WHERE order_id = ?", (order_id,), one=True)
    
    # Store / Seller Coordinates (Koramangala 4th Block, Bengaluru)
    seller_lat, seller_lng = 12.934532, 77.624389
    
    # Customer Address Coordinates (Indiranagar / Koramangala)
    customer_lat, customer_lng = 12.937800, 77.628900
    
    # Live Delivery Vehicle Coordinates
    driver_lat = float(req['current_lat']) if req and req.get('current_lat') else 12.936000
    driver_lng = float(req['current_lng']) if req and req.get('current_lng') else 77.626000

    return jsonify({
        'order_id': order_id,
        'status': order['status'],
        'delivery_method': order['delivery_method'],
        'seller': {
            'name': order['business_name'],
            'address': order['seller_location'],
            'lat': seller_lat,
            'lng': seller_lng
        },
        'customer': {
            'address': order['address'],
            'lat': customer_lat,
            'lng': customer_lng
        },
        'driver': {
            'name': 'Ramesh Express',
            'phone': '+91 98888 22222',
            'lat': driver_lat,
            'lng': driver_lng
        },
        'waypoints': [
            [seller_lat, seller_lng],
            [driver_lat, driver_lng],
            [customer_lat, customer_lng]
        ]
    }), 200

@delivery_bp.route('/api/delivery/my-deliveries', methods=['GET'])
def get_my_deliveries():
    """GET /api/delivery/my-deliveries"""
    partner_id = session.get('delivery_partner_id') or 1
    deliveries = query_db("""
        SELECT dr.*, o.address AS customer_address, o.status AS order_status
        FROM delivery_requests dr
        JOIN orders o ON dr.order_id = o.id
        WHERE dr.delivery_partner_id = ?
        ORDER BY dr.id DESC
    """, (partner_id,))
    return jsonify(deliveries), 200

@delivery_bp.route('/api/delivery/earnings', methods=['GET'])
def get_delivery_earnings():
    """GET /api/delivery/earnings"""
    partner_id = session.get('delivery_partner_id') or 1
    partner = DeliveryPartner.find_by_id(partner_id)
    if not partner:
        return jsonify({'earnings': 0.0, 'total_deliveries': 0}), 200

    return jsonify({
        'earnings': float(partner['earnings']),
        'total_deliveries': partner['total_deliveries'],
        'partner_name': partner['name']
    }), 200
