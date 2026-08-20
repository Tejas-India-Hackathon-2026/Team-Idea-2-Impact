# LocalKart Seller Profile Model
from backend.database import query_db, execute_db

class SellerProfile:
    @staticmethod
    def create(user_id, business_name, description, location, pincode, category='Handmade'):
        existing = query_db("SELECT * FROM sellers WHERE user_id = ?", (user_id,), one=True)
        if existing:
            return existing
        query = """
            INSERT INTO sellers (user_id, business_name, description, location, pincode, approval_status, verified)
            VALUES (?, ?, ?, ?, ?, 'Approved', 1)
        """
        seller_id = execute_db(query, (user_id, business_name, description, location, pincode))
        return query_db("SELECT * FROM sellers WHERE id = ?", (seller_id,), one=True)

    @staticmethod
    def find_by_user_id(user_id):
        return query_db("SELECT * FROM sellers WHERE user_id = ?", (user_id,), one=True)

    @staticmethod
    def find_by_id(seller_id):
        return query_db("SELECT * FROM sellers WHERE id = ?", (seller_id,), one=True)
