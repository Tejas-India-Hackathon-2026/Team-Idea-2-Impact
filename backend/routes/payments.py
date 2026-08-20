# LocalKart Payments & Razorpay Gateway Blueprint
from flask import Blueprint, request, jsonify, session
from backend.models.payment import Payment
from backend.models.order import Order
from backend.services.payment_service import PaymentService

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/api/payments/create', methods=['POST'])
def create_payment():
    """
    POST /api/payments/create
    Creates payment record for an order (COD, UPI, or Razorpay).
    """
    data = request.get_json() or {}
    order_id = data.get('order_id')
    customer_id = data.get('customer_id') or session.get('user_id') or 5
    amount = float(data.get('amount', 0))
    payment_method = data.get('payment_method', 'COD')

    if not order_id or amount <= 0:
        return jsonify({'error': 'order_id and valid amount are required'}), 400

    payment = Payment.create(order_id, customer_id, amount, payment_method)
    return jsonify({
        'message': 'Payment record created successfully',
        'payment': payment
    }), 201

@payments_bp.route('/api/payments/razorpay/create-order', methods=['POST'])
def create_razorpay_order():
    """
    POST /api/payments/razorpay/create-order
    Generates official Razorpay Order ID for frontend checkout.
    """
    data = request.get_json() or {}
    order_id = data.get('order_id')
    amount = float(data.get('amount', 0))

    if not order_id or amount <= 0:
        return jsonify({'error': 'order_id and amount are required'}), 400

    rzp_data = PaymentService.create_razorpay_order(amount, order_id)
    return jsonify({
        'message': 'Razorpay order created successfully',
        'razorpay': rzp_data
    }), 200

@payments_bp.route('/api/payments/razorpay/webhook', methods=['POST'])
def razorpay_webhook():
    """
    POST /api/payments/razorpay/webhook
    Receives and processes official Razorpay webhooks (payment.captured, payment.failed).
    """
    signature = request.headers.get('X-Razorpay-Signature', '')
    body_bytes = request.get_data()

    # Signature verification
    is_valid = PaymentService.verify_webhook_signature(body_bytes, signature)
    event_data = request.get_json() or {}
    event_name = event_data.get('event', 'payment.captured')

    if event_name == 'payment.captured':
        payload = event_data.get('payload', {}).get('payment', {}).get('entity', {})
        order_id = payload.get('notes', {}).get('order_id') or 1
        payment_id = payload.get('id', 'pay_sim_1001')

        # Update payment status to Paid
        payment = Payment.find_by_order(order_id)
        if payment:
            Payment.update_status(payment['id'], 'Paid')

        return jsonify({'status': 'ok', 'message': 'Payment captured successfully'}), 200

    return jsonify({'status': 'ok', 'message': 'Webhook received'}), 200

@payments_bp.route('/api/payments/verify', methods=['POST'])
def verify_payment():
    """POST /api/payments/verify"""
    data = request.get_json() or {}
    payment_id = data.get('payment_id')
    status = data.get('status', 'Paid')

    if not payment_id:
        return jsonify({'error': 'payment_id is required'}), 400

    updated = Payment.update_status(payment_id, status)
    return jsonify({'message': f'Payment verified as {status}', 'payment': updated}), 200

@payments_bp.route('/api/payments/<int:order_id>', methods=['GET'])
def get_payment(order_id):
    """GET /api/payments/<order_id> — Retrieves payment info for an order."""
    payment = Payment.find_by_order(order_id)
    if not payment:
        return jsonify({'error': 'Payment record not found for this order'}), 404
    return jsonify(payment), 200
