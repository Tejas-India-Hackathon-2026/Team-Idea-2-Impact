# LocalKart Product Model
from backend.database import query_db, execute_db

class Product:
    @staticmethod
    def get_all():
        """Returns all products joined with seller business details."""
        query = """
            SELECT p.*, s.business_name AS seller_name, s.location AS seller_location, s.pincode AS seller_pincode
            FROM products p
            JOIN sellers s ON p.seller_id = s.id
            ORDER BY p.id DESC
        """
        return query_db(query)

    @staticmethod
    def find_by_id(product_id):
        """Finds product by product ID."""
        query = """
            SELECT p.*, s.business_name AS seller_name, s.location AS seller_location, s.pincode AS seller_pincode, s.rating AS seller_rating
            FROM products p
            JOIN sellers s ON p.seller_id = s.id
            WHERE p.id = ?
        """
        return query_db(query, (product_id,), one=True)

    @staticmethod
    def find_by_seller(seller_id):
        """Returns products owned by a specific seller."""
        query = "SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC"
        return query_db(query, (seller_id,))

    @staticmethod
    def search(query_str):
        """Searches products by product name, category, or seller business name."""
        search_pattern = f"%{query_str}%"
        query = """
            SELECT p.*, s.business_name AS seller_name, s.location AS seller_location
            FROM products p
            JOIN sellers s ON p.seller_id = s.id
            WHERE LOWER(p.name) LIKE LOWER(?)
               OR LOWER(p.category) LIKE LOWER(?)
               OR LOWER(s.business_name) LIKE LOWER(?)
            ORDER BY p.id DESC
        """
        return query_db(query, (search_pattern, search_pattern, search_pattern))

    @staticmethod
    def create(seller_id, name, description, price, category, quantity=10, image=None, delivery_available=True, pickup_available=True):
        """Inserts a new product into products table."""
        query = """
            INSERT INTO products (seller_id, name, description, price, category, quantity, image, delivery_available, pickup_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        prod_id = execute_db(query, (seller_id, name, description, price, category, quantity, image, delivery_available, pickup_available))
        return Product.find_by_id(prod_id)

    @staticmethod
    def update(product_id, name, description, price, category, quantity):
        """Updates product details."""
        query = """
            UPDATE products
            SET name = ?, description = ?, price = ?, category = ?, quantity = ?
            WHERE id = ?
        """
        execute_db(query, (name, description, price, category, quantity, product_id))
        return Product.find_by_id(product_id)

    @staticmethod
    def delete(product_id):
        """Deletes a product by product ID."""
        query = "DELETE FROM products WHERE id = ?"
        execute_db(query, (product_id,))
        return True
