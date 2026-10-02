# Dataset Analysis Report: PhiUSIIL Phishing URL Dataset

This document provides the exploratory data analysis and feature selection strategy for PhishGuard based on `data/raw/PhiUSIIL_Phishing_URL_Dataset.csv`.

## 1. Dataset Overview

- **File Path**: `data/raw/PhiUSIIL_Phishing_URL_Dataset.csv`
- **Total Rows**: `235,795`
- **Total Columns**: `55`
- **Missing Values**: `0` (100% complete across all fields)
- **Duplicate Rows**: `0` full row duplicates; `425` duplicate URL string instances.
- **Class Distribution**:
  - `1` (Legitimate): `134,850` (~57.19%)
  - `0` (Phishing): `100,945` (~42.81%)

---

## 2. Answers to Architectural Questions

### 1. What is the target column?
The target column is `label`.
- `0`: Phishing URL
- `1`: Legitimate URL

### 2. Which columns should be used for training?
For Version 1 of PhishGuard, training will focus strictly on **lexical and structural URL features** extracted directly from the URL string.

### 3. Should the URL column itself be used?
No, the raw `URL` string column itself will not be used directly as a tabular numeric feature. Instead, deterministic feature extraction routines will extract numerical and boolean structural properties (such as length, character counts, ratios, domain attributes, and protocol indicators) from the raw URL.

### 4. Which columns should be excluded?
The following columns are excluded from Version 1 training:

1. **Raw String Identifiers**:
   - `URL`, `Domain`, `TLD`, `Title` (raw text strings and high-cardinality metadata).
2. **Dataset-Level Statistical / Leakage Probabilities**:
   - `TLDLegitimateProb`, `URLSimilarityIndex`, `URLCharProb` (pre-computed over the entire dataset, causing data leakage if used directly).
3. **Web HTML & Dynamic Crawl Features (28 features)**:
   - `LineOfCode`, `LargestLineLength`, `HasTitle`, `DomainTitleMatchScore`, `URLTitleMatchScore`, `HasFavicon`, `Robots`, `IsResponsive`, `NoOfURLRedirect`, `NoOfSelfRedirect`, `HasDescription`, `NoOfPopup`, `NoOfiFrame`, `HasExternalFormSubmit`, `HasSocialNet`, `HasSubmitButton`, `HasHiddenFields`, `HasPasswordField`, `Bank`, `Pay`, `Crypto`, `HasCopyrightInfo`, `NoOfImage`, `NoOfCSS`, `NoOfJS`, `NoOfSelfRef`, `NoOfEmptyRef`, `NoOfExternalRef`.
   - *Rationale*: Requiring active network fetching or DOM parsing during real-time inference introduces security risks, high latency, and brittleness when target phishing sites are offline.

### 5. Is additional feature engineering needed?
Yes. A standalone, deterministic feature extraction module (`training/feature_extractor.py`) must be implemented to transform any raw input URL string into the exact 18-feature numerical vector expected by the trained model during both training and real-time inference.

### 6. Recommended Feature Set for Version 1

The recommended 18-feature lexical set for Version 1 model training includes:

1. `URLLength`
2. `DomainLength`
3. `IsDomainIP`
4. `TLDLength`
5. `NoOfSubDomain`
6. `HasObfuscation`
7. `NoOfObfuscatedChar`
8. `ObfuscationRatio`
9. `NoOfLettersInURL`
10. `LetterRatioInURL`
11. `NoOfDegitsInURL`
12. `DegitRatioInURL`
13. `NoOfEqualsInURL`
14. `NoOfQMarkInURL`
15. `NoOfAmpersandInURL`
16. `NoOfOtherSpecialCharsInURL`
17. `SpacialCharRatioInURL`
18. `IsHTTPS`
