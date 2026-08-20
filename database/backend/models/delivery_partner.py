# LocalKart Delivery Partner Model
from backend.database import query_db, execute_db

class DeliveryPartner:
    @staticmethod
    def create(user_id, name, phone, location, pincode):
        """Creates a delivery partner profile linked to user_id."""
        query = """
            INSERT INTO delivery_partners (user_id, name, phone, location, pincode, available, total_deliveries, earnings)
            VALUES (?, ?, ?, ?, ?, 1, 0, 0.0)
        """
        dp_id = execute_db(query, (user_id, name, phone, location, pincode))
        return DeliveryPartner.find_by_id(dp_id)

    @staticmethod
    def get_all():
        """Returns all delivery partners."""
        query = "SELECT * FROM delivery_partners ORDER BY id ASC"
        return query_db(query)

    @staticmethod
    def find_by_id(dp_id):
        """Finds delivery partner profile by id."""
        query = "SELECT * FROM delivery_partners WHERE id = ?"
        return query_db(query, (dp_id,), one=True)

    @staticmethod
    def find_by_user_id(user_id):
        """Finds delivery partner profile by user_id."""
        query = "SELECT * FROM delivery_partners WHERE user_id = ?"
        return query_db(query, (user_id,), one=True)

    @staticmethod
    def get_available_deliveries():
        """Returns orders available for pickup and delivery."""
        query = """
            SELECT o.*, s.business_name AS seller_name, s.location AS pickup_location, s.pincode AS seller_pincode,
                   u.name AS customer_name, u.phone AS customer_phone
            FROM orders o
            JOIN sellers s ON o.seller_id = s.id
            JOIN users u ON o.customer_id = u.id
            WHERE o.status IN ('Placed', 'Accepted', 'Preparing', 'Ready')
              AND o.delivery_partner_id IS NULL
            ORDER BY o.id DESC
        """
        return query_db(query)

    @staticmethod
    def accept_delivery(order_id, partner_id):
        """Assigns an order to a delivery partner."""
        query = "UPDATE orders SET delivery_partner_id = ?, status = 'Accepted' WHERE id = ?"
        execute_db(query, (partner_id, order_id))
        return query_db("SELECT * FROM orders WHERE id = ?", (order_id,), one=True)

    @staticmethod
    def update_delivery_status(order_id, status, partner_id):
        """Updates delivery status and increments earnings on completion."""
        query = "UPDATE orders SET status = ? WHERE id = ? AND delivery_partner_id = ?"
        execute_db(query, (status, order_id, partner_id))

        if status == 'Delivered':
            execute_db("""
                UPDATE delivery_partners
                SET total_deliveries = total_deliveries + 1, earnings = earnings + 40.00
                WHERE id = ?
            """, (partner_id,))

        return query_db("SELECT * FROM orders WHERE id = ?", (order_id,), one=True)

    @staticmethod
    def get_partner_deliveries(partner_id):
        """Returns active and completed orders for a delivery partner."""
        query = """
            SELECT o.*, s.business_name AS seller_name, s.location AS pickup_location,
                   u.name AS customer_name, u.phone AS customer_phone
            FROM orders o
            JOIN sellers s ON o.seller_id = s.id
            JOIN users u ON o.customer_id = u.id
            WHERE o.delivery_partner_id = ?
            ORDER BY o.id DESC
        """
        return query_db(query, (partner_id,))
