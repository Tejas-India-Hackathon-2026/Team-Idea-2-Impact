# LocalKart Notifications Routes Blueprint
from flask import Blueprint, jsonify, session
from backend.models.notification import Notification

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/api/notifications', methods=['GET'])
def get_notifications():
    """GET /api/notifications — Returns notifications and unread_count for logged-in user."""
    user_id = session.get('user_id') or 5
    notifs = Notification.get_by_user(user_id)
    unread_count = Notification.get_unread_count(user_id)

    return jsonify({
        'unread_count': unread_count,
        'notifications': notifs
    }), 200

@notifications_bp.route('/api/notifications/<int:notif_id>/read', methods=['PUT'])
def mark_notification_read(notif_id):
    """PUT /api/notifications/<id>/read — Marks a single notification as read."""
    user_id = session.get('user_id') or 5
    Notification.mark_read(notif_id, user_id)
    return jsonify({'message': 'Notification marked as read'}), 200

@notifications_bp.route('/api/notifications/read-all', methods=['PUT'])
def mark_all_notifications_read():
    """PUT /api/notifications/read-all — Marks all notifications for user as read."""
    user_id = session.get('user_id') or 5
    Notification.mark_all_read(user_id)
    return jsonify({'message': 'All notifications marked as read'}), 200
