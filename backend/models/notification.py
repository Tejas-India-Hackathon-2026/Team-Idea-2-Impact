# LocalKart In-App Notification Model
from backend.database import query_db, execute_db

class Notification:
    @staticmethod
    def create(user_id, title, message, notif_type='info'):
        """Creates a new in-app notification for user_id."""
        query = """
            INSERT INTO notifications (user_id, title, message, type, is_read)
            VALUES (?, ?, ?, ?, 0)
        """
        notif_id = execute_db(query, (user_id, title, message, notif_type))
        return Notification.find_by_id(notif_id)

    @staticmethod
    def find_by_id(notif_id):
        return query_db("SELECT * FROM notifications WHERE id = ?", (notif_id,), one=True)

    @staticmethod
    def get_by_user(user_id):
        """Returns all notifications for user_id ordered by newest first."""
        return query_db("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC", (user_id,))

    @staticmethod
    def get_unread_count(user_id):
        """Returns unread notification count for user_id."""
        res = query_db("SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0", (user_id,), one=True)
        return res['count'] if res else 0

    @staticmethod
    def mark_read(notif_id, user_id):
        """Marks a notification as read."""
        execute_db("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?", (notif_id, user_id))
        return True

    @staticmethod
    def mark_all_read(user_id):
        """Marks all notifications as read for a user."""
        execute_db("UPDATE notifications SET is_read = 1 WHERE user_id = ?", (user_id,))
        return True
