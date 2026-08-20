# LocalKart Payment Model
import time
from backend.database import query_db, execute_db

class Payment:
    @staticmethod
    def create(order_id, customer_id, amount, payment_method):
        """Creates a payment record for an order."""
        if payment_method.upper() == 'UPI':
            status = 'Paid'
            tx_id = f"UPI-DEMO-{int(time.time())}"
        else:
            status = 'Pending'
            tx_id = f"COD-{order_id}"

        query = """
            INSERT INTO payments (order_id, customer_id, amount, payment_method, payment_status, transaction_id)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        payment_id = execute_db(query, (order_id, customer_id, amount, payment_method, status, tx_id))
        return Payment.find_by_id(payment_id)

    @staticmethod
    def find_by_id(payment_id):
        return query_db("SELECT * FROM payments WHERE id = ?", (payment_id,), one=True)

    @staticmethod
    def find_by_order(order_id):
        return query_db("SELECT * FROM payments WHERE order_id = ?", (order_id,), one=True)

    @staticmethod
    def update_status(payment_id, status):
        execute_db("UPDATE payments SET payment_status = ? WHERE id = ?", (status, payment_id))
        return Payment.find_by_id(payment_id)
