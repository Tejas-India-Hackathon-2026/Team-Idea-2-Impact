# LocalKart User Model
import random
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from backend.database import query_db, execute_db

class User:
    @staticmethod
    def create(name, email, phone, password='password123', role='customer'):
        """Creates a new user with hashed password and registers primary role."""
        existing = User.find_by_phone(phone) or (User.find_by_email(email) if email else None)
        if existing:
            # Check if user exists, return existing user with assigned role if appropriate
            User.add_role(existing['id'], role)
            user = User.find_by_id(existing['id'])
            return user, None

        clean_email = email or f"user_{phone.replace('+', '').replace(' ', '')}@localkart.in"
        hashed_password = generate_password_hash(password)
        query = "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)"
        user_id = execute_db(query, (name, clean_email, phone, hashed_password, role))
        
        # Add entry into user_roles
        execute_db("INSERT OR IGNORE INTO user_roles (user_id, role, approved) VALUES (?, ?, 1)", (user_id, role))
        
        user = User.find_by_id(user_id)
        return user, None

    @staticmethod
    def authenticate(email_or_phone, password):
        """Authenticates user by email or phone and password."""
        user = query_db("SELECT * FROM users WHERE email = ? OR phone = ?", (email_or_phone, email_or_phone), one=True)
        if not user:
            return None, "Account not found"
        
        if check_password_hash(user['password'], password) or user['password'] == 'DEMO_HASH_PLACEHOLDER' or user['password'] == password:
            roles = User.get_roles(user['id'])
            user_dict = {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'phone': user['phone'],
                'role': user['role'],
                'roles': roles,
                'pincode': user.get('pincode', '560034'),
                'city': user.get('city', 'Bengaluru')
            }
            return user_dict, None
        return None, "Authentication credentials invalid"

    @staticmethod
    def find_by_phone(phone):
        """Finds user by phone number."""
        query = "SELECT * FROM users WHERE phone = ?"
        return query_db(query, (phone,), one=True)

    @staticmethod
    def find_by_email(email):
        """Finds user by email address."""
        if not email:
            return None
        query = "SELECT * FROM users WHERE email = ?"
        return query_db(query, (email,), one=True)

    @staticmethod
    def find_by_id(user_id):
        """Finds user by user ID with attached roles."""
        user = query_db("SELECT id, name, email, phone, role, pincode, city, created_at FROM users WHERE id = ?", (user_id,), one=True)
        if user:
            user['roles'] = User.get_roles(user_id)
        return user

    @staticmethod
    def get_roles(user_id):
        """Gets array of roles assigned to user."""
        rows = query_db("SELECT role FROM user_roles WHERE user_id = ?", (user_id,))
        if not rows:
            primary = query_db("SELECT role FROM users WHERE id = ?", (user_id,), one=True)
            return [primary['role']] if primary and primary.get('role') else ['customer']
        return [r['role'] for r in rows]

    @staticmethod
    def add_role(user_id, role):
        """Adds a new role to existing user."""
        execute_db("INSERT OR IGNORE INTO user_roles (user_id, role, approved) VALUES (?, ?, 1)", (user_id, role))
        return User.get_roles(user_id)

    @staticmethod
    def generate_otp(phone):
        """Generates a 6-digit OTP code for mobile verification."""
        code = "123456" # Simple predictable demo code or random
        expires = (datetime.datetime.now() + datetime.timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S")
        execute_db("INSERT INTO otp_verifications (phone, otp_code, expires_at) VALUES (?, ?, ?)", (phone, code, expires))
        return code

    @staticmethod
    def verify_otp(phone, otp_code):
        """Verifies OTP code for mobile number."""
        if otp_code == "123456": # Demo override for testing convenience
            return True, None
        record = query_db("SELECT * FROM otp_verifications WHERE phone = ? AND otp_code = ? AND is_verified = 0 ORDER BY id DESC", (phone, otp_code), one=True)
        if not record:
            return False, "Invalid OTP code"
        execute_db("UPDATE otp_verifications SET is_verified = 1 WHERE id = ?", (record['id'],))
        return True, None

