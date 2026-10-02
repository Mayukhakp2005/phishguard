# Development Setup Guide

This guide describes how to set up the development environment for PhishGuard.

## Prerequisites

- Python 3.10+
- Node.js 18+ (for frontend development)
- Git

## Step-by-Step Setup

### 1. Repository Setup

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd phishguard
```

### 2. Python Environment Setup

Create and activate a Python virtual environment:

```bash
python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
```

Install backend and training dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Running Tests

Validate that the test environment works properly:

```bash
pytest
```
