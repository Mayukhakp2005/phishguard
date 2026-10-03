from fastapi.testclient import TestClient
from backend.main import app

test_client_instance = TestClient(app)

def test_root_endpoint_returns_success():
    api_response = test_client_instance.get("/")

    assert api_response.status_code == 200
    response_json_payload = api_response.json()
    assert response_json_payload["status"] == "online"
    assert response_json_payload["name"] == "PhishGuard API"

def test_health_check_endpoint_returns_healthy():
    api_response = test_client_instance.get("/health")

    assert api_response.status_code == 200
    response_json_payload = api_response.json()
    assert response_json_payload["status"] == "healthy"

def test_prediction_for_google_url():
    target_url_string = "https://google.com"
    api_response = test_client_instance.post("/predict", json={"url": target_url_string})

    assert api_response.status_code == 200
    response_json_payload = api_response.json()
    assert response_json_payload["url"] == target_url_string
    assert response_json_payload["prediction"] == "SAFE"
    assert 0 <= response_json_payload["risk_score"] <= 45
    assert 0.0 <= response_json_payload["confidence"] <= 100.0
    assert isinstance(response_json_payload["indicators"], list)

def test_prediction_for_github_url():
    target_url_string = "https://github.com"
    api_response = test_client_instance.post("/predict", json={"url": target_url_string})

    assert api_response.status_code == 200
    response_json_payload = api_response.json()
    assert response_json_payload["url"] == target_url_string
    assert response_json_payload["prediction"] == "SAFE"
    assert 0 <= response_json_payload["risk_score"] <= 45
    assert 0.0 <= response_json_payload["confidence"] <= 100.0
    assert isinstance(response_json_payload["indicators"], list)

def test_prediction_for_paypal_suspicious_url():
    target_url_string = "https://paypal-login-secure.xyz"
    api_response = test_client_instance.post("/predict", json={"url": target_url_string})

    assert api_response.status_code == 200
    response_json_payload = api_response.json()
    assert response_json_payload["url"] == target_url_string
    assert response_json_payload["prediction"] == "DANGER"
    assert 76 <= response_json_payload["risk_score"] <= 100
    assert 0.0 <= response_json_payload["confidence"] <= 100.0
    assert isinstance(response_json_payload["indicators"], list)

def test_prediction_for_amazon_security_check_url():
    target_url_string = "https://amazon-security-check.example"
    api_response = test_client_instance.post("/predict", json={"url": target_url_string})

    assert api_response.status_code == 200
    response_json_payload = api_response.json()
    assert response_json_payload["url"] == target_url_string
    assert response_json_payload["prediction"] in ["SAFE", "SUSPICIOUS", "DANGER"]
    assert 0 <= response_json_payload["risk_score"] <= 100
    assert 0.0 <= response_json_payload["confidence"] <= 100.0
    assert isinstance(response_json_payload["indicators"], list)

def test_empty_url_returns_validation_error():
    api_response = test_client_instance.post("/predict", json={"url": ""})

    assert api_response.status_code == 422
    response_json_payload = api_response.json()
    assert "detail" in response_json_payload

def test_missing_url_field_returns_validation_error():
    api_response = test_client_instance.post("/predict", json={})

    assert api_response.status_code == 422
    response_json_payload = api_response.json()
    assert "detail" in response_json_payload
