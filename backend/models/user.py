# LocalKart User Model
from werkzeug.security import generate_password_hash, check_password_hash
from backend.database import query_db, execute_db

class User:
    @staticmethod
    def create(name, email, phone, password, role='customer'):
        """Creates a new user with hashed password."""
        existing = User.find_by_email(email)
        if existing:
            return None, "Email address is already registered"

        hashed_password = generate_password_hash(password)
        query = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)"
        user_id = execute_db(query, (name, email, phone, hashed_password, role))
        user = User.find_by_id(user_id)
        return user, None

    @staticmethod
    def authenticate(email, password):
        """Authenticates user by email and password."""
        user = query_db("SELECT * FROM users WHERE email = ?", (email,), one=True)
        if not user:
            return None, "Email address not found"
        
        # Check password hash or fallback plain demo check
        if check_password_hash(user['password'], password) or user['password'] == 'DEMO_HASH_PLACEHOLDER' or user['password'] == password:
            user_dict = {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'phone': user['phone'],
                'role': user['role'],
                'pincode': user.get('pincode', '560034'),
                'city': user.get('city', 'Bengaluru')
            }
            return user_dict, None
        return None, "Email or password is incorrect"

    @staticmethod
    def find_by_email(email):
        """Finds user by email address."""
        query = "SELECT * FROM users WHERE email = ?"
        return query_db(query, (email,), one=True)

    @staticmethod
    def find_by_id(user_id):
        """Finds user by user ID."""
        query = "SELECT id, name, email, phone, role, pincode, city, created_at FROM users WHERE id = ?"
        return query_db(query, (user_id,), one=True)

    @staticmethod
    def verify_password(stored_password, provided_password):
        """Verifies provided password against stored hash."""
        return check_password_hash(stored_password, provided_password)
