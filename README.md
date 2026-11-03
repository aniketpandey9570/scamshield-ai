# ScamShield AI — Your AI-Powered Scam Detection Assistant

> **"Think Before You Click."**  
> An explainable cybersecurity decision-support web application that analyzes suspicious SMS messages, WhatsApp chats, emails, job offers, payment requests, and screenshot images to detect social engineering and fraud indicators before financial or personal data compromise occurs.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture & How It Works](#-architecture--how-it-works)
5. [Project Folder Structure](#-project-folder-structure)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup (macOS)](#-installation--setup-macos)
8. [Starting the Application](#-starting-the-application)
9. [Operating Modes (AI vs. Rule-Based Fallback)](#-operating-modes-ai-vs-rule-based-fallback)
10. [Automated Testing & Regression Verification](#-automated-testing--regression-verification)
11. [Live Demo Guide (For College Presentation)](#-live-demo-guide-for-college-presentation)
12. [API Endpoints & Schema](#-api-endpoints--schema)
13. [Privacy & Security Architecture](#-privacy--security-architecture)
14. [Limitations & Ethical Boundaries](#-limitations--ethical-boundaries)
15. [College Presentation Pitch (Speech Script)](#-college-presentation-pitch-speech-script)

---

## 🎯 Project Objective

Digital scams in India and globally cause billions in losses every year. Victims are often trapped through high-pressure tactics, fake KYC alerts, lottery claims, fraudulent work-from-home job registrations, and remote-access software requests.

**ScamShield AI** is designed to provide immediate, explainable, and accessible risk evaluation for any pasted message or uploaded screenshot without requiring accounts, sign-ups, or sending user data to persistent cloud databases.

It classifies messages into four standardized risk bands:
- **LOW** (Score 1–24): No obvious warning signs detected.
- **MEDIUM** (Score 25–49): Moderate caution required due to isolated indicators.
- **HIGH** (Score 50–74): Multiple red flags such as coercive deadlines or advance fees.
- **CRITICAL** (Score 75–100): Severe fraud signals (e.g., direct OTP requests, fake banking suspension threats, or remote desktop app installations).

> **Important:** ScamShield AI provides a risk assessment, not a mathematical guarantee that a message is genuine or fraudulent.

---

## ✨ Key Features

- **Dual-Engine Detection**: Seamlessly operates in either **AI Model Mode** (Google Gemini with multimodal screenshot analysis) or an **Expert Heuristic Rule Engine** when no API key is provided.
- **Picture / Screenshot Analysis**: Upload suspicious screenshots (WhatsApp chats, fake bank SMS alerts, fraudulent job flyers). Supports multimodal vision AI and contextual heuristic verification.
- **Context-Aware False-Positive Mitigation**: Prevents false alarms on normal business phrases like "delivered within 2-3 business days", "thank you for shopping", or appointment reminders.
- **Explainable Evidence Extraction**: Quotes the exact suspicious phrases from the submitted message and explains in simple English *why* they were flagged.
- **Interactive Evidence Inspector**: Highlights detected warning signs directly within the submitted text.
- **Calibrated Risk Gauge**: Dynamic semi-circular SVG meter displaying score (0–100) and risk tier with color coding (Green / Amber / Orange / Red).
- **"What Should You Do Next?" Action Plan**: Tailored, step-by-step safety recommendations for the specific detected threats.
- **One-Click Export**:
  - **Copy Report**: Copies a formatted Markdown/text report to clipboard.
  - **Download Report**: Saves a timestamped `.txt` report file.
- **6 Realistic Preloaded Demo Samples & Screenshots**: Test fake bank KYC, job advance fee scams, lottery scams, tech support Trojans, phishing resets, and legitimate delivery alerts without needing real spam.
- **Zero Cloud Storage & Privacy-First**:
  - No messages stored on the backend.
  - Device history and metrics stored strictly in the user's browser `localStorage`.
  - Privacy toggle to disable or wipe device history at any time.
- **Emergency Incident Help**: Direct guidance for Indian cyber authorities, including the **National Cybercrime Helpline 1930** and **[cybercrime.gov.in](https://cybercrime.gov.in)**.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite.
- **Styling**: Tailwind CSS (Dark Navy Cybersecurity theme `#0a0f1d`, cyan `#06b6d4`, violet `#8b5cf6`).
- **Icons**: Lucide React.
- **State & Storage**: React hooks + Browser `localStorage`.

### Backend
- **Framework**: Python 3.10+ / 3.14 with FastAPI.
- **Validation**: Pydantic v2.
- **Server**: Uvicorn.
- **HTTP Client**: HTTPX (async client with timeout safeguards).
- **Rate Limiting**: Sliding window in-memory limiter (30 requests/min per IP).
- **Configuration**: `python-dotenv` for local `.env` variables.

---

## 🏛️ Architecture & How It Works

```
                               ┌────────────────────────────────┐
                               │   React Frontend (Vite: 5173)  │
                               │  - Modern Dark Navy UI         │
                               │  - Text & Screenshot Modes     │
                               │  - Interactive Evidence View   │
                               │  - Local Browser History       │
                               └───────────────┬────────────────┘
                                               │
                                 POST /api/analyze (JSON)
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │     FastAPI Backend (:8000)    │
                               │  - Pydantic Request Validation │
                               │  - In-Memory Rate Limiting     │
                               │  - CORS Middleware             │
                               └───────────────┬────────────────┘
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         │                                           │
                API Key Configured?                                  │
                         │                                           │
                YES ┌────┴─────┐                                NO ┌─┴────────────┐
                    │          │                                   │              │
                    ▼          ▼                                   ▼              ▼
           Google Gemini    OpenAI / Compatible          Heuristic Pattern Engine v1.1
         (Vision & Text)                                 - Context-Aware Word Boundaries
         (Anti-Injection)                                - No False Alarms on Business Terms
                                                         - Credential & Upfront Fee Traps
                                                         - Composite Risk Scoring (1-98)
```

---

## 📁 Project Folder Structure

```
scam_shield/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── ai_service.py       # Configurable LLM service with vision support
│   │   ├── analyzer.py         # Heuristic rule-based fallback detection engine v1.1
│   │   ├── main.py             # FastAPI endpoints, rate limiting, and CORS
│   │   ├── sample_data.py      # 6 preloaded realistic test samples
│   │   └── schemas.py          # Pydantic v2 validation models
│   ├── tests/
│   │   ├── test_false_positives.py # 5 required regression test cases
│   │   ├── test_api.py             # FastAPI async integration test suite
│   │   └── test_backend.py         # Heuristic engine unit test suite
│   ├── .env.example            # Template for environment configuration
│   ├── .gitignore              # Ignores .env and python venv
│   ├── requirements.txt        # Backend dependencies
│   └── venv/                   # Python virtual environment
├── frontend/
│   ├── public/
│   │   └── shield.svg          # Favicon shield logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── AboutModal.jsx      # Technical overview modal
│   │   │   ├── Analyzer.jsx        # Text & screenshot input card
│   │   │   ├── ComparisonView.jsx  # Interactive text highlighter
│   │   │   ├── DeviceStats.jsx     # Browser-session activity metrics
│   │   │   ├── Footer.jsx          # Disclaimer & cyber resources
│   │   │   ├── Hero.jsx            # Tagline, value propositions, CTA
│   │   │   ├── HistorySection.jsx  # Local storage history manager
│   │   │   ├── Navbar.jsx          # Logo, status pill, privacy badge
│   │   │   ├── ResultCard.jsx      # Risk score gauge, findings & action plan
│   │   │   ├── RiskGauge.jsx       # SVG semi-circular speedometer
│   │   │   ├── SafetyTips.jsx      # 9 rules & "If Scammed" emergency checklist
│   │   │   └── Toast.jsx           # Notification alerts
│   │   ├── data/
│   │   │   └── sampleMessages.js   # Client-side sample backup
│   │   ├── services/
│   │   │   └── api.js              # REST client for backend communication
│   │   ├── utils/
│   │   │   ├── exportReport.js     # Formatted report generation & download
│   │   │   └── storage.js          # LocalStorage CRUD & privacy toggle
│   │   ├── App.jsx                 # Master application controller
│   │   ├── index.css               # Tailwind & custom scrollbar styles
│   │   └── main.jsx                # React root mount
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 💻 Prerequisites

Ensure you have the following installed on your Mac:
- **Node.js**: version 18.0 or higher (`node -v`)
- **Python**: version 3.10 or higher (`python3 --version`)
- **Terminal** (macOS zsh / bash)

---

## ⚡ Starting the Application

To run ScamShield AI locally, open **two separate Terminal windows**:

### Terminal 1: Start Backend (FastAPI)
```bash
cd /Users/aniketpandey/nptel/scam_shield/backend
./venv/bin/uvicorn app.main:app --reload --port 8000
```
*(Backend will start on `http://127.0.0.1:8000`)*

### Terminal 2: Start Frontend (React + Vite)
```bash
cd /Users/aniketpandey/nptel/scam_shield/frontend
npm run dev
```
*(Frontend will start on `http://localhost:5173`)*

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🧪 Automated Testing & Regression Verification

Run the automated test suites inside `backend/`:

```bash
cd backend

# 1. Test False-Positive Mitigation & 5 Core Cases
./venv/bin/python tests/test_false_positives.py

# 2. Test Heuristic Engine Samples
./venv/bin/python tests/test_backend.py

# 3. Test FastAPI Integration & Image Upload
./venv/bin/python tests/test_api.py
```

All 5 core cases pass:
- **Case A (Normal Delivery)**: `"Hi! Your order has been shipped and will be delivered within 2–3 business days. Thank you for shopping with us!"` -> **LOW (Score: 12, Findings: 0)**.
- **Case B (Appointment)**: `"Your appointment is confirmed for tomorrow at 10 AM. We look forward to seeing you."` -> **LOW**.
- **Case C (Suspicious Job Fee)**: `"You are selected for a job. Pay ₹999 as a registration fee immediately to confirm your position."` -> **CRITICAL (Score: 80)**.
- **Case D (Suspicious OTP)**: `"Your bank account will be blocked. Send your OTP and ATM PIN immediately."` -> **CRITICAL (Score: 90)**.
- **Case E (Uncertain Message)**: `"Please contact our support team regarding your account."` -> **LOW**.

---

## ⚙️ Operating Modes (AI vs. Rule-Based Fallback)

ScamShield AI works **100% out of the box without requiring any API key**.

| Mode | Configuration | Status Badge | How It Works |
| :--- | :--- | :--- | :--- |
| **Rule-Based Engine (Default)** | No API key in `.env` | `Heuristic Engine` (Green dot) | Instant pattern extraction using regex, threat scoring, and evidence highlighting. Works offline. |
| **AI Model Mode (Optional)** | Add `GEMINI_API_KEY` to `backend/.env` | `AI Model Active` (Green dot) | Uses Google Gemini (`gemini-1.5-flash`) for semantic and visual multimodal threat analysis. |

---

## 🎓 Live Demo Guide (For College Presentation)

1. **Open the App**:
   Navigate to `http://localhost:5173`. Show the dark navy cybersecurity UI, "Privacy First" badge, and live backend connection pill.

2. **Test False-Positive Prevention (Case A)**:
   - Paste: `"Hi! Your order has been shipped and will be delivered within 2–3 business days. Thank you for shopping with us!"`
   - Click **"Analyze Message"**.
   - Show that it evaluates to **LOW (Score: 12/100, 0 findings)**, with the ethical disclaimer: *"No obvious warning signs were detected. This does not guarantee that the message is legitimate."*

3. **Test Picture / Screenshot Scam Inspection**:
   - Click the **"Upload Picture / Screenshot"** tab.
   - Click **"📱 Fake Bank Alert Screenshot"** (loads sample bank KYC alert).
   - Click **"Analyze Picture / Screenshot"**.
   - Show the detected warning signs and the visual screenshot badge!

4. **Test Critical Threat Scenarios**:
   - In "Try a Sample", select **"Fake Bank KYC & OTP Demand"** or **"Work-from-Home Job with Advance Fee"**.
   - Show risk scores (80–98 / 100), quoted evidence, and "What should you do next?".

---

## 🔒 Privacy & Security Architecture

1. **No Backend Persistence**: The FastAPI backend does not connect to any database; submitted messages and images are processed in memory and released immediately.
2. **Sanitized Logs**: Server logs record character lengths and image presence flags only, never the message content or personal details.
3. **CORS Whitelist**: Access is restricted to `localhost:5173` and configured domains.
4. **Rate Limiting**: Integrated in-memory sliding window limiter (30 requests/minute per client IP).

---

## 🎙️ College Presentation Pitch (Speech Script)

> *"Good morning, Professor. Today I am presenting **ScamShield AI**, an intelligent cybersecurity assistant designed to address digital fraud, phishing, and social engineering in India and worldwide.*
>
> *Unlike naive keyword blockers that falsely flag normal messages like 'Your order has been shipped and will be delivered within 2-3 business days', ScamShield AI uses context-aware detection. It evaluates compound threat signals—such as urgency combined with OTP demands or upfront registration fees.*
>
> *Additionally, ScamShield AI includes a **Screenshot & Picture Inspection Section** allowing users to upload screenshots of suspicious WhatsApp chats or bank alerts for visual risk assessment.*
>
> *It runs on a dual-engine architecture with full offline heuristic capability and multimodal AI vision when configured, all built on a Privacy-First architecture.*
>
> *Let me demonstrate with a live test case..."*
