# PhishGuard

Machine learning-powered phishing URL detection platform with risk scoring, explainable indicators, and classification (SAFE / SUSPICIOUS / DANGEROUS).

## Project Overview

PhishGuard analyzes URLs to identify potential security threats using trained machine learning models. The application extracts structural, lexical, and domain-based features from input URLs to deliver immediate risk classifications and actionable security insights.

## Project Structure

```text
phishguard/
├── backend/          # FastAPI backend service
├── frontend/         # Web user interface
├── training/         # ML model training and feature extraction scripts
├── models/           # Serialized trained models and artifacts
├── data/
│   ├── raw/          # Raw datasets for training and testing
│   └── processed/    # Processed features and clean datasets
├── tests/            # Automated test suite
├── docs/             # Documentation and setup guides
└── notebooks/        # Jupyter notebooks for exploration and experimentation
```

## Quick Start

Refer to [docs/setup.md](docs/setup.md) for detailed development setup instructions.
