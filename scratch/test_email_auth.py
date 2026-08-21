import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:5000/api/auth"

def post_json(endpoint, data):
    url = f"{BASE_URL}/{endpoint}"
    payload = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, {"detail": body}

def get_json(endpoint, token=None):
    url = f"{BASE_URL}/{endpoint}"
    headers = {}
    if token:
        headers['token'] = token
    req = urllib.request.Request(url, headers=headers, method='GET')
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        return e.code, json.loads(body)

def main():
    print("==================================================")
    print("RUNNING LOCALKART EMAIL + PASSWORD AUTH TEST SUITE")
    print("==================================================")

    import time
    test_email = f"amit.verma.{int(time.time())}@example.com"
    test_pass = "SecurePass@123"

    # 1. Invalid Email Signup Test
    status, res = post_json("signup", {"name": "Amit Verma", "email": "bad-email", "password": "Pass123"})
    assert status == 400, f"Expected 400 for bad email, got {status}: {res}"
    print("[OK] [TEST PASS] Rejected invalid email format correctly.")

    # 2. Short Password Signup Test
    status, res = post_json("signup", {"name": "Amit Verma", "email": test_email, "password": "123"})
    assert status == 400, f"Expected 400 for short password, got {status}: {res}"
    print("[OK] [TEST PASS] Rejected short password correctly.")

    # 3. Successful Signup Test
    status, res = post_json("signup", {"name": "Amit Verma", "email": test_email, "password": test_pass, "role": "customer"})
    assert status == 200 and res.get("success"), f"Expected 200 for signup, got {status}: {res}"
    auth_token = res.get("token")
    assert auth_token, "No token returned in signup"
    print(f"[OK] [TEST PASS] Signed up successfully. Token: {auth_token[:15]}...")

    # 4. Duplicate Email Signup Test
    status, res = post_json("signup", {"name": "Amit Duplicate", "email": test_email, "password": test_pass})
    assert status == 400, f"Expected 400 for duplicate email, got {status}: {res}"
    print("[OK] [TEST PASS] Prevented duplicate email signup correctly.")

    # 5. Incorrect Password Login Test
    status, res = post_json("login", {"email": test_email, "password": "WrongPassword"})
    assert status == 401, f"Expected 401 for wrong password, got {status}: {res}"
    print("[OK] [TEST PASS] Rejected incorrect password login correctly.")

    # 6. Successful Login Test
    status, res = post_json("login", {"email": test_email, "password": test_pass})
    assert status == 200 and res.get("success"), f"Expected 200 for valid login, got {status}: {res}"
    login_token = res.get("token")
    print(f"[OK] [TEST PASS] Logged in successfully. User: {res['user']['name']} ({res['user']['email']})")

    # 7. Session Validation Test (/me)
    status, res = get_json("me", token=login_token)
    assert status == 200 and res.get("authenticated"), f"Expected authenticated session, got {res}"
    print(f"[OK] [TEST PASS] Validated active session token for {res['user']['email']}.")

    # 8. Forgot Password Request Test
    status, res = post_json("forgot-password", {"email": test_email})
    assert status == 200 and res.get("success"), f"Expected 200 for forgot password, got {res}"
    reset_token = res.get("reset_token")
    print(f"[OK] [TEST PASS] Generated password reset token: {reset_token[:10]}...")

    # 9. Password Reset Test
    new_pass = "BrandNewPass@456"
    status, res = post_json("reset-password", {"email": test_email, "reset_token": reset_token, "new_password": new_pass})
    assert status == 200 and res.get("success"), f"Expected 200 for password reset, got {res}"
    print("[OK] [TEST PASS] Password reset completed successfully.")

    # 10. Login with New Password Test
    status, res = post_json("login", {"email": test_email, "password": new_pass})
    assert status == 200 and res.get("success"), f"Expected 200 logging in with new password, got {status}: {res}"
    print("[OK] [TEST PASS] Logged in successfully with new password!")

    print("\n==================================================")
    print("ALL 10 EMAIL/PASSWORD AUTHENTICATION TESTS PASSED!")
    print("==================================================")

if __name__ == "__main__":
    main()
