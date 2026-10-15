<div align="center">

# 🔒 ResumeForge

### **AI-Powered Resume Analysis — Completely On Your Machine**

*A privacy-first, open-weight AI tool that matches your resume to any job description — no cloud, no data sharing, no subscription.*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange?style=for-the-badge&logo=digitalocean&logoColor=white)](https://hacktoberfest.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Model_Runner-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/desktop/features/model-runner/)

</div>

---

## 📸 Screenshots

> **Demo Screenshots**

| Landing Page | Analyze Page | Results View |
|---|---|---|
| *![alt text](images/image.png) ![alt text](images/image-1.png) ![alt text](images/image-2.png)* | *![alt text](images/image-3.png)* | *![alt text](images/image-4.png) ![alt text](images/image-5.png) ![alt text](images/image-6.png)* |

| History Page | Resume PDF Viewer |
|---|---|
| *![alt text](images/image-7.png)* | *![alt text](images/image-8.png)* |

---

## ✨ Features

### 🧠 Intelligent Analysis
- **Fit Score (0–100)** with strict scoring rubric and honest rationale — the AI is calibrated to never blindly inflate scores
- **Score Explanation** — a 1–2 sentence justification of exactly why that score was given
- **Matching Skills** — skills that appear in both your resume and the job description
- **Missing Skills** — critical requirements from the JD that are absent from your resume
- **Key Strengths** — concrete, experience-backed strengths relevant to the role
- **Areas of Concern** — candid gaps and red flags — no sugarcoating
- **Targeted Section Improvements** — actionable edits referencing real resume sections (Experience, Skills, Summary, Projects, Certifications)
- **High-Priority ATS Keywords** — exact phrases from the JD to add for better Applicant Tracking System screening

### 🔒 Privacy-First Design
- **Zero cloud AI calls** — your resume and job description never leave your machine during analysis
- All inference runs locally via Docker Model Runner using the open-weight **Gemma 3 1B** model
- Resume file binary is stored in your **local MongoDB** instance — not a third-party service

### 📄 Resume PDF Viewer
- After analysis, view the **original PDF rendered inline** in the browser
- Switch between PDF view, extracted text, and the parsed job description
- Expand/collapse, zoom, and copy-to-clipboard controls

### 👤 User Accounts & History
- Secure **Sign Up / Sign In** with hashed passwords (bcrypt)
- Full **analysis history** — browse and re-open past results
- Each analysis stores the resume, job description, score, and detailed breakdown

---

## 🌍 Why Open Innovation Matters

The resume screening and career development industry is dominated by proprietary SaaS platforms that charge subscription fees, store sensitive career data in the cloud, and use closed-source AI models whose decision-making cannot be inspected or challenged.

**This matters for real people:**

- A job seeker in a lower-income country cannot afford a $30/month resume optimization tool.
- A developer applying for roles does not want their resume and work history stored indefinitely on a third party's servers.
- A student with no budget deserves the same quality career feedback as someone paying for a premium service.

**ResumeForge is built on a different model:**

- The AI model — **Gemma 3 (1B)** by Google DeepMind — is fully open-weight and can be run, audited, and modified by anyone.
- The entire application stack (Next.js, MongoDB, Mongoose, NextAuth.js) is open-source.
- There are **no API keys to purchase**, no cloud subscriptions to maintain, and **no data leaves the user's machine** during inference.

Open-source AI tooling democratizes access to career resources. What once required a paid recruiter review or an expensive SaaS subscription can now run entirely on a developer's laptop — free, transparent, and private.

This is why open innovation matters: not just as a technical exercise, but as an act of equity.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | MongoDB 7 (via Docker) + Mongoose ODM |
| **Authentication** | NextAuth.js v5 (Credentials Provider + bcrypt) |
| **Local AI Inference** | [Docker Model Runner](https://docs.docker.com/desktop/features/model-runner/) |
| **AI Model** | `ai/gemma3:1b-q4_K_M` (Gemma 3 1B, 4-bit quantized) |
| **AI Client** | OpenAI SDK (pointed at local DMR endpoint) |
| **Validation** | Zod |
| **PDF Parsing** | `pdfjs-dist` |
| **DOCX Parsing** | `mammoth` |
| **Package Manager** | Bun |

---

## 🚀 Getting Started

### Prerequisites

Before running ResumeForge, make sure you have the following installed:

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (v4.40+ recommended for Docker Model Runner support)
- **[Node.js](https://nodejs.org/)** 20+ or **[Bun](https://bun.sh/)** (recommended)
- **Git**

> ⚠️ **Docker Model Runner** requires Docker Desktop 4.40+ on macOS or Windows. Linux support may vary.

---

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/resumeforge.git
cd resumeforge

# Install dependencies (using Bun — recommended)
bun install

# Or using npm
npm install
```

---

### 2. Environment Variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.example .env.local
```

Then fill in the values:

```env
# MongoDB connection string (matches docker-compose defaults)
MONGODB_URI=mongodb://admin:password123@localhost:27017/resumeforge?authSource=admin

# Docker Model Runner base URL
DMR_BASE_URL=http://localhost:12434/engines/v1

# Model name (Gemma 3 1B, 4-bit quantized)
DMR_MODEL=ai/gemma3:1b-q4_K_M

# NextAuth secret — generate with: openssl rand -base64 32
AUTH_SECRET=your-random-32-char-secret-here
```

> 🔐 **Never commit your `.env.local` file.** It is already in `.gitignore`.

---

### 3. Running MongoDB with Docker

A `docker-compose.yml` is included to spin up a local MongoDB instance with no configuration:

```bash
docker compose up -d
```

This starts a MongoDB 7 container named `resumeforge-mongodb` on port `27017`.

To stop it:

```bash
docker compose down
```

To stop and delete all stored data:

```bash
docker compose down -v
```

---

### 4. Setting Up the AI Model

ResumeForge uses **Docker Model Runner** to run the Gemma 3 1B model locally. Docker Model Runner is built into Docker Desktop and exposes an OpenAI-compatible API endpoint.

**Pull the model:**

```bash
docker model pull ai/gemma3:1b-q4_K_M
```

**Run the model:**

```bash
docker model run ai/gemma3:1b-q4_K_M
```

The model will be available at `http://localhost:12434/engines/v1` — this matches the `DMR_BASE_URL` in your `.env.local`.

> 💡 You can verify the model is running by visiting `http://localhost:12434/engines/v1/models` in your browser.

---

### 5. Starting the Application

```bash
# Development server (with hot reload)
bun run dev

# Or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. **Sign Up** — Create a free account at `/signup`
2. **Sign In** — Log in at `/signin`
3. **Navigate to Analyze** — Go to `/analyze`
4. **Upload your Resume** — PDF or DOCX, up to 5MB
5. **Paste a Job Description** — Copy the full JD from any job board
6. **Click "Run Analysis"** — The local AI analyzes the match and returns results in ~30–120 seconds (depending on your hardware)
7. **Review Your Results** — Explore your fit score, skills breakdown, strengths, weaknesses, improvement suggestions, and ATS keywords
8. **View Analysis History** — All past analyses are saved to `/history`

> ⏱ **First-time inference may take longer** as the model loads into memory. Subsequent runs are significantly faster.

---

## 📁 Project Structure

```
resumeforge/
├── src/
│   ├── app/                          # Next.js App Router pages & API routes
│   │   ├── page.tsx                  # Landing page
│   │   ├── analyze/                  # Resume analysis page
│   │   ├── history/                  # Analysis history + detail pages
│   │   ├── signin/ & signup/         # Authentication pages
│   │   └── api/
│   │       ├── analyze/              # POST: run analysis | GET: list history
│   │       ├── analyze/[id]/         # GET: fetch single analysis result
│   │       ├── resumes/              # POST: upload & parse resume
│   │       ├── resumes/[id]/file/    # GET: serve original resume PDF
│   │       ├── job-descriptions/     # POST: save job description
│   │       └── auth/                 # NextAuth.js handlers + Sign Up
│   ├── components/
│   │   ├── landing/                  # Landing page section components
│   │   ├── AnalysisResults.tsx       # Full analysis display with PDF viewer
│   │   ├── Navbar.tsx / NavLinks.tsx # Navigation with auth-aware links
│   │   ├── ResumeUpload.tsx          # Drag-and-drop resume upload
│   │   ├── JobDescriptionInput.tsx   # JD textarea with character counter
│   │   ├── HistoryTable.tsx          # Past analyses list
│   │   └── ScoreBadge.tsx            # Fit score color badge
│   ├── lib/
│   │   ├── client.ts                 # Docker Model Runner OpenAI client
│   │   ├── prompts.ts                # AI prompt template with scoring rubric
│   │   ├── schemas.ts                # Zod validation schemas
│   │   ├── storage.ts                # MongoDB CRUD helpers (resumes, analyses)
│   │   ├── extract-text.ts           # PDF (pdfjs) + DOCX (mammoth) parsers
│   │   └── mongodb.ts                # Mongoose connection singleton
│   ├── models/
│   │   ├── User.ts                   # Mongoose User schema
│   │   ├── Resume.ts                 # Mongoose Resume schema (with binary)
│   │   ├── JobDescription.ts         # Mongoose JobDescription schema
│   │   └── Analysis.ts               # Mongoose Analysis schema
│   ├── auth.ts                       # NextAuth.js v5 configuration
│   └── proxy.ts                      # Route protection (Next.js Proxy)
├── docker-compose.yml                # MongoDB Docker setup
├── .env.local                        # Environment variables (not committed)
└── README.md
```

---

## ⚙️ How It Works

```
┌─────────────┐     PDF/DOCX     ┌──────────────────┐
│   Browser   │ ───────────────► │  /api/resumes     │
│  (Next.js)  │                  │  pdfjs / mammoth  │
└─────────────┘                  └────────┬─────────┘
      │                                   │ extractedText + binary
      │                                   ▼
      │                          ┌──────────────────┐
      │                          │    MongoDB        │
      │                          │  (localhost)      │
      │                          └────────┬─────────┘
      │                                   │
      │  POST /api/analyze                │ fetch resume
      ▼                                   ▼
┌─────────────────────────────────────────────────────┐
│                /api/analyze                         │
│  1. Load resume text from MongoDB                   │
│  2. Build prompt with scoring rubric                │
│  3. POST to Docker Model Runner (localhost:12434)   │
│  4. Parse + sanitize JSON response                  │
│  5. Save analysis to MongoDB                        │
│  6. Return results to browser                       │
└─────────────────────────────────────────────────────┘
            │                         │
            ▼                         ▼
┌──────────────────┐        ┌──────────────────────┐
│  Docker Model    │        │  Browser renders:    │
│  Runner          │        │  • Fit Score         │
│  Gemma 3 1B      │        │  • Score Rationale   │
│  (local CPU/GPU) │        │  • Skills breakdown  │
└──────────────────┘        │  • PDF Viewer        │
                            └──────────────────────┘
```

**Key design decisions:**
- **OpenAI-compatible API** — The `openai` SDK points at Docker Model Runner's local endpoint, making inference code portable: swap the base URL and model name to use any compatible provider.
- **JSON sanitization** — Small quantized models sometimes emit malformed JSON. The `parseJsonWithFallback` function sanitizes control characters and performs regex-based field recovery before rejecting a response.
- **`Schema.Types.Mixed`** on the `Analysis.analysis` field allows Mongoose to store LLM output as-is, avoiding embedded schema cast errors when the model varies its response structure.

---

## 🔮 Future Improvements

- [ ] **Side-by-side comparison** — Compare two versions of your resume against the same JD
- [ ] **Multi-model support** — Let users choose between Gemma, Phi-3, Llama, and other locally available models
- [ ] **Resume builder suggestions** — Generate a rewritten bullet point directly from improvement suggestions
- [ ] **Export to PDF** — Download a full analysis report as a formatted PDF
- [ ] **Cover letter generation** — Use the analysis to generate a tailored cover letter locally
- [ ] **Job board scraper** — Paste a job board URL and auto-extract the job description
- [ ] **Batch analysis** — Upload multiple resumes and rank them against a single JD (recruiter mode)
- [ ] **Dark mode** — Full system-aware dark mode support

---

## 🙏 Acknowledgments

- **[Google DeepMind](https://deepmind.google/)** — for open-sourcing the [Gemma 3](https://blog.google/technology/developers/gemma-3/) family of models, making local AI inference accessible to everyone
- **[Docker](https://www.docker.com/)** — for [Docker Model Runner](https://docs.docker.com/desktop/features/model-runner/), which makes running open-weight models as simple as `docker model pull`
- **[Vercel](https://vercel.com/)** — for Next.js, which powers the full-stack framework
- **[MongoDB](https://www.mongodb.com/)** — for the flexible document store that handles varying AI output schemas gracefully
- **[NextAuth.js](https://authjs.dev/)** — for the auth layer that keeps user sessions and credentials secure
- **Hacktoberfest 2026** — for creating the Week 2 "Side Hustle" AI challenge that motivated this build

---

## 📄 License


---

<div align="center">

**Built with ❤️ for Hacktoberfest 2026 — Open-Source AI Challenge**

*"The best AI tool is the one you control."*

</div>
