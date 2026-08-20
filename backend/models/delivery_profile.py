# LocalKart Delivery Partner Profile Model
from backend.database import query_db, execute_db

class DeliveryProfile:
    @staticmethod
    def create(user_id, name, phone, vehicle_type, license_no, location, pincode):
        existing = query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (user_id,), one=True)
        if existing:
            return existing
        query = """
            INSERT INTO delivery_partners (user_id, name, phone, vehicle_type, license_no, location, pincode, available, approval_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'Approved')
        """
        dp_id = execute_db(query, (user_id, name, phone, vehicle_type, license_no, location, pincode))
        return query_db("SELECT * FROM delivery_partners WHERE id = ?", (dp_id,), one=True)

    @staticmethod
    def find_by_user_id(user_id):
        return query_db("SELECT * FROM delivery_partners WHERE user_id = ?", (user_id,), one=True)

    @staticmethod
    def find_by_id(dp_id):
        return query_db("SELECT * FROM delivery_partners WHERE id = ?", (dp_id,), one=True)
