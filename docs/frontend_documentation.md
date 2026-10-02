# Frontend Application Documentation

This document describes the Next.js, TypeScript, Tailwind CSS, and Shadcn UI-inspired frontend architecture for PhishGuard matching the design specification in `docs/ui-reference.png`.

---

## 1. Architecture & Project Structure

The frontend is built using Next.js 14+ with App Router, TypeScript, and Tailwind CSS:

```text
frontend/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── src/
    ├── app/
    │   ├── globals.css          # Glassmorphism styling and gauge glow effects
    │   ├── layout.tsx           # Root HTML layout and typography metadata
    │   └── page.tsx             # Main dashboard page
    ├── components/
    │   ├── Header.tsx           # Navigation header with shield branding & user menu
    │   ├── HeroSearch.tsx       # Hero section with URL input and glowing submit button
    │   ├── RiskScoreCard.tsx    # Circular SVG gauge, risk score, confidence & explanation
    │   ├── UrlDetailsCard.tsx   # Analyzed URL, HTTPS status, domain name & scan latency
    │   ├── RiskIndicatorsCard.tsx # Risk indicators list with status indicators & arrows
    │   └── RecommendationsCard.tsx # Callout box with action status & security tips
    └── services/
        └── api.ts               # Fetch client for FastAPI POST /predict endpoint
```

---

## 2. Design System & Aesthetics

The UI matches `docs/ui-reference.png` with a dark glassmorphic palette:

- **Background Color**: `#080C14` (deep midnight navy)
- **Glass Card Fill**: `rgba(15, 23, 42, 0.75)` with `backdrop-filter: blur(16px)`
- **Borders**: `1px solid rgba(255, 255, 255, 0.08)`
- **Accent Gradients**:
  - Hero text: `linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)`
  - Button glow: `linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)`
- **Classification Badges**:
  - `SAFE`: Emerald Green (`#10B981`)
  - `SUSPICIOUS`: Amber Yellow (`#F59E0B`)
  - `DANGER`: Red (`#EF4444`)

---

## 3. Backend Integration

The frontend connects directly to the local FastAPI backend endpoint:

- **API Endpoint**: `POST http://127.0.0.1:8000/predict`
- **Request Format**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response Handling**: Updates `RiskScoreCard`, `UrlDetailsCard`, `RiskIndicatorsCard`, and `RecommendationsCard` dynamically upon successful API response.

---

## 4. Running the Development Server

1. Enter the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access the web dashboard at `http://localhost:3000`.
