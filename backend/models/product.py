# LocalKart Product Model
from backend.database import query_db, execute_db

class Product:
    @staticmethod
    def get_all():
        """Returns all products joined with seller business details and proof attributes."""
        query = """
            SELECT p.*, s.business_name AS seller_name, s.location AS seller_location, s.pincode AS seller_pincode, s.verified AS seller_verified
            FROM products p
            JOIN sellers s ON p.seller_id = s.id
            ORDER BY p.id DESC
        """
        return query_db(query)

    @staticmethod
    def find_by_id(product_id):
        """Finds product by product ID with attached seller profile."""
        query = """
            SELECT p.*, s.business_name AS seller_name, s.location AS seller_location, s.pincode AS seller_pincode, s.rating AS seller_rating, s.verified AS seller_verified, s.quality_score AS seller_quality_score
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
            SELECT p.*, s.business_name AS seller_name, s.location AS seller_location, s.verified AS seller_verified
            FROM products p
            JOIN sellers s ON p.seller_id = s.id
            WHERE LOWER(p.name) LIKE LOWER(?)
               OR LOWER(p.category) LIKE LOWER(?)
               OR LOWER(s.business_name) LIKE LOWER(?)
            ORDER BY p.id DESC
        """
        return query_db(query, (search_pattern, search_pattern, search_pattern))

    @staticmethod
    def create(seller_id, name, description, price, category, quantity=10, image=None, making_images=None, short_video=None, is_handmade=True, is_customizable=False, customization_instructions="", prep_time="Ready to Ship", material="", weight="", size="", delivery_available=True, pickup_available=True):
        """Inserts a new product into products table."""
        query = """
            INSERT INTO products (seller_id, name, description, price, category, quantity, image, making_images, short_video, is_handmade, is_customizable, customization_instructions, prep_time, material, weight, size, delivery_available, pickup_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        prod_id = execute_db(query, (seller_id, name, description, price, category, quantity, image, making_images, short_video, 1 if is_handmade else 0, 1 if is_customizable else 0, customization_instructions, prep_time, material, weight, size, 1 if delivery_available else 0, 1 if pickup_available else 0))
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
