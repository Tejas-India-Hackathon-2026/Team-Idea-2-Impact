-- LocalKart Sample Demo Seed Data
-- Demo Password for all seed users: "password123"

INSERT INTO users (name, email, phone, password, role, latitude, longitude, pincode, city, state) VALUES
('Riya Sharma', 'riya@handicrafts.com', '+91 98765 43210', 'DEMO_HASH_PLACEHOLDER', 'seller', 12.934532, 77.624389, '560034', 'Bengaluru', 'Karnataka'),
('Sunita Devi', 'sunita@maashakti.com', '+91 98123 45678', 'DEMO_HASH_PLACEHOLDER', 'seller', 12.971891, 77.641151, '560038', 'Bengaluru', 'Karnataka'),
('Gurpreet Singh', 'gurpreet@greenvalley.com', '+91 98234 56789', 'DEMO_HASH_PLACEHOLDER', 'seller', 12.911622, 77.638862, '560102', 'Bengaluru', 'Karnataka'),
('Manish Kumar', 'manish@biharcrafts.com', '+91 98345 67890', 'DEMO_HASH_PLACEHOLDER', 'seller', 12.925000, 77.593800, '560041', 'Bengaluru', 'Karnataka'),
('Jayesh Sharma', 'jayesh@customer.com', '+91 98999 11111', 'DEMO_HASH_PLACEHOLDER', 'customer', 12.935200, 77.624500, '560034', 'Bengaluru', 'Karnataka'),
('Ramesh Express', 'ramesh@delivery.com', '+91 98888 22222', 'DEMO_HASH_PLACEHOLDER', 'delivery_partner', 12.934000, 77.623000, '560034', 'Bengaluru', 'Karnataka'),
('LocalKart Admin', 'admin@localkart.com', '+91 90000 00000', 'DEMO_HASH_PLACEHOLDER', 'admin', 12.935000, 77.624000, '560034', 'Bengaluru', 'Karnataka');

INSERT INTO sellers (user_id, business_name, description, location, pincode, self_delivery, delivery_radius, rating, verified) VALUES
(1, 'Riya Handicrafts', 'Handcrafted terracotta pottery, bamboo art, painted clay items, and eco-friendly home decor sculpted using natural riverbed clay.', 'Koramangala 4th Block, Bengaluru', '560034', TRUE, 5, 4.8, TRUE),
(2, 'Maa Shakti Foods', 'Authentic traditional homemade pickles, mango achaar, roasted snacks, and papad crafted in small hygienic home batches.', 'Indiranagar 100ft Rd, Bengaluru', '560038', TRUE, 4, 4.7, TRUE),
(3, 'Green Valley Farm', 'Chemical-free fresh organic vegetables harvested every morning, cold-pressed mustard oil, and pure wildflower mountain honey.', 'HSR Layout Sector 2, Bengaluru', '560102', TRUE, 6, 4.8, TRUE),
(4, 'Bihar Craft House', 'Authentic Madhubani paintings, hand-carved wooden items, and clay diyas produced by village artisan collectives.', 'Jayanagar 4th Block, Bengaluru', '560041', FALSE, 2, 4.6, FALSE);

INSERT INTO delivery_partners (user_id, name, phone, location, pincode, available, delivery_radius, total_deliveries, earnings) VALUES
(6, 'Ramesh Express', '+91 98888 22222', 'Koramangala, Bengaluru', '560034', TRUE, 8, 24, 1920.00);

INSERT INTO products (seller_id, name, description, price, category, quantity, image, delivery_available, pickup_available) VALUES
(1, 'Handmade Terracotta Vase', 'Beautiful hand-painted terracotta vase crafted by local clay artisans in Koramangala. Ideal for dry flowers.', 450.00, 'Handmade', 8, 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80', TRUE, TRUE),
(1, 'Handcrafted Bamboo Basket', 'Eco-friendly handwoven natural bamboo storage basket suitable for fruits, towels, or home organization.', 299.00, 'Handmade', 14, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80', TRUE, TRUE),
(2, 'Homemade Mango Pickle (500g)', 'Traditional home-style raw mango achaar made with cold-pressed mustard oil and aromatic spices.', 180.00, 'Food', 20, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80', TRUE, TRUE),
(3, 'Pure Raw Wildflower Honey (500g)', '100% pure unprocessed wildflower honey harvested ethically from local farm hives near HSR Layout.', 350.00, 'Farm Products', 15, 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&auto=format&fit=crop&q=80', TRUE, TRUE),
(3, 'Organic Fresh Vegetables Basket', 'Assorted seasonal chemical-free vegetables harvested fresh on morning of delivery.', 150.00, 'Farm Products', 18, 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&auto=format&fit=crop&q=80', TRUE, TRUE),
(4, 'Handmade Terracotta Earrings', 'Hand-painted clay jhumka earrings crafted by local artisan craftspeople. Lightweight and skin safe.', 220.00, 'Handmade', 10, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', TRUE, TRUE);

INSERT INTO orders (customer_id, seller_id, delivery_partner_id, total_amount, delivery_fee, delivery_method, address, pincode, status) VALUES
(5, 1, 1, 480.00, 30.00, 'Local Delivery Partner', 'Jayesh Sharma, Flat 402, Koramangala 4th Block (Mob: +91 98999 11111)', '560034', 'Delivered');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 450.00);

INSERT INTO delivery_requests (order_id, delivery_partner_id, pickup_location, customer_location, distance, delivery_fee, status) VALUES
(1, 1, 'Riya Handicrafts (Koramangala 4th Block)', 'Jayesh Sharma, Koramangala (PIN: 560034)', 2.3, 30.00, 'Delivered');

INSERT INTO payments (order_id, customer_id, amount, payment_method, payment_status, transaction_id) VALUES
(1, 5, 480.00, 'UPI', 'Paid', 'UPI-DEMO-99481234');

INSERT INTO notifications (user_id, title, message, type) VALUES
(5, 'Order Delivered', 'Your order #LK-1001 has been delivered successfully. How was your experience?', 'order'),
(1, 'New Order Received', 'You received a new order #LK-1001 for Handmade Terracotta Vase.', 'seller'),
(6, 'Delivery Completed', 'Delivery completed successfully for order #LK-1001.', 'delivery');

INSERT INTO reviews (customer_id, product_id, seller_id, order_id, rating, comment, verified_purchase, status, helpful_count) VALUES
(5, 1, 1, 1, 5, 'Exceptional terracotta quality! Delivered within 30 minutes in Koramangala with pristine eco-packaging.', TRUE, 'Approved', 4);

INSERT INTO review_media (review_id, media_type, media_url, file_name) VALUES
(1, 'image', 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80', 'terracotta_photo_1.jpg');
