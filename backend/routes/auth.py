# LocalKart Authentication & User Profile Blueprint
from functools import wraps
from flask import Blueprint, request, jsonify, session
from backend.models.user import User
from backend.models.seller_profile import SellerProfile
from backend.models.delivery_profile import DeliveryProfile
from backend.database import execute_db, query_db

auth_bp = Blueprint('auth', __name__)

def role_required(*allowed_roles):
    """Decorator to enforce role permissions on API endpoints."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_role = session.get('user_role')
            if not user_role or user_role not in allowed_roles:
                return jsonify({'error': 'Unauthorized: Access restricted to authorized roles'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# 1. SEND OTP ENDPOINT
@auth_bp.route('/api/auth/otp/send', methods=['POST'])
def send_otp():
    data = request.get_json() or {}
    phone = data.get('phone')
    if not phone:
        return jsonify({'error': 'Mobile number is required'}), 400

    otp_code = User.generate_otp(phone)
    return jsonify({
        'message': f'OTP sent successfully to {phone}',
        'phone': phone,
        'demo_otp': otp_code
    }), 200

# 2. VERIFY OTP ENDPOINT
@auth_bp.route('/api/auth/otp/verify', methods=['POST'])
def verify_otp():
    data = request.get_json() or {}
    phone = data.get('phone')
    otp_code = data.get('otp_code')
    requested_role = data.get('role', 'customer')

    if not phone or not otp_code:
        return jsonify({'error': 'Phone and OTP code are required'}), 400

    success, err = User.verify_otp(phone, otp_code)
    if not success:
        return jsonify({'error': err}), 400

    # Find or create user
    user = User.find_by_phone(phone)
    if not user:
        user_name = data.get('name') or f"User {phone[-4:]}"
        email = data.get('email') or f"user_{phone.replace('+', '').replace(' ', '')}@localkart.in"
        user, _ = User.create(user_name, email, phone, 'password123', requested_role)
    else:
        # Ensure role is added
        User.add_role(user['id'], requested_role)
        user = User.find_by_id(user['id'])

    session['user_id'] = user['id']
    session['user_name'] = user['name']
    session['user_role'] = user['role']

    return jsonify({
        'message': 'OTP verification successful',
        'user': user
    }), 200

# 3. SWITCH ACTIVE ROLE
@auth_bp.route('/api/auth/switch-role', methods=['POST'])
def switch_role():
    data = request.get_json() or {}
    target_role = data.get('role')
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    roles = User.get_roles(user_id)
    if target_role not in roles:
        return jsonify({'error': f'Role {target_role} not assigned to this account'}), 403

    session['user_role'] = target_role
    execute_db("UPDATE users SET role = ? WHERE id = ?", (target_role, user_id))
    user = User.find_by_id(user_id)
    return jsonify({'message': f'Switched to {target_role}', 'user': user}), 200

# 4. REGISTER SELLER
@auth_bp.route('/api/auth/register-seller', methods=['POST'])
def register_seller():
    data = request.get_json() or {}
    user_id = session.get('user_id')
    business_name = data.get('business_name')
    description = data.get('description', '')
    location = data.get('location', 'Koramangala, Bengaluru')
    pincode = data.get('pincode', '560034')

    if not business_name:
        return jsonify({'error': 'Business name is required'}), 400

    if user_id:
        User.add_role(user_id, 'seller')
        seller = SellerProfile.create(user_id, business_name, description, location, pincode)
        session['user_role'] = 'seller'
        session['seller_id'] = seller['id']
        user = User.find_by_id(user_id)
        return jsonify({'message': 'Seller registered successfully', 'seller': seller, 'user': user}), 201
    else:
        # Create seller account with phone
        phone = data.get('phone')
        if not phone:
            return jsonify({'error': 'Mobile number required'}), 400
        name = data.get('name', business_name)
        user, _ = User.create(name, None, phone, 'password123', 'seller')
        seller = SellerProfile.create(user['id'], business_name, description, location, pincode)
        session['user_id'] = user['id']
        session['user_role'] = 'seller'
        session['seller_id'] = seller['id']
        return jsonify({'message': 'Seller registered successfully', 'seller': seller, 'user': user}), 201

# 5. REGISTER DELIVERY PARTNER
@auth_bp.route('/api/auth/register-delivery', methods=['POST'])
def register_delivery():
    data = request.get_json() or {}
    user_id = session.get('user_id')
    name = data.get('name')
    phone = data.get('phone')
    vehicle_type = data.get('vehicle_type', 'Bike')
    license_no = data.get('license_no', 'DL-LOCALKART')
    location = data.get('location', 'Koramangala, Bengaluru')
    pincode = data.get('pincode', '560034')

    if not phone or not name:
        return jsonify({'error': 'Name and phone number are required'}), 400

    if not user_id:
        user, _ = User.create(name, None, phone, 'password123', 'delivery_partner')
        user_id = user['id']
    else:
        User.add_role(user_id, 'delivery_partner')

    dp = DeliveryProfile.create(user_id, name, phone, vehicle_type, license_no, location, pincode)
    session['user_id'] = user_id
    session['user_role'] = 'delivery_partner'
    session['delivery_partner_id'] = dp['id']
    user = User.find_by_id(user_id)
    return jsonify({'message': 'Delivery partner registered successfully', 'delivery_partner': dp, 'user': user}), 201

@auth_bp.route('/api/signup', methods=['POST'])
@auth_bp.route('/api/auth/register', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '+91 98000 00000')
    password = data.get('password', 'password123')
    role = data.get('role', 'customer')

    user, error = User.create(name, email, phone, password, role)
    if error:
        return jsonify({'error': error}), 400

    session['user_id'] = user['id']
    session['user_name'] = user['name']
    session['user_role'] = user['role']

    return jsonify({'message': 'Signup successful', 'user': user}), 201

@auth_bp.route('/api/login', methods=['POST'])
@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email_or_phone = data.get('email') or data.get('phone')
    password = data.get('password', 'password123')

    if not email_or_phone:
        return jsonify({'error': 'Mobile number or email is required'}), 400

    user, error = User.authenticate(email_or_phone, password)
    if error:
        return jsonify({'error': error}), 401

    session['user_id'] = user['id']
    session['user_name'] = user['name']
    session['user_role'] = user['role']

    return jsonify({'message': 'Login successful', 'user': user}), 200

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/api/me', methods=['GET'])
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'logged_in': False}), 200
    user = User.find_by_id(user_id)
    return jsonify({'logged_in': True, 'user': user, 'active_role': session.get('user_role', 'customer')}), 200
