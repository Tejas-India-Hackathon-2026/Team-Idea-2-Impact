import os
import json
import urllib.request
import sys

sys.path.insert(0, os.path.abspath("."))

BASE_URL = "http://127.0.0.1:5000"

def run_test(name, func):
    print(f"[TEST] {name}...", end=" ")
    try:
        func()
        print("[OK] PASSED")
    except Exception as e:
        print(f"[FAIL] FAILED: {e}")
        sys.exit(1)

def http_get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_1_render_health_check():
    res = http_get("/health")
    assert res["status"] == "ok", "Render health check failed"

def test_2_api_health_check():
    res = http_get("/api/health")
    assert res["status"] == "ok", "API health check failed"

def test_3_database_init_script():
    from backend.database import init_db
    init_db()

def test_4_render_blueprint_validation():
    assert os.path.exists("render.yaml"), "Missing render.yaml"
    with open("render.yaml", "r", encoding="utf-8") as f:
        content = f.read()
        assert "localkart-backend" in content, "Missing backend in render.yaml"
        assert "localkart-frontend" in content, "Missing frontend in render.yaml"
        assert "localkart-db" in content, "Missing postgres database in render.yaml"

if __name__ == "__main__":
    print("\n--- RUNNING RENDER PRODUCTION DEPLOYMENT TEST SUITE ---")
    run_test("1. Render /health Check Endpoint", test_1_render_health_check)
    run_test("2. FastAPI /api/health Endpoint", test_2_api_health_check)
    run_test("3. PostgreSQL / SQLite Database Init", test_3_database_init_script)
    run_test("4. Render Blueprint render.yaml Verification", test_4_render_blueprint_validation)
    print("\nALL 4 RENDER PRODUCTION TESTS PASSED PERFECTLY!\n")
