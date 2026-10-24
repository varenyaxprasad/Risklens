# RiskLens

RiskLens is a credit-risk application. It gives a default-risk estimate for a loan applicant, shows which factors pushed the estimate up or down, and includes an assistant that answers credit-risk questions from a local knowledge base and names its sources.

> RiskLens gives estimates for information only. It is not a lending decision, and it never claims that a person will default.

## Contents

- [Project overview](#project-overview)
- [Quick start](#quick-start)
- [Part 1: RAG Pipeline](#part-1-risklens-rag-pipeline)
- [Part 2: Machine learning](#part-2-machine-learning)
- [Part 3: Web application](#part-3-web-application)
- [Troubleshooting](#troubleshooting)
- [Current status](#current-status)
- [Credits](#credits)

## Project overview

| Part | What it does |
|---|---|
| RAG pipeline | Answers credit-risk questions from documents in `data/knowledge/` using local embeddings, ChromaDB and Gemini |
| Machine learning | Loan default data exploration and cleaning, and the default-risk model trained by the ML team |
| FastAPI engine (`api/`) | Exposes the RAG pipeline and the prediction function over HTTP |
| Express server (`server/`) | API layer between the website and the Python engine |
| Website (`web-admin/`) | Landing page, sample login, dashboard, Assess form with a factor chart, and the Assistant chat |

### Architecture

```
Browser (React, port 5173)
        |
        v
Express server (port 5000)     validation, forwarding, error handling
        |
        v
FastAPI engine (port 8000)     RAG + prediction function
        |
        +--> ChromaDB + local embeddings + Gemini   (assistant)
        +--> src/ml/predict.py                      (risk estimate, demo stub until the model is added)
```

### Tech stack

- **Website:** React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, TanStack Router, Recharts, Motion
- **API layer:** Node.js, Express
- **Engine:** Python, FastAPI, Uvicorn
- **RAG:** LangChain, Sentence Transformers (`all-MiniLM-L6-v2`), ChromaDB, Gemini, PyPDF
- **ML libraries in `requirements.txt`:** pandas, scikit-learn, imbalanced-learn, XGBoost, SHAP

### Project structure

```
Risklens/
  api/
    main.py              FastAPI app: /api/chat, /api/predict, /api/health
    predict_stub.py      Demo prediction used until src/ml/predict.py exists
  server/
    index.js             Express app that forwards requests to FastAPI
  web-admin/             React website
    src/
      features/
        landing/         Landing page, login page, scroll and hover effects
        risklens/        Dashboard, Assess, Assistant, top navigation
      routes/            File-based routes (TanStack Router)
      lib/
        risklens-api.ts  Fetch helpers for the Express API
        demo-auth.ts     Sample login for demonstration
  src/
    rag/
      ingest.py              Loads and splits documents
      build_vectorstore.py   Builds the ChromaDB vector store
      query_rag.py           answer_question() and a terminal chat
    (data exploration and cleaning scripts: explorer.py, clean_data.py)
  data/
    knowledge/           Text and PDF documents for the assistant
    chroma_db/           Generated vector database (not committed)
    raw/                 Raw dataset (not committed)
    processed/           Cleaned dataset (not committed)
  tests/
    test_rag.py
  requirements.txt
  README.md
```

## Quick start

Prerequisites: Git, Python 3.12, Node.js 20 or later, pnpm (`npm install -g pnpm`), and a Gemini API key from Google AI Studio.

**1. Get the code**

```bash
git clone https://github.com/varenyaxprasad/Risklens.git
cd Risklens
git checkout feature/web
```

Skip the `checkout` line once the branch is merged into `main`.

**2. Python environment (repo root)**

Windows (PowerShell):
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

If activation is blocked by an execution policy error, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once and try again.

Mac or Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Then, on any system:
```bash
pip install -r requirements.txt
pip install fastapi
```

`requirements.txt` skips `uvloop` on Windows, because that package does not support Windows.

**3. Add your API key**

Create a `.env` file in the repo root:
```
GOOGLE_API_KEY=your_key_here
```

**4. Build the vector database** (the first run downloads the embedding model, so it takes a minute)

```bash
python src/rag/ingest.py
python src/rag/build_vectorstore.py
```

**5. Run the three servers** (three terminals)

Terminal 1, Python engine (repo root, venv active):
```bash
uvicorn api.main:app --reload --port 8000
```

Terminal 2, Express server:
```bash
cd server
npm install
node index.js
```

Terminal 3, website:
```bash
cd web-admin
pnpm install
pnpm run dev
```

If pnpm stops with `ERR_PNPM_IGNORED_BUILDS`, run `pnpm approve-builds`, select `esbuild`, then run `pnpm install` again.

**6. Open the app**

Go to `http://localhost:5173`. Sample login: `demo@risklens.com` / `risklens123`.

---

## Part 1: RiskLens RAG Pipeline

RiskLens includes a retrieval-augmented generation (RAG) pipeline for answering credit-risk questions using a local knowledge base.

### Components

- LangChain for document processing and model integration
- Sentence Transformers for local text embeddings
- ChromaDB for vector storage and semantic retrieval
- Gemini for context-grounded answer generation
- PyPDF for extracting text from PDF documents

### Knowledge Base

Place `.txt` and text-based `.pdf` documents in:

`data/knowledge/`

### Run the Pipeline

Activate the virtual environment:

```bash
source .venv/bin/activate
```

On Windows (PowerShell), use `.venv\Scripts\Activate.ps1` instead.

Load and split documents:

```bash
python src/rag/ingest.py
```

Build the vector database:

```bash
python src/rag/build_vectorstore.py
```

Ask questions:

```bash
python src/rag/query_rag.py
```

The website uses the same logic through `answer_question()` in `src/rag/query_rag.py`.

### Run Tests

```bash
python -m pytest tests/test_rag.py -v
```

### Configuration and Data Safety

Set `GOOGLE_API_KEY` in a local `.env` file.
Never commit API keys, private documents, raw datasets,
processed datasets, or the generated ChromaDB database.

The RAG component explains information from retrieved documents.
It does not itself predict loan defaults.

---

## Part 2: Machine learning

The ML work uses the loan default dataset (`Loan_default.csv`, target column `Default`, values 0 or 1).

- `explorer.py` prints the dataset's shape, columns, types, missing values, duplicates and summaries.
- `clean_data.py` strips whitespace, validates the target column, and saves the cleaned data to `data/processed/Loan_default_cleaned.csv`.
- The raw and processed data folders are not committed.

### Connecting the trained model to the website

The engine looks for `src/ml/predict.py`. If it is missing, it uses `api/predict_stub.py`, and the website shows a demo-data badge.

To connect a trained model, add `src/ml/predict.py` with this function:

```python
def predict_default(features: dict) -> dict:
    return {
        "probability": 0.27,
        "risk_level": "Low",
        "top_factors": [
            {"feature": "CreditScore", "impact": -0.12},
            {"feature": "DTIRatio", "impact": 0.08},
        ],
    }
```

A positive `impact` raises default risk and a negative one lowers it. Restart FastAPI after adding the file. The dashboard badge then changes from "demo model" to "trained model".

Keep the trained model file out of Git unless the team agrees on how to share it.

**The Assess form fields must match the model's input columns.** The form currently uses these provisional fields, which should be updated to the real column names and allowed values:

`Age`, `Income`, `LoanAmount`, `CreditScore`, `MonthsEmployed`, `NumCreditLines`, `InterestRate`, `LoanTerm`, `DTIRatio`, `Education`, `EmploymentType`, `MaritalStatus`, `HasMortgage`, `HasDependents`, `LoanPurpose`, `HasCoSigner`

They are defined in the `fields` array in `web-admin/src/features/risklens/assess.tsx`.

---

## Part 3: Web application

### Pages

| Page | Path | Purpose |
|---|---|---|
| Landing | `/` | Overview of RiskLens, with animated sections and a sample result |
| Login | `/login` | Sample login for demonstration |
| Dashboard | `/dashboard` | Welcome page and a live status check of the engine and model |
| Assess | `/assess` | Applicant form, risk estimate and a chart of the top factors |
| Assistant | `/assistant` | Credit-risk chat with sources |

Flow: landing page, then **Login**, then the dashboard. Logged-out visitors who open `/dashboard`, `/assess` or `/assistant` are sent to the login page, and **Log out** in the top bar returns to the landing page.

The website uses animations (scroll reveal, drifting backgrounds, count-up result) and mouse-hover effects (a spotlight that follows the cursor on feature cards, lift and scale on buttons). Animations respect the system's reduced-motion setting.

### Sample login

**Email:** `demo@risklens.com`  **Password:** `risklens123`

The login is for demonstration only. The credentials are stored in the front-end code (`web-admin/src/lib/demo-auth.ts`), so it provides no real security. Replace it with real authentication (for example Express, MongoDB, hashed passwords and tokens) before any real use.

### Configuration

Optional: `web-admin/.env` can set the API address (default is `http://localhost:5000`):
```
VITE_API_URL=http://localhost:5000
```

Keep the Gemini key in the root `.env` on the Python side only. Never put it in the website code.

### API reference

The website calls the Express server, which forwards to FastAPI. Both expose the same routes.

**`POST /api/chat`**

Request:
```json
{ "question": "What is debt-to-income ratio?" }
```
Response:
```json
{ "answer": "...", "sources": ["credit_risk.txt"] }
```
An empty question returns `400`.

**`POST /api/predict`**

Request: a JSON object with the applicant's fields (see the Assess form).

Response:
```json
{
  "probability": 0.27,
  "risk_level": "Low",
  "top_factors": [
    { "feature": "CreditScore", "impact": -0.12 },
    { "feature": "DTIRatio", "impact": 0.08 }
  ],
  "mock": true
}
```
`mock: true` appears only while the demo stub is in use.

**`GET /api/health`**

```json
{ "status": "ok", "model": "demo" }
```
`model` is `trained` once `src/ml/predict.py` exists, and `demo` while the stub is active.

---

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| `uvloop does not support Windows` during `pip install` | Use the `requirements.txt` from this repo, where `uvloop` is skipped on Windows |
| `ModuleNotFoundError: src` when starting FastAPI | Run `uvicorn` from the repo root, and check that `src/__init__.py` and `src/rag/__init__.py` exist |
| `Attribute "app" not found in module "api.main"` | `api/main.py` is empty or unsaved |
| Assistant says it could not reach the server | Express (port 5000) or FastAPI (port 8000) is not running |
| Answers fail or are empty | `.env` is missing or the key is wrong, or the vector database was not built |
| Dashboard shows "Engine offline" | FastAPI is not running, or Express was not restarted after adding `/api/health` |
| `ERR_PNPM_IGNORED_BUILDS` | Run `pnpm approve-builds`, select `esbuild`, then `pnpm install` |
| Blank page or missing-route error after adding files | Restart `pnpm run dev` so the route list regenerates |
| Gemini "model not found" error | Check the current model name in Google AI Studio and update `query_rag.py` |

## Current status

Working:
- RAG pipeline with a terminal chat and an HTTP endpoint
- FastAPI engine, Express API layer and the full website flow: landing, login, dashboard, Assess, Assistant
- Sample login with route protection and log out
- Animated landing page with scroll effects and mouse-hover effects

In progress or planned:
- Connect the trained ML model through `src/ml/predict.py`
- Match the Assess form fields to the model's real input columns
- Add more documents to `data/knowledge/` (it currently holds one short file)
- Replace the sample login with real authentication if needed
- Remove unused pages left over from the dashboard template (tasks, users, settings, auth, errors)

## Credits

- Dashboard base: [shadcn-admin](https://github.com/satnaing/shadcn-admin) by satnaing (MIT license)
- UI components: [shadcn/ui](https://ui.shadcn.com)
- Animations: [Motion](https://motion.dev)
