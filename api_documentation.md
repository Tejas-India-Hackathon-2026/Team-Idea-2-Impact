# LocalKart — Full REST API & Architecture Reference

> **Base URL**: `http://127.0.0.1:5000/api`  
> **Backend Engine**: Python Flask ↔ PostgreSQL (with fast SQLite local fallback)

---

## 📍 1. Location Onboarding & Geolocation APIs

### 1.1 Update User Location
- **Endpoint**: `PUT /api/user/location`
- **Request Body**:
  ```json
  {
    "latitude": 12.9352,
    "longitude": 77.6245,
    "pincode": "560034",
    "city": "Koramangala, Bengaluru",
    "state": "Karnataka"
  }
  ```
- **Response** (`200 OK`): Saves location in user profile/session for distance calculation & sorting.

---

## 🎤 2. Voice Search & Distance-Aware Products APIs

### 2.1 Nearby Distance-Sorted Products
- **Endpoint**: `GET /api/products?pincode=560034`
- **Response** (`200 OK`): Returns product list enriched with `distance_km` and `distance_label` (e.g. `📍 2.4 km away`), sorted nearby first.

### 2.2 Voice / Text Search
- **Endpoint**: `GET /api/products/search?q=bamboo&pincode=560034`

---

## ⭐ 3. Verified Reviews, Media & Moderation APIs

### 3.1 Submit Verified Purchase Review with Photos/Videos
- **Endpoint**: `POST /api/reviews` (Multipart Form Data)
- **Form Data**:
  - `product_id`: `1`
  - `rating`: `5`
  - `comment`: `"Excellent terracotta vase!"`
  - `photos`: `[File 1, File 2]` (Max 5 images: JPG, PNG, WEBP)
  - `video`: `[Video File]` (Max 1 video: MP4, WEBM, MOV)
- **Response** (`201 Created`): Returns review object with `verified_purchase: true` (if order delivered).

### 3.2 Product Reviews & Filters
- **Endpoint**: `GET /api/products/<product_id>/reviews?rating=5&media=photos`
- **Response** (`200 OK`): `average_rating`, `total_reviews`, `reviews` array with attached media URLs.

### 3.3 Helpful Vote & Report Review
- `POST /api/reviews/<review_id>/helpful`
- `POST /api/reviews/<review_id>/report`

### 3.4 Admin Review Moderation
- `PUT /api/admin/reviews/<review_id>/approve`
- `PUT /api/admin/reviews/<review_id>/reject`
- `DELETE /api/admin/reviews/<review_id>`
