# Production Prediction Pipeline Documentation

This document describes the design, feature extraction rules, model loading strategy, risk scoring formulation, classification thresholds, and response schema for the PhishGuard prediction pipeline.

---

## 1. Prediction Workflow

The prediction pipeline follows a deterministic multi-stage execution flow:

1. **Input Reception**: The service receives an input URL string via `PhishingPredictionService.predict_url_risk(target_url_string)`.
2. **Feature Extraction**: The input URL is passed to `extract_url_features(target_url_string)` in `backend/features/feature_extractor.py` to extract 18 lexical and structural features.
3. **DataFrame Formatting**: Features are ordered into a single-row DataFrame matching the exact 18-feature schema expected by the trained model.
4. **Model Inference**: The pre-loaded `models/xgboost.joblib` model executes inference to obtain class probabilities $p_{\text{phishing}}$ ($p_0$) and $p_{\text{legitimate}}$ ($p_1$).
5. **Risk Score Formulation**: Phishing probability is converted into an integer risk score ($0 - 100$).
6. **Risk Classification**: The risk score is mapped to a discrete category (`SAFE`, `SUSPICIOUS`, or `DANGER`).
7. **Explainability Generation**: Rule-based explainability checks evaluate the feature vector and raw URL to produce human-readable risk indicators.
8. **Payload Construction**: The final result dictionary is returned to the caller.

---

## 2. Feature Extraction Flow

Features are extracted statelessly without external network requests or live page rendering:

| Feature Name | Description | Extraction Rule |
| :--- | :--- | :--- |
| `URLLength` | Total character length of URL | `len(url_string)` |
| `DomainLength` | Character length of host domain | `len(netloc)` |
| `IsDomainIP` | Raw IP address flag | `1` if domain matches IPv4 regex, else `0` |
| `TLDLength` | Length of top-level domain | `len(tld)` |
| `NoOfSubDomain` | Count of subdomains | `max(0, len(parts) - 2)` |
| `HasObfuscation` | Obfuscation indicator flag | `1` if `%`, `@`, or IP present, else `0` |
| `NoOfObfuscatedChar` | Hex-encoding character count | `url_string.count('%')` |
| `ObfuscationRatio` | Ratio of obfuscated characters | `NoOfObfuscatedChar / URLLength` |
| `NoOfLettersInURL` | Alphabetical letter count | Count of `a-z` letters in core domain body |
| `LetterRatioInURL` | Ratio of letters to URL length | `NoOfLettersInURL / URLLength` |
| `NoOfDegitsInURL` | Numeric digit count | `sum(1 for c in url if c.isdigit())` |
| `DegitRatioInURL` | Ratio of digits to URL length | `NoOfDegitsInURL / URLLength` |
| `NoOfEqualsInURL` | Count of `=` characters | `url_string.count('=')` |
| `NoOfQMarkInURL` | Count of `?` characters | `url_string.count('?')` |
| `NoOfAmpersandInURL` | Count of `&` characters | `url_string.count('&')` |
| `NoOfOtherSpecialCharsInURL` | Count of special delimiters | Count of `.`, `-`, `_` in core domain |
| `SpacialCharRatioInURL` | Ratio of special characters | `NoOfOtherSpecialCharsInURL / URLLength` |
| `IsHTTPS` | Encrypted HTTPS scheme flag | `1` if scheme is `https`, else `0` |

---

## 3. Model Loading Strategy

To guarantee sub-millisecond prediction latency and avoid expensive disk I/O per request:

- **Singleton Pattern**: The `PhishingPredictionService` class implements a class-level singleton instance (`get_instance()`).
- **Startup Initialization**: The serialized XGBoost model artifact (`models/xgboost.joblib`) is loaded into memory exactly **once** when the service initializes.
- **Thread Safety & In-Memory Execution**: Subsequent prediction calls reuse the in-memory `model_instance` directly.

---

## 4. Risk Score Calculation

The model outputs probability distribution $\mathbf{p} = [p_{\text{phishing}}, p_{\text{legitimate}}]$.

- **Phishing Probability**: $p_{\text{phishing}} = \text{class\_probabilities}[0]$
- **Risk Score Formula**:
  $$\text{Risk Score} = \text{round}(p_{\text{phishing}} \times 100)$$
- **Confidence Score**:
  $$\text{Confidence} = \text{round}(\max(p_{\text{phishing}}, p_{\text{legitimate}}), 4)$$

---

## 5. Risk Thresholds & Classifications

| Risk Score Range | Classification | Action / Meaning |
| :--- | :--- | :--- |
| **`0 - 30`** | **`SAFE`** | Low risk; URL demonstrates standard legitimate characteristics. |
| **`31 - 70`** | **`SUSPICIOUS`** | Moderate risk; URL exhibits structural warning signs requiring caution. |
| **`71 - 100`** | **`DANGER`** | High risk; strong phishing indicators and structural obfuscation detected. |

---

## 6. Example Request

```python
from backend.prediction_service import PhishingPredictionService

# Initialize singleton service instance (loads model once)
prediction_service = PhishingPredictionService.get_instance()

# Target URL for prediction
target_url = "http://192.168.1.1/login.php?user=admin%20&token=1234567890@badsite"

# Execute prediction
result_payload = prediction_service.predict_url_risk(target_url)
```

---

## 7. Example Response

```json
{
  "url": "http://192.168.1.1/login.php?user=admin%20&token=1234567890@badsite",
  "prediction": "DANGER",
  "risk_score": 100,
  "confidence": 1.0,
  "indicators": [
    "URL uses unencrypted HTTP protocol instead of HTTPS",
    "Domain consists of a raw IP address instead of a domain name",
    "Excessive URL length detected (77 characters)",
    "URL obfuscation or hex-encoded character patterns detected",
    "High numeric digit ratio in URL (39.0%)",
    "Suspicious query parameter structure with multiple delimiters",
    "URL contains user credential redirect symbol (@)"
  ]
}
```
