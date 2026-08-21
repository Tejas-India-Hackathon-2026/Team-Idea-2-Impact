-- LocalKart Complete Schema (PostgreSQL & SQLite Compatible)
-- Includes Users, Sellers, Delivery Partners, Products, Orders, Order Items, Delivery Requests, Payments, Notifications, Reviews, Review Media, Review Reports, Wishlists, Followers, Customization

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS customization_requests CASCADE;
DROP TABLE IF EXISTS seller_followers CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS return_requests CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS review_reports CASCADE;
DROP TABLE IF EXISTS review_media CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS refunds CASCADE;
DROP TABLE IF EXISTS seller_transfers CASCADE;
DROP TABLE IF EXISTS seller_linked_accounts CASCADE;
DROP TABLE IF EXISTS sub_orders CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS delivery_requests CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS delivery_partners CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
DROP TABLE IF EXISTS otp_verifications CASCADE;
DROP TABLE IF EXISTS user_locations CASCADE;
DROP TABLE IF EXISTS delivery_partner_profiles CASCADE;
DROP TABLE IF EXISTS seller_profiles CASCADE;
DROP TABLE IF EXISTS customer_profiles CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) DEFAULT 'customer', -- customer, seller, delivery_partner, admin
    name VARCHAR(100) DEFAULT '',
    profile_image TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, pending
    is_email_verified BOOLEAN DEFAULT FALSE,
    reset_token VARCHAR(100),
    reset_token_expires TIMESTAMP,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    pincode VARCHAR(10) DEFAULT '560034',
    city VARCHAR(100) DEFAULT 'Bengaluru',
    state VARCHAR(100) DEFAULT 'Karnataka',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1B. USER ROLES TABLE (Allows multiple roles per user)
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL, -- customer, seller, delivery_partner, admin
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role)
);

-- 1C. CUSTOMER PROFILES TABLE
CREATE TABLE customer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    favorite_locality VARCHAR(100) DEFAULT 'Koramangala',
    saved_addresses TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1D. USER LOCATIONS TABLE (Structured Customer Location Persistence)
CREATE TABLE user_locations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    pincode VARCHAR(10) NOT NULL,
    locality VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) NOT NULL,
    country VARCHAR(50) DEFAULT 'India',
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    formatted_address TEXT,
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1E. OTP VERIFICATIONS TABLE
CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    resend_cooldown TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SELLERS TABLE
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(200) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    self_delivery BOOLEAN DEFAULT TRUE,
    delivery_radius INT DEFAULT 5, -- in kilometers
    rating DECIMAL(3, 2) DEFAULT 4.8,
    quality_score DECIMAL(3, 2) DEFAULT 4.9, -- Calculated metric (verified rating, return rate, complaint rate)
    verified BOOLEAN DEFAULT TRUE,
    approval_status VARCHAR(30) DEFAULT 'Approved', -- Pending, Approved, Rejected
    latitude DECIMAL(9, 6) DEFAULT 12.934532,
    longitude DECIMAL(9, 6) DEFAULT 77.624389,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DELIVERY PARTNERS TABLE
