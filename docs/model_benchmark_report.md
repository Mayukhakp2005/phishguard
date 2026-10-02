# Model Benchmark Report

This report presents the experimental evaluation and model selection benchmarking for PhishGuard based on the 18 lexical features extracted from `data/processed/` dataset splits.

## 1. Model Comparison Table

Evaluated on the held-out test dataset (`35,306` instances):

| Model | Accuracy | Precision | Recall | F1 Score | ROC-AUC | Artifact Size |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Logistic Regression** | `99.57%` | `99.29%` | `99.97%` | `99.63%` | `99.82%` | `1.0 KB` |
| **Random Forest** | **`99.69%`** | **`99.55%`** | `99.91%` | **`99.73%`** | `99.78%` | `14.5 MB` |
| **XGBoost** | `99.68%` | `99.46%` | **`99.98%`** | `99.72%` | **`99.83%`** | `1.2 MB` |

---

## 2. Strengths and Weaknesses of Each Model

### A. Logistic Regression
- **Strengths**:
  - Extremely fast inference (<0.1ms per URL), minimal CPU overhead.
  - Linear coefficients provide direct, clear feature importance and explainability.
  - Extremely lightweight artifact size (`1.0 KB`).
- **Weaknesses**:
  - Linear decision boundary cannot capture non-linear feature interactions without explicit feature crosses.

### B. Random Forest Classifier
- **Strengths**:
  - Highest overall test Accuracy (`99.69%`) and F1 Score (`99.73%`).
  - Robust against feature scale variance and non-linear interactions.
- **Weaknesses**:
  - Heavy serialized model size (`14.5 MB`), leading to higher memory consumption.
  - Higher inference latency compared to XGBoost and Logistic Regression.

### C. XGBoost Classifier
- **Strengths**:
  - Top-tier performance across all metrics (`99.68%` Accuracy, `99.98%` Recall, `99.83%` ROC-AUC).
  - Highest Recall score (`99.98%`), minimizing false negatives (uncaught phishing URLs).
  - Compact model artifact size (`1.2 MB`), ~12x smaller than Random Forest.
  - Highly optimized C++ backend for sub-millisecond inference latency.
- **Weaknesses**:
  - Slightly more complex hyperparameter tuning required compared to Random Forest.

---

## 3. Best-Performing Model & Justification

- **Best Overall Model**: **XGBoost Classifier**
- **Justification**: While Random Forest marginally outperforms XGBoost on accuracy by 0.01%, **XGBoost achieves the highest Recall (99.98%) and ROC-AUC (99.83%)** while occupying only **1.2 MB** of memory (compared to 14.5 MB for Random Forest). In security and phishing detection, maximizing Recall is critical to ensure malicious URLs are not misclassified as legitimate.

---

## 4. Production Deployment Recommendation

- **Primary Production Model**: **XGBoost Classifier** (`models/xgboost.joblib`)
  - **Reason**: Delivers optimal balance between sub-millisecond inference speed, top-tier recall (`99.98%`), and lightweight memory footprint (`1.2 MB`).
- **Fallback / Ultra-Low-Latency Option**: **Logistic Regression** (`models/logistic_regression.joblib` + `models/scaler.joblib`)
  - **Reason**: Suitable for constrained edge deployment or micro-latency SLA environments where linear explainability and minimal overhead are prioritized.
