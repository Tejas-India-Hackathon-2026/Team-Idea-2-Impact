# LocalKart Razorpay Payment Gateway & Webhook Service
import os
import hmac
import hashlib
import time
import json
import urllib.request
import urllib.parse
from backend.config import Config

class PaymentService:
    @staticmethod
    def create_razorpay_order(amount_in_rupees, order_id, currency="INR"):
        """
        Creates a Razorpay Order ID for checkout SDK.
        Amount must be in paise (e.g. ₹480 = 48000 paise).
        """
        amount_in_paise = int(amount_in_rupees * 100)
        key_id = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_localkart2026')
        key_secret = os.environ.get('RAZORPAY_KEY_SECRET', 'secret_localkart2026')

        payload = {
            "amount": amount_in_paise,
            "currency": currency,
            "receipt": f"receipt_lk_{order_id}",
            "notes": {
                "order_id": order_id,
                "platform": "LocalKart Hyperlocal"
            }
        }

        # If live/test credentials provided, call Razorpay REST API
        if key_id != 'rzp_test_localkart2026' and key_secret != 'secret_localkart2026':
            try:
                url = "https://api.razorpay.com/v1/orders"
                data_bytes = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(url, data=data_bytes, headers={'Content-Type': 'application/json'}, method='POST')

                import base64
                auth_str = f"{key_id}:{key_secret}"
                auth_b64 = base64.b64encode(auth_str.encode('ascii')).decode('ascii')
                req.add_header("Authorization", f"Basic {auth_b64}")

                with urllib.request.urlopen(req, timeout=5) as response:
                    if response.status == 200:
                        data = json.loads(response.read().decode('utf-8'))
                        return {
                            "razorpay_order_id": data["id"],
                            "amount": data["amount"],
                            "currency": data["currency"],
                            "key_id": key_id
                        }
            except Exception as e:
                print(f"[Razorpay Service] API Warning: {e}. Operating in simulation mode.")

        # Standard Test / Simulation Mode Response
        sim_order_id = f"order_RzpSim_{int(time.time())}_{order_id}"
        return {
            "razorpay_order_id": sim_order_id,
            "amount": amount_in_paise,
            "currency": currency,
            "key_id": key_id,
            "is_simulation": True
        }

    @staticmethod
    def verify_webhook_signature(body_bytes, signature_header, webhook_secret=None):
        """
        Verifies HMAC-SHA256 signature of incoming Razorpay Webhook.
        """
        if not webhook_secret:
            webhook_secret = os.environ.get('RAZORPAY_WEBHOOK_SECRET', 'whsec_localkart2026')

        try:
            expected_sig = hmac.new(
                webhook_secret.encode('utf-8'),
                body_bytes,
                hashlib.sha256
            ).hexdigest()

            return hmac.compare_digest(expected_sig, signature_header or "")
        except Exception as e:
            print(f"[Razorpay Webhook] Signature verification failed: {e}")
            return False
