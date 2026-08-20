# LocalKart Order Model
from backend.database import query_db, execute_db

class Order:
    @staticmethod
    def create(customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode, items):
        """Creates a new order with items."""
        order_query = """
            INSERT INTO orders (customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Placed')
        """
        order_id = execute_db(order_query, (customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode))

        for item in items:
            item_query = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
            execute_db(item_query, (order_id, item['product_id'], item['quantity'], item['price']))

        return Order.find_by_id(order_id)

    @staticmethod
    def find_by_id(order_id):
        """Returns order details with seller and customer names."""
        order = query_db("""
            SELECT o.*, u.name AS customer_name, s.business_name AS seller_name
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            JOIN sellers s ON o.seller_id = s.id
            WHERE o.id = ?
        """, (order_id,), one=True)

        if order:
            items = query_db("""
                SELECT oi.*, p.name AS product_name, p.image AS product_image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            """, (order_id,))
            order['items'] = items

        return order

    @staticmethod
    def get_by_customer(customer_id):
        """Returns all orders placed by customer_id."""
        orders = query_db("""
            SELECT o.*, s.business_name AS seller_name
            FROM orders o
            JOIN sellers s ON o.seller_id = s.id
            WHERE o.customer_id = ?
            ORDER BY o.id DESC
        """, (customer_id,))

        for ord in orders:
            ord['items'] = query_db("""
                SELECT oi.*, p.name AS product_name, p.image AS product_image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            """, (ord['id'],))

        return orders

    @staticmethod
    def get_by_seller(seller_id):
        """Returns all orders placed to a specific seller."""
        orders = query_db("""
            SELECT o.*, u.name AS customer_name
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            WHERE o.seller_id = ?
            ORDER BY o.id DESC
        """, (seller_id,))
        return orders

    @staticmethod
    def update_status(order_id, status):
        """Updates status of an order."""
        query = "UPDATE orders SET status = ? WHERE id = ?"
        execute_db(query, (status, order_id))
        return Order.find_by_id(order_id)
