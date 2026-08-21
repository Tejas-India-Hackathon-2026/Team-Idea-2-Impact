import os
import json
import urllib.request
import urllib.parse
import sys
import time

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

def http_put(endpoint, data, headers=None):
    url = f"{BASE_URL}{endpoint}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers=req_headers, method="PUT")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def http_delete(endpoint, headers=None):
    url = f"{BASE_URL}{endpoint}"
    req_headers = {}
    if headers:
        req_headers.update(headers)
    
    req = urllib.request.Request(url, headers=req_headers, method="DELETE")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

# Global test state
test_state = {}

def test_1_geocode():
    data = {"address": "Koramangala 4th Block, Bengaluru"}
    res = http_post("/api/location/geocode", data)
    assert res["status"] == "success", "Geocode failed"
    assert "latitude" in res and "longitude" in res, "Missing coordinates"
    assert res["pincode"] == "560034", "Pincode mismatch"

def test_2_reverse_geocode():
    data = {"latitude": 12.934532, "longitude": 77.624389}
    res = http_post("/api/location/reverse-geocode", data)
    assert res["status"] == "success", "Reverse geocode failed"
    assert "formattedAddress" in res, "Missing formattedAddress"

def test_3_signup_user():
    timestamp = int(time.time())
    data = {
        "name": "Location Tester",
        "email": f"location.test.{timestamp}@localkart.com",
        "password": "Password123!",
        "role": "customer"
    }
    res = http_post("/api/auth/signup", data)
    assert res["success"] == True, "Signup failed"
    test_state["token"] = res["token"]

def test_4_create_saved_address():
    headers = {"token": test_state["token"]}
    data = {
        "address_title": "Home",
        "full_address": "Flat 402, Sunshine Apartments, Koramangala, Bengaluru",
        "house": "Flat 402",
        "street": "10th Main Road",
        "locality": "Koramangala 4th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560034",
        "latitude": 12.934532,
        "longitude": 77.624389,
        "is_default": True
    }
    res = http_post("/api/location/saved-addresses", data, headers)
    assert res["success"] == True, "Create saved address failed"
    test_state["address_id"] = res["address_id"]

def test_5_get_saved_addresses():
    headers = {"token": test_state["token"]}
    res = http_get("/api/location/saved-addresses", headers)
    assert res["success"] == True, "Fetch saved addresses failed"
    assert len(res["addresses"]) > 0, "No saved addresses returned"

def test_6_update_saved_address():
    headers = {"token": test_state["token"]}
    data = {
        "address_title": "Office / Work",
        "full_address": "Suite 801, Tech Park, Indiranagar, Bengaluru",
        "city": "Bengaluru",
        "state": "Karnataka",
        "pincode": "560038",
        "latitude": 12.978369,
        "longitude": 77.640835,
        "is_default": True
    }
    res = http_put(f"/api/location/saved-addresses/{test_state['address_id']}", data, headers)
    assert res["success"] == True, "Update saved address failed"

def test_7_nearby_sellers_spatial():
    res = http_get("/api/location/sellers/nearby?latitude=12.934532&longitude=77.624389&radius_km=30")
    assert res["status"] == "success", "Nearby sellers query failed"
    assert "sellers" in res, "Missing sellers array"

def test_8_calculate_delivery_route():
    data = {
        "pickup_lat": 12.934532,
        "pickup_lng": 77.624389,
        "delivery_lat": 12.978369,
        "delivery_lng": 77.640835
    }
    res = http_post("/api/location/delivery/route", data)
    assert res["success"] == True, "Calculate delivery route failed"
    assert "distance_km" in res, "Missing distance_km"
    assert "duration_mins" in res, "Missing duration_mins"

def test_9_delete_saved_address():
    headers = {"token": test_state["token"]}
    res = http_delete(f"/api/location/saved-addresses/{test_state['address_id']}", headers)
    assert res["success"] == True, "Delete saved address failed"

if __name__ == "__main__":
    print("\n--- RUNNING GOOGLE MAPS & LOCATION API TEST SUITE ---")
    run_test("1. Address Geocoding", test_1_geocode)
    run_test("2. Reverse Geocoding Coordinates", test_2_reverse_geocode)
    run_test("3. Customer Authentication Signup", test_3_signup_user)
    run_test("4. Create Customer Saved Address (Home/Work)", test_4_create_saved_address)
    run_test("5. Fetch Customer Saved Addresses", test_5_get_saved_addresses)
    run_test("6. Update Customer Saved Address", test_6_update_saved_address)
    run_test("7. Spatial Nearby Sellers Discovery (Haversine)", test_7_nearby_sellers_spatial)
    run_test("8. Delivery Route & Travel Time ETA", test_8_calculate_delivery_route)
    run_test("9. Delete Customer Saved Address", test_9_delete_saved_address)
    print("\nALL 9 GOOGLE MAPS LOCATION TESTS PASSED PERFECTLY!\n")
