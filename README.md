# 🛒 LocalKart — Hyperlocal E-Commerce Platform

> **Tagline**: *“Buy Local. Support Local. Grow Local.”*  
> **Core Value Proposition**: Connecting customers directly with local artisans, farmers, home creators, and small manufacturers through delivery-aware hyperlocal commerce.

---

## 🌟 Pitch Deck Core Workflow & Features

LocalKart addresses the central gap in local discovery and delivery feasibility:

1. **Local Product & Seller Discovery**: Search local handmade terracotta pottery, homemade food/pickles, farm-fresh vegetables, and artisan crafts.
2. **Seller Trust & Verification**: View business locations, verified local seller badges (`✓ Verified Local Seller`), ratings, and seller catalogs.
3. **Smart Delivery Decision Engine**: Checks PIN code distance and matches fulfillment:
   - **Seller Direct Delivery**: For nearby radius.
   - **Local Delivery Partner**: For city area delivery.
   - **Store Pickup**: Direct collection from seller studio.
   - **Alternative Sellers**: Recommends nearby sellers offering similar products if direct delivery is unavailable.
4. **4-Role Ecosystem & Dashboards**:
   - **Customer**: Product search, delivery check, cart, COD/UPI checkout, real-time status timeline, in-app notifications.
   - **Seller**: Product catalog CRUD, order management (`Placed` → `Accepted` → `Preparing` → `Ready for Pickup`), KPI sales tracker.
   - **Delivery Partner**: Available delivery requests feed, status progression (`Picked Up` → `Out for Delivery` → `Delivered`), earnings tracker.
   - **Admin**: System KPIs, Seller Verification governance (`Verify` / `Reject`), User, Order, Payment, Review & Analytics Reports.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (No React, Angular, Bootstrap, or heavy frameworks).
- **Backend**: Python Flask REST APIs (`app.py`, `routes/`, `models/`).
- **Database**: PostgreSQL (Primary) with automatic fast local SQLite fallback (`database/localkart.db`).
- **Security**: PBKDF2 SHA-256 password hashing (Werkzeug), parameterized SQL queries, role-based session access controls.

---

## 📁 Project Directory Structure

```text
LocalKart/
│
├── frontend/
│   ├── index.html              # Home Page & Banner
│   ├── products.html           # Products Catalog & Category Filters
│   ├── product-details.html    # Product Details & Seller Info
│   ├── seller.html             # Seller Profile & Catalog
│   ├── delivery-check.html     # PIN Code Delivery Feasibility Check
│   ├── cart.html               # Shopping Cart & Summary
│   ├── checkout.html           # Address, Fulfillment & Payment Options
│   ├── orders.html             # Order Tracking & Status Timeline
│   ├── login.html              # Role-based Login Form
│   ├── signup.html             # Registration Form
│   ├── customer-dashboard.html # Customer Dashboard
│   ├── seller-dashboard.html   # Seller Store & Order Management
│   ├── delivery-dashboard.html # Delivery Partner Hub & Earnings
│   ├── admin-dashboard.html    # Admin Control Panel & Verification
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   └── js/
│       ├── main.js             # REST API helpers, Notifications Bell, Cart
│       ├── products.js         # Products & Smart Delivery Check APIs
│       ├── cart.js             # Checkout & Payment API submission
│       ├── seller.js           # Seller store REST APIs
│       └── orders.js           # Orders tracking timeline APIs
│
├── backend/
│   ├── app.py                  # Flask Application Entry Point
│   ├── config.py               # Environment Configuration & Pricing Tiers
│   ├── database.py             # PostgreSQL & SQLite Abstraction Layer
│   │
│   ├── models/
│   │   ├── user.py             # User & Password Hashing model
│   │   ├── seller.py           # Seller profile model
│   │   ├── delivery_partner.py # Delivery Partner model
│   │   ├── product.py          # Product catalog model
│   │   ├── order.py            # Order & OrderItems model
│   │   ├── payment.py          # Payment transaction model
│   │   ├── notification.py     # In-app notification model
│   │   └── review.py           # Review model
│   │
│   ├── routes/
│   │   ├── auth.py             # Signup, Login, Logout APIs
│   │   ├── products.py         # Products & Search APIs
│   │   ├── sellers.py          # Sellers APIs
│   │   ├── delivery.py         # Smart Delivery Check & Delivery Partner APIs
│   │   ├── orders.py           # Order creation & status update APIs
│   │   ├── payments.py         # Payment creation & verification APIs
│   │   ├── notifications.py    # Notification APIs
│   │   ├── reviews.py          # Reviews APIs
│   │   └── admin.py            # Admin Dashboard, Verification & Reports APIs
│   │
│   └── requirements.txt        # Python Dependencies
│
├── database/
│   ├── schema.sql              # PostgreSQL DDL Schema
│   └── sample_data.sql         # Demo Seed Data Script
│
├── .env.example                # Environment Variable Template
├── .gitignore                  # Git Ignore Rules
└── README.md                   # Complete Platform Documentation
```

---

## 🚀 How to Install & Run

1. Clone or open project directory in VS Code:
   ```cmd
   cd LocalKart
   ```
2. Install Python dependencies:
   ```cmd
   pip install -r backend/requirements.txt
   ```
3. Launch Flask Backend Server:
   ```cmd
   python -m backend.app
   ```
4. Open **`http://127.0.0.1:5000/login.html`** in your browser!

---

## 🔐 Demo Test Credentials (Password: `password123`)

- **Customer**: `jayesh@customer.com`
- **Seller**: `riya@handicrafts.com`
- **Delivery Partner**: `ramesh@delivery.com`
- **Admin**: `admin@localkart.com`
