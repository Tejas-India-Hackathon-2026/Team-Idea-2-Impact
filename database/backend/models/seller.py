# LocalKart Seller Model
from backend.database import query_db, execute_db

class Seller:
    @staticmethod
    def create(user_id, business_name, description, location, pincode, delivery_radius=5):
        """Registers a new seller profile linked to user_id."""
        query = """
            INSERT INTO sellers (user_id, business_name, description, location, pincode, delivery_radius)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        seller_id = execute_db(query, (user_id, business_name, description, location, pincode, delivery_radius))
        return Seller.find_by_id(seller_id)

    @staticmethod
    def get_all():
        """Returns list of all registered sellers."""
        query = "SELECT * FROM sellers ORDER BY id ASC"
        return query_db(query)

    @staticmethod
    def find_by_id(seller_id):
        """Finds seller profile by seller ID."""
        query = "SELECT * FROM sellers WHERE id = ?"
        return query_db(query, (seller_id,), one=True)

    @staticmethod
    def find_by_user_id(user_id):
        """Finds seller profile by user ID."""
        query = "SELECT * FROM sellers WHERE user_id = ?"
        return query_db(query, (user_id,), one=True)
