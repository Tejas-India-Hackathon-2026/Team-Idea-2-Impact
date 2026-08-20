# LocalKart Products & Search Blueprint
from flask import Blueprint, request, jsonify, session
from backend.models.product import Product

products_bp = Blueprint('products', __name__)

def calculate_distance_km(pincode1, pincode2):
    p1 = str(pincode1 or '560034').strip()
    p2 = str(pincode2 or '560034').strip()
    if p1 == p2:
        return 2.4
    elif p1[:4] == p2[:4]:
        return 3.8
    elif p1[:3] == p2[:3]:
        return 6.2
    return 12.5

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    pincode = request.args.get('pincode') or session.get('localkart_pincode') or '560034'

    if category and category.lower() != 'all':
        products = Product.get_by_category(category)
    else:
        products = Product.get_all()

    for p in products:
        dist = calculate_distance_km(pincode, p.get('seller_pincode', '560034'))
        p['distance_km'] = dist
        p['distance_label'] = f"📍 {dist} km away"

    # Sort nearby products first
    products.sort(key=lambda x: x['distance_km'])

    return jsonify(products), 200

@products_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    product = Product.find_by_id(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    pincode = session.get('localkart_pincode') or '560034'
    dist = calculate_distance_km(pincode, product.get('seller_pincode', '560034'))
    product['distance_km'] = dist
    product['distance_label'] = f"📍 {dist} km away"

    return jsonify(product), 200

@products_bp.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '').strip()
    pincode = request.args.get('pincode') or session.get('localkart_pincode') or '560034'

    if not query:
        products = Product.get_all()
    else:
        products = Product.search(query)

    for p in products:
        dist = calculate_distance_km(pincode, p.get('seller_pincode', '560034'))
        p['distance_km'] = dist
        p['distance_label'] = f"📍 {dist} km away"

    products.sort(key=lambda x: x['distance_km'])

    return jsonify(products), 200

@products_bp.route('/api/products', methods=['POST'])
def create_product():
    seller_id = session.get('seller_id')
    if not seller_id:
        return jsonify({'error': 'Unauthorized. Only logged-in sellers can create products.'}), 403

    data = request.get_json() or {}
    name = data.get('name')
    price = data.get('price')
    category = data.get('category', 'Handmade')
    description = data.get('description', '')
    quantity = int(data.get('quantity', 10))
    image = data.get('image', 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80')

    if not name or not price:
        return jsonify({'error': 'Product name and price are required'}), 400

    product = Product.create(seller_id, name, description, float(price), category, quantity, image)
    return jsonify({'message': 'Product created successfully', 'product': product}), 201
