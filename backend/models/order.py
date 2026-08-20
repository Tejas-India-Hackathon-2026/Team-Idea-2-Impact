# LocalKart Order Model
from backend.database import query_db, execute_db

class Order:
    @staticmethod
    def create(customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode, items):
        """Creates a new order with atomic stock validation/deduction and customization support."""
        # 1. Validate Stock
        for item in items:
            pid = item['product_id']
            qty = int(item['quantity'])
            prod = query_db("SELECT quantity, name FROM products WHERE id = ?", (pid,), one=True)
            if not prod or prod['quantity'] < qty:
                raise ValueError(f"Insufficient stock for '{prod['name'] if prod else 'Product'}' (Available: {prod['quantity'] if prod else 0})")

        # 2. Insert Order Header
        order_query = """
            INSERT INTO orders (customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Placed')
        """
        order_id = execute_db(order_query, (customer_id, seller_id, total_amount, delivery_fee, delivery_method, address, pincode))

        # 3. Insert Order Items & Deduct Stock
        for item in items:
            pid = item['product_id']
            qty = int(item['quantity'])
            price = float(item['price'])
            
            item_query = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
            item_id = execute_db(item_query, (order_id, pid, qty, price))

            # Deduct stock atomically
            execute_db("UPDATE products SET quantity = MAX(0, quantity - ?) WHERE id = ?", (qty, pid))

            # Save Customization if provided
            cust = item.get('customization') or {}
            if cust or item.get('customText') or item.get('customInstructions'):
                custom_text = cust.get('customText') or item.get('customText')
                custom_instr = cust.get('customInstructions') or item.get('customInstructions')
                color = cust.get('color') or item.get('color')
                size = cust.get('size') or item.get('size')
                custom_image = cust.get('customImageUrl') or item.get('customImageUrl')

                execute_db("""
                    INSERT INTO customization_requests (order_item_id, custom_text, custom_instructions, color, size, custom_image_url)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (item_id, custom_text, custom_instr, color, size, custom_image))

        return Order.find_by_id(order_id)

    @staticmethod
    def find_by_id(order_id):
        """Returns order details with seller, customer, items, and attached customization details."""
        order = query_db("""
            SELECT o.*, u.name AS customer_name, u.phone AS customer_phone, s.business_name AS seller_name, s.location AS seller_location
            FROM orders o
            JOIN users u ON o.customer_id = u.id
            JOIN sellers s ON o.seller_id = s.id
            WHERE o.id = ?
        """, (order_id,), one=True)

        if order:
            items = query_db("""
                SELECT oi.*, p.name AS product_name, p.image AS product_image,
                       cr.custom_text, cr.custom_instructions, cr.color, cr.size, cr.custom_image_url
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                LEFT JOIN customization_requests cr ON cr.order_item_id = oi.id
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
