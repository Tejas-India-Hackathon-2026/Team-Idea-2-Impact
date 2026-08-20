# LocalKart Authentication & User Profile Blueprint
from flask import Blueprint, request, jsonify, session
from backend.models.user import User
from backend.database import execute_db, query_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
@auth_bp.route('/api/auth/register', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone', '+91 98000 00000')
    password = data.get('password')
    role = data.get('role', 'customer')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

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
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user, error = User.authenticate(email, password)
    if error:
        return jsonify({'error': error}), 401

    session['user_id'] = user['id']
    session['user_name'] = user['name']
    session['user_role'] = user['role']

    if user['role'] == 'seller':
        seller = query_db("SELECT id FROM sellers WHERE user_id = ?", (user['id'],), one=True)
        if seller:
            session['seller_id'] = seller['id']

    if user['role'] == 'delivery_partner':
        dp = query_db("SELECT id FROM delivery_partners WHERE user_id = ?", (user['id'],), one=True)
        if dp:
            session['delivery_partner_id'] = dp['id']

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
    return jsonify({'logged_in': True, 'user': user}), 200

@auth_bp.route('/api/user/location', methods=['PUT'])
def update_user_location():
    data = request.get_json() or {}
    user_id = session.get('user_id')
    lat = data.get('latitude')
    lng = data.get('longitude')
    pincode = str(data.get('pincode', '560034')).strip()
    city = data.get('city', 'Bengaluru')
    state = data.get('state', 'Karnataka')

    session['localkart_pincode'] = pincode
    session['localkart_city'] = city

    if user_id:
        execute_db("""
            UPDATE users
            SET latitude = ?, longitude = ?, pincode = ?, city = ?, state = ?
            WHERE id = ?
        """, (lat, lng, pincode, city, state, user_id))

    return jsonify({
        'message': 'Location saved successfully',
        'location': {
            'latitude': lat,
            'longitude': lng,
            'pincode': pincode,
            'city': city,
            'state': state
        }
    }), 200