CREATE TABLE delivery_partners (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'Bike',
    license_no VARCHAR(50),
    location VARCHAR(200) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    delivery_radius INT DEFAULT 8,
    total_deliveries INT DEFAULT 0,
    earnings DECIMAL(10, 2) DEFAULT 0.00,
    approval_status VARCHAR(30) DEFAULT 'Approved', -- Pending, Approved, Rejected
    current_lat DECIMAL(9, 6) DEFAULT 12.934000,
    current_lng DECIMAL(9, 6) DEFAULT 77.623000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS TABLE
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES sellers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 10,
    image TEXT,
    making_images TEXT, -- Comma-separated or JSON list of process photos
    short_video TEXT, -- Video proof url
    is_handmade BOOLEAN DEFAULT TRUE,
    is_customizable BOOLEAN DEFAULT FALSE,
    customization_instructions TEXT,
    prep_time VARCHAR(50) DEFAULT 'Ready to Ship',
    material VARCHAR(100),
    weight VARCHAR(50),
    size VARCHAR(50),
    delivery_available BOOLEAN DEFAULT TRUE,
    pickup_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    seller_id INT REFERENCES sellers(id) ON DELETE CASCADE,
    delivery_partner_id INT REFERENCES delivery_partners(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 40.00,
    delivery_method VARCHAR(50) DEFAULT 'Local Delivery',
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    status VARCHAR(30) DEFAULT 'Placed', -- Placed, Accepted, Preparing, Ready, Out for Delivery, Delivered, Cancelled, Completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 6B. CUSTOMIZATION REQUESTS TABLE
CREATE TABLE customization_requests (
    id SERIAL PRIMARY KEY,
    order_item_id INT REFERENCES order_items(id) ON DELETE CASCADE,
    custom_text TEXT,
    custom_instructions TEXT,
    color VARCHAR(50),
    size VARCHAR(50),
    custom_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. DELIVERY REQUESTS TABLE
CREATE TABLE delivery_requests (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    delivery_partner_id INT REFERENCES delivery_partners(id) ON DELETE SET NULL,
    pickup_location TEXT NOT NULL,
    customer_location TEXT NOT NULL,
    distance DECIMAL(5, 2) DEFAULT 2.5,
    delivery_fee DECIMAL(10, 2) DEFAULT 30.00,
    current_lat DECIMAL(9, 6) DEFAULT 12.934000,
    current_lng DECIMAL(9, 6) DEFAULT 77.623000,
    status VARCHAR(30) DEFAULT 'Available', -- Available, Accepted, Picked Up, Out for Delivery, Delivered, Cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- 8. PAYMENTS TABLE
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- COD, UPI, Razorpay
    payment_status VARCHAR(30) DEFAULT 'Pending', -- Pending, Paid, Failed, Refunded
    transaction_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. WISHLISTS TABLE
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 9B. SELLER FOLLOWERS TABLE
CREATE TABLE seller_followers (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    seller_id INT REFERENCES sellers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, seller_id)
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- order, delivery, seller, system
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. REVIEWS TABLE
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    seller_id INT REFERENCES sellers(id) ON DELETE CASCADE,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) DEFAULT 'Approved', -- Pending, Approved, Rejected
    helpful_count INT DEFAULT 0,
    seller_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. REVIEW MEDIA TABLE (Photos & Short Videos)
CREATE TABLE review_media (
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL, -- image, video
    media_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. REVIEW REPORTS TABLE
CREATE TABLE review_reports (
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(id) ON DELETE CASCADE,
    reported_by INT REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending', -- Pending, Reviewed, Dismissed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. COMPLAINTS & DISPUTES TABLE
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    complaint_code VARCHAR(30) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    seller_id INT REFERENCES sellers(id) ON DELETE SET NULL,
    issue_type VARCHAR(100) NOT NULL, -- Damaged, Missing, Quality, Late Delivery
    description TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(30) DEFAULT 'Open', -- Open, Under Review, Resolved, Dismissed
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. RETURNS TABLE
CREATE TABLE return_requests (
    id SERIAL PRIMARY KEY,
    return_code VARCHAR(30) UNIQUE NOT NULL,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    reason VARCHAR(150) NOT NULL,
    details TEXT,
    evidence_url TEXT,
    status VARCHAR(30) DEFAULT 'Requested', -- Requested, Approved, Rejected, Refunded
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. CONVERSATIONS TABLE
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    seller_id INT REFERENCES sellers(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    order_id INT REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. MESSAGES TABLE
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    image_url TEXT,
    file_url TEXT,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. PAYMENTS TABLE (Razorpay Payment Gateway Integration)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method VARCHAR(50), -- upi, card, netbanking, wallet
    status VARCHAR(30) DEFAULT 'created', -- created, authorized, captured, failed, refunded, partially_refunded
    failure_reason TEXT,
    captured_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. SUB-ORDERS TABLE (Multi-Seller Allocation Model)
CREATE TABLE IF NOT EXISTS sub_orders (
    id SERIAL PRIMARY KEY,
    parent_order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_seller_amount DECIMAL(10, 2) NOT NULL,
    payout_status VARCHAR(30) DEFAULT 'pending', -- pending, created, processed, settled, failed, reversed
    transfer_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. SELLER LINKED ACCOUNTS TABLE (Razorpay Route)
CREATE TABLE IF NOT EXISTS seller_linked_accounts (
    id SERIAL PRIMARY KEY,
    seller_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    razorpay_linked_account_id VARCHAR(100) UNIQUE,
    onboarding_status VARCHAR(30) DEFAULT 'pending',
    kyc_status VARCHAR(30) DEFAULT 'pending',
    payout_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. SELLER TRANSFERS TABLE (Route Marketplace Payout Ledger)
CREATE TABLE IF NOT EXISTS seller_transfers (
    id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    payment_id INT REFERENCES payments(id) ON DELETE CASCADE,
    razorpay_transfer_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'created', -- pending, created, processed, settled, failed, reversed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP,
    reversed_at TIMESTAMP
);

-- 22. REFUNDS TABLE (Customer Refund & Route Reversals)
CREATE TABLE IF NOT EXISTS refunds (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    payment_id INT REFERENCES payments(id) ON DELETE CASCADE,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(30) DEFAULT 'pending', -- pending, processed, failed, partially_refunded, fully_refunded
    razorpay_refund_id VARCHAR(100) UNIQUE,
    initiated_by VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    failure_reason TEXT
);

-- 23. WEBHOOK EVENTS TABLE (100% Idempotent Event Log)
CREATE TABLE IF NOT EXISTS webhook_events (
    event_id VARCHAR(100) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 24. PLATFORM SETTINGS TABLE (Configurable Platform Fee Rules)
CREATE TABLE IF NOT EXISTS platform_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value VARCHAR(255) NOT NULL
);

-- 25. CUSTOMER SAVED ADDRESSES TABLE (Multiple Addresses: Home, Work, Other)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    address_title VARCHAR(50) DEFAULT 'Home', -- Home, Work, Other
    full_address TEXT NOT NULL,
    house VARCHAR(100),
    street VARCHAR(150),
    locality VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 26. PERFORMANCE INDEXES FOR SEARCH & LOCATION
CREATE INDEX IF NOT EXISTS idx_users_pincode ON users(pincode);
CREATE INDEX IF NOT EXISTS idx_user_locations_pincode ON user_locations(pincode);
CREATE INDEX IF NOT EXISTS idx_sellers_pincode ON sellers(pincode);
CREATE INDEX IF NOT EXISTS idx_sellers_coords ON sellers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_delivery_partner ON delivery_requests(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON customer_addresses(user_id);

