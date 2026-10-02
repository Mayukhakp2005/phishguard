# FastAPI Backend API Documentation

This document describes the REST API architecture, server startup instructions, endpoint specifications, request/response JSON schemas, and error handling for PhishGuard.

---

## 1. Quick Start & Running the Server

### Installation
Ensure Python 3.10+ and required dependencies are installed:

```bash
pip install -r requirements.txt
```

### Running the Development Server
Launch the FastAPI application using Uvicorn:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://127.0.0.1:8000`.

### Interactive API Documentation
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 2. API Endpoints Overview

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root status endpoint | `200 OK` |
| `GET` | `/health` | Health check probe | `200 OK` |
| `POST` | `/predict` | Phishing URL risk analysis | `200 OK` |

---

## 3. Endpoint Specifications

### A. `POST /predict`

Analyzes an input URL for phishing risk, calculates a 0–100 risk score, classifies the URL (`SAFE`, `SUSPICIOUS`, `DANGER`), and returns explainability indicators.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Body Schema (`URLPredictionRequest`)
```json
{
  "url": "https://example.com"
}
```

- **`url`** (`string`, *required*): Raw target URL string to analyze.

#### Response Body Schema (`URLPredictionResponse`)
```json
{
  "url": "https://example.com",
  "prediction": "SAFE",
  "risk_score": 12,
  "confidence": 98.7,
  "indicators": [
    "No suspicious URL structure indicators detected"
  ]
}
```

- **`url`** (`string`): The analyzed target URL.
- **`prediction`** (`string`): Risk classification label (`SAFE` \| `SUSPICIOUS` \| `DANGER`).
- **`risk_score`** (`integer`): Risk score between `0` (safest) and `100` (highest risk).
- **`confidence`** (`float`): Model prediction confidence percentage (`0.0` - `100.0`).
- **`indicators`** (`array` of `string`): List of human-readable explainability indicators.

---

### B. HTTP Status Codes & Error Handling

| Status Code | Description | Cause |
| :--- | :--- | :--- |
| `200 OK` | Success | Valid request and successful risk prediction |
| `422 Unprocessable Entity` | Validation Error | Missing `url` field or empty/malformed URL string |
| `500 Internal Server Error` | Server Error | Internal prediction engine or model failure |

#### Validation Error Response (`422`)
```json
{
  "detail": [
    {
      "loc": ["body", "url"],
      "msg": "URL string cannot be empty",
      "type": "value_error"
    }
  ]
}
```

---

## 4. cURL Request Examples

### Example 1: Legitimate URL Check
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/predict' \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "https://example.com"
}'
```

### Example 2: Suspicious / Malicious URL Check
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/predict' \
  -H 'Content-Type: application/json' \
  -d '{
  "url": "http://192.168.1.1/login.php?user=admin%20&token=1234567890@badsite"
}'
```
