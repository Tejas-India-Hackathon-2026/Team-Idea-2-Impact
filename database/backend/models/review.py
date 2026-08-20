# LocalKart Enhanced Review, Media & Verified Purchase Model
from backend.database import query_db, execute_db

class Review:
    @staticmethod
    def check_eligibility(customer_id, product_id):
        """
        Verifies if customer purchased product_id and order status is 'Delivered' or 'Completed'.
        Returns order_id if eligible, otherwise None.
        """
        query = """
            SELECT o.id AS order_id
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.customer_id = ? AND oi.product_id = ? AND o.status IN ('Delivered', 'Completed')
            ORDER BY o.id DESC
        """
        res = query_db(query, (customer_id, product_id), one=True)
        return res['order_id'] if res else None

    @staticmethod
    def create(customer_id, product_id, seller_id, order_id, rating, comment, verified_purchase=True):
        """Creates a customer review with verified purchase status."""
        query = """
            INSERT INTO reviews (customer_id, product_id, seller_id, order_id, rating, comment, verified_purchase, status, helpful_count)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Approved', 0)
        """
        review_id = execute_db(query, (customer_id, product_id, seller_id, order_id, rating, comment, 1 if verified_purchase else 0))

        # Recalculate and update seller rating
        Review.recalculate_seller_rating(seller_id)

        return Review.find_by_id(review_id)

    @staticmethod
    def add_media(review_id, media_type, media_url, file_name):
        """Attaches a photo or video media file to a review."""
        query = """
            INSERT INTO review_media (review_id, media_type, media_url, file_name)
            VALUES (?, ?, ?, ?)
        """
        return execute_db(query, (review_id, media_type, media_url, file_name))

    @staticmethod
    def find_by_id(review_id):
        """Returns review details with attached media."""
        review = query_db("""
            SELECT r.*, u.name AS customer_name, p.name AS product_name, s.business_name AS seller_name
            FROM reviews r
            JOIN users u ON r.customer_id = u.id
            JOIN products p ON r.product_id = p.id
            JOIN sellers s ON r.seller_id = s.id
            WHERE r.id = ?
        """, (review_id,), one=True)

        if review:
            review['media'] = query_db("SELECT * FROM review_media WHERE review_id = ?", (review_id,))

        return review

    @staticmethod
    def get_by_product(product_id, rating_filter=None, media_filter=None):
        """Retrieves approved product reviews with optional rating and media filters."""
        sql = """
            SELECT r.*, u.name AS customer_name
            FROM reviews r
            JOIN users u ON r.customer_id = u.id
            WHERE r.product_id = ? AND r.status = 'Approved'
        """
        args = [product_id]

        if rating_filter and str(rating_filter).isdigit():
            sql += " AND r.rating = ?"
            args.append(int(rating_filter))

        sql += " ORDER BY r.id DESC"
        reviews = query_db(sql, tuple(args))

        filtered_reviews = []
        for r in reviews:
            media = query_db("SELECT * FROM review_media WHERE review_id = ?", (r['id'],))
            r['media'] = media

            has_images = any(m['media_type'] == 'image' for m in media)
            has_videos = any(m['media_type'] == 'video' for m in media)

            if media_filter == 'photos' and not has_images:
                continue
            if media_filter == 'videos' and not has_videos:
                continue

            filtered_reviews.append(r)

        return filtered_reviews

    @staticmethod
    def get_by_seller(seller_id):
        """Retrieves approved reviews for seller profile."""
        reviews = query_db("""
            SELECT r.*, u.name AS customer_name, p.name AS product_name
            FROM reviews r
            JOIN users u ON r.customer_id = u.id
            JOIN products p ON r.product_id = p.id
            WHERE r.seller_id = ? AND r.status = 'Approved'
            ORDER BY r.id DESC
        """, (seller_id,))

        for r in reviews:
            r['media'] = query_db("SELECT * FROM review_media WHERE review_id = ?", (r['id'],))

        return reviews

    @staticmethod
    def mark_helpful(review_id):
        """Increments helpful vote count for a review."""
        execute_db("UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?", (review_id,))
        return True

    @staticmethod
    def report(review_id, reported_by, reason):
        """Submits an abuse/inappropriate content report for a review."""
        query = """
            INSERT INTO review_reports (review_id, reported_by, reason, status)
            VALUES (?, ?, ?, 'Pending')
        """
        return execute_db(query, (review_id, reported_by, reason))

    @staticmethod
    def recalculate_seller_rating(seller_id):
        """Recalculates seller average rating based on approved reviews."""
        res = query_db("SELECT AVG(rating) AS avg_rating, COUNT(*) AS count FROM reviews WHERE seller_id = ? AND status = 'Approved'", (seller_id,), one=True)
        if res and res['avg_rating']:
            avg = round(float(res['avg_rating']), 1)
            execute_db("UPDATE sellers SET rating = ? WHERE id = ?", (avg, seller_id))

    @staticmethod
    def approve(review_id):
        execute_db("UPDATE reviews SET status = 'Approved' WHERE id = ?", (review_id,))
        rev = Review.find_by_id(review_id)
        if rev:
            Review.recalculate_seller_rating(rev['seller_id'])
        return True

    @staticmethod
    def reject(review_id):
        execute_db("UPDATE reviews SET status = 'Rejected' WHERE id = ?", (review_id,))
        rev = Review.find_by_id(review_id)
        if rev:
            Review.recalculate_seller_rating(rev['seller_id'])
        return True

    @staticmethod
    def delete(review_id):
        rev = Review.find_by_id(review_id)
        execute_db("DELETE FROM reviews WHERE id = ?", (review_id,))
        if rev:
            Review.recalculate_seller_rating(rev['seller_id'])
        return True
