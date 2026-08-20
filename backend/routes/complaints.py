# LocalKart Complaints & Disputes Management Blueprint
import uuid
from flask import Blueprint, request, jsonify, session
from backend.database import query_db, execute_db
from backend.models.notification import Notification

complaints_bp = Blueprint('complaints', __name__)

@complaints_bp.route('/api/complaints', methods=['POST'])
def raise_complaint():
    """
    POST /api/complaints
    Raise a new complaint or dispute for an order or seller.
    """
    data = request.get_json() or {}
    user_id = session.get('user_id') or data.get('user_id') or 5
    order_id = data.get('order_id')
    seller_id = data.get('seller_id')
    issue_type = data.get('issue_type', 'Quality Issue') # Damaged, Missing, Quality, Late Delivery, Seller Issue, Delivery Issue
    description = data.get('description', '')
    evidence_url = data.get('evidence_url', '')

    if not issue_type or not description:
        return jsonify({'error': 'issue_type and description are required'}), 400

    complaint_code = f"CMP-{uuid.uuid4().hex[:8].upper()}"

    comp_id = execute_db("""
        INSERT INTO complaints (complaint_code, user_id, order_id, seller_id, issue_type, description, evidence_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Open')
    """, (complaint_code, user_id, order_id, seller_id, issue_type, description, evidence_url))

    Notification.create(
        user_id,
        "Complaint Submitted",
        f"Complaint {complaint_code} submitted. Our support team is reviewing it.",
        "system"
    )

    return jsonify({
        'message': 'Complaint submitted successfully!',
        'complaint': {
            'id': comp_id,
            'complaint_code': complaint_code,
            'status': 'Open'
        }
    }), 201

@complaints_bp.route('/api/complaints', methods=['GET'])
def get_complaints():
    """
    GET /api/complaints
    Retrieve complaints for Admin or current User.
    """
    user_id = session.get('user_id') or 5
    user_role = session.get('user_role', 'customer')

    if user_role == 'admin':
        complaints = query_db("""
            SELECT c.*, u.name AS user_name, u.phone AS user_phone, s.business_name AS seller_name
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN sellers s ON c.seller_id = s.id
            ORDER BY c.id DESC
        """)
    else:
        complaints = query_db("""
            SELECT c.*, s.business_name AS seller_name
            FROM complaints c
            LEFT JOIN sellers s ON c.seller_id = s.id
            WHERE c.user_id = ?
            ORDER BY c.id DESC
        """, (user_id,))

    return jsonify(complaints), 200

@complaints_bp.route('/api/complaints/<int:complaint_id>/resolve', methods=['PUT'])
def resolve_complaint(complaint_id):
    """
    PUT /api/complaints/<id>/resolve
    Admin resolves or dismisses a complaint with resolution notes.
    """
    data = request.get_json() or {}
    status = data.get('status', 'Resolved') # 'Resolved', 'Dismissed', 'Under Review'
    notes = data.get('resolution_notes', 'Resolved by LocalKart Resolution Team')

    execute_db("UPDATE complaints SET status = ?, resolution_notes = ? WHERE id = ?", (status, notes, complaint_id))
    comp = query_db("SELECT * FROM complaints WHERE id = ?", (complaint_id,), one=True)

    if comp:
        Notification.create(
            comp['user_id'],
            "Complaint Status Update",
            f"Your complaint {comp['complaint_code']} is now marked as {status}.",
            "system"
        )

    return jsonify({
        'message': f"Complaint marked as {status}",
        'complaint': comp
    }), 200
