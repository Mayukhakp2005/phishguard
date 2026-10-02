# Data Preprocessing Report

This document details the dataset preprocessing, cleaning, feature filtering, and train/validation/test split procedures for PhishGuard.

## 1. Raw Dataset Summary

- **Source File**: `data/raw/PhiUSIIL_Phishing_URL_Dataset.csv`
- **Rows Before Cleaning**: `235,795`
- **Total Input Features & Columns**: `55`

---

## 2. Data Cleaning & Deduplication

- **Missing Values**: `0` missing values detected across all 55 columns. No missing value imputation was required.
- **Duplicate Rows Removed**: `425` duplicate URL string records were identified and removed.
- **Rows After Cleaning**: `235,370`

---

## 3. Feature Selection Summary

### Retained Features (18 Lexical Features + 1 Target Label)
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
- **Target Label**: `label` (`0` = Phishing, `1` = Legitimate)

### Removed Features (36 Columns)
- **Raw Identifiers (4)**: `URL`, `Domain`, `TLD`, `Title`
- **Dataset Probabilities / Data Leakage Features (3)**: `TLDLegitimateProb`, `URLSimilarityIndex`, `URLCharProb`
- **Web Content & HTML Features (28)**: `LineOfCode`, `LargestLineLength`, `HasTitle`, `DomainTitleMatchScore`, `URLTitleMatchScore`, `HasFavicon`, `Robots`, `IsResponsive`, `NoOfURLRedirect`, `NoOfSelfRedirect`, `HasDescription`, `NoOfPopup`, `NoOfiFrame`, `HasExternalFormSubmit`, `HasSocialNet`, `HasSubmitButton`, `HasHiddenFields`, `HasPasswordField`, `Bank`, `Pay`, `Crypto`, `HasCopyrightInfo`, `NoOfImage`, `NoOfCSS`, `NoOfJS`, `NoOfSelfRef`, `NoOfEmptyRef`, `NoOfExternalRef`

- **Final Feature Count**: `18` predictive features (+ 1 target label column).

---

## 4. Dataset Splitting & Stratification

A **stratified random split** with a fixed seed (`42`) was performed to preserve class proportions across all subsets (57.29% Legitimate / 42.71% Phishing).

| Subset | Percentage | Total Rows | Legitimate (`1`) | Phishing (`0`) | Output File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Train** | `70%` | `164,759` | `94,395` (57.29%) | `70,364` (42.71%) | `data/processed/train.csv` |
| **Validation** | `15%` | `35,305` | `20,227` (57.29%) | `15,078` (42.71%) | `data/processed/val.csv` |
| **Test** | `15%` | `35,306` | `20,228` (57.29%) | `15,078` (42.71%) | `data/processed/test.csv` |
| **Total** | `100%` | `235,370` | `134,850` | `100,520` | — |

---

## 5. Pipeline Reproducibility

The data processing pipeline is implemented in [training/prepare_dataset.py](file:///d:/PhishGuard/phishguard/training/prepare_dataset.py) using pure Python standard library modules (`csv`, `math`, `random`) with zero external dependencies.

To reproduce the processed dataset outputs, execute:

```bash
python training/prepare_dataset.py
```
