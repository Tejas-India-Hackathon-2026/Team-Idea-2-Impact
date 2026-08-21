
import os
import hmac
import hashlib
import json
import urllib.request
import urllib.parse
import sys

BASE_URL = "http://127.0.0.1:5000"

def run_test(name, func):
    print(f"[TEST] {name}...", end=" ")
    try:
        func()
        print("[OK] PASSED")
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        sys.exit(1)

def http_post(endpoint, data, headers=None):
    url = f"{BASE_URL}{endpoint}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=req_headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def http_get(endpoint, headers=None):
    url = f"{BASE_URL}{endpoint}"
    req_headers = {}
    if headers:
        req_headers.update(headers)
    
    req = urllib.request.Request(url, headers=req_headers, method="GET")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

# Global test state
test_state = {}

def test_1_get_config():
    res = http_get("/api/payments/config")
    assert "key_id" in res, "Missing key_id in config"
    assert res["currency"] == "INR", "Invalid currency"
    assert "platform_fee_percent" in res, "Missing platform fee percent"

def test_2_signup_user():
    timestamp = int(time.time())
    data = {
        "name": "Razorpay Tester",
        "email": f"razorpay.test.{timestamp}@localkart.com",
        "password": "Password123!",
        "role": "customer"
    }
    res = http_post("/api/auth/signup", data)
    assert res["success"] == True, "Signup failed"
    test_state["token"] = res["token"]
    test_state["user_id"] = res["user"]["id"]

def test_3_create_payment_order():
    data = {
        "items": [
            {"product_id": 1, "quantity": 2},
            {"product_id": 2, "quantity": 1}
        ],
        "delivery_address": "42 Market Road, Koramangala, Bengaluru",
        "pincode": "560034",
        "delivery_fee": 40.00
    }
    headers = {"token": test_state["token"]}
    res = http_post("/api/payments/create-order", data, headers)
    assert res["success"] == True, "Create payment order failed"
    assert "razorpay_order_id" in res, "Missing razorpay_order_id"
    assert res["total_amount"] > 0, "Total amount should be > 0"
    
    test_state["order_id"] = res["order_id"]
    test_state["razorpay_order_id"] = res["razorpay_order_id"]

def test_4_verify_payment():
    razorpay_order_id = test_state["razorpay_order_id"]
    razorpay_payment_id = f"pay_test_{test_state['order_id']}"
    
    secret = "localkart_razorpay_secret_key_2026"
    signature = hmac.new(
        secret.encode('utf-8'),
        f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    data = {
        "order_id": test_state["order_id"],
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": signature,
        "payment_method": "upi"
    }
    headers = {"token": test_state["token"]}
    res = http_post("/api/payments/verify", data, headers)
    assert res["success"] == True, "Payment verification failed"
    test_state["razorpay_payment_id"] = razorpay_payment_id

def test_5_idempotent_webhook():
    event_id = f"evt_test_{test_state['order_id']}"
    body = {
        "event_id": event_id,
        "event": "payment.captured",
        "payload": {
            "payment": {
                "entity": {
                    "id": test_state["razorpay_payment_id"],
                    "order_id": test_state["razorpay_order_id"],
                    "amount": 10000
                }
            }
        }
    }
    
    webhook_secret = "localkart_webhook_secret_key_2026"
    body_str = json.dumps(body)
    sig = hmac.new(webhook_secret.encode('utf-8'), body_str.encode('utf-8'), hashlib.sha256).hexdigest()
    
    headers = {"X-Razorpay-Signature": sig}
    res1 = http_post("/api/payments/razorpay/webhook", body, headers)
    assert res1["status"] == "success", "First webhook delivery failed"

    # Repeat delivery -> must be ignored idempotently
    res2 = http_post("/api/payments/razorpay/webhook", body, headers)
    assert res2["status"] == "ignored", "Idempotent duplicate webhook check failed"

def test_6_payment_details():
    headers = {"token": test_state["token"]}
    res = http_get(f"/api/payments/{test_state['order_id']}", headers)
    assert res["payment"] is not None, "Missing payment record"
    assert res["payment"]["status"] == "captured", "Status should be captured"
    assert len(res["sub_orders"]) > 0, "Sub-orders allocation missing"

def test_7_seller_linked_account():
    headers = {"token": test_state["token"]}
    data = {"razorpay_account_id": "acc_seller_localkart_99"}
    res = http_post("/api/sellers/1/razorpay-account", data, headers)
    assert res["success"] == True, "Seller account linking failed"

def test_8_seller_earnings():
    headers = {"token": test_state["token"]}
    res = http_get("/api/sellers/1/earnings", headers)
    assert "total_net_earnings" in res, "Missing total_net_earnings"

def test_9_process_refund():
    headers = {"token": test_state["token"]}
    data = {"amount": 50.00, "reason": "Customer return request"}
    res = http_post(f"/api/payments/{test_state['order_id']}/refund", data, headers)
    assert res["success"] == True, "Refund processing failed"
    assert res["status"] in ["partially_refunded", "fully_refunded"], "Invalid refund status"

def test_10_admin_reconciliation():
    # Login as admin
    admin_data = {"email": "admin@localkart.com", "password": "Password123!"}
    admin_res = http_post("/api/auth/login", admin_data)
    admin_token = admin_res["token"]

    headers = {"token": admin_token}
    res = http_get("/api/payments/admin/reconciliation", headers)
    assert "reconciliation" in res, "Missing reconciliation object"
    assert res["reconciliation"]["reconciliation_status"] == "Balanced & Reconciled", "Reconciliation state invalid"

if __name__ == "__main__":
    print("\n--- RUNNING RAZORPAY PAYMENT & ROUTE PAYOUT TEST SUITE ---")
    run_test("1. Get Payment Config", test_1_get_config)
    run_test("2. Signup User", test_2_signup_user)
    run_test("3. Create Payment Order", test_3_create_payment_order)
    run_test("4. Verify Razorpay Payment Signature", test_4_verify_payment)
    run_test("5. Idempotent Webhook Processing", test_5_idempotent_webhook)
    run_test("6. Fetch Payment & Multi-Seller Details", test_6_payment_details)
    run_test("7. Connect Seller Razorpay Linked Account", test_7_seller_linked_account)
    run_test("8. Fetch Seller Earnings & Payout Ledger", test_8_seller_earnings)
    run_test("9. Process Customer Refund & Reversals", test_9_process_refund)
    run_test("10. Admin Financial Reconciliation", test_10_admin_reconciliation)
    print("\nALL 10 RAZORPAY PAYMENT TESTS PASSED PERFECTLY!\n")
