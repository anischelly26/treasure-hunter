# ASK_ANIS — CV RAG API

Recruiter-facing Retrieval-Augmented Generation backend for ANIS.EXE.

## Architecture

```text
Recruiter question
      ↓
sentence-transformers/all-MiniLM-L6-v2
      ↓
384-dimensional query vector
      ↓
cosine similarity against indexed CV chunks
      ↓
Top-K relevant CV passages
      ↓
Grok 4.5 Responses API
      ↓
grounded recruiter answer + CV source labels
```

The design is inspired by the retrieval flow in `adam12bT/quiz-with-rag`, but replaces the heavier HuggingFace/PyTorch + Chroma + Ollama stack with FastEmbed/ONNX in-memory vectors and Grok generation for a lighter Render deployment.

## Privacy

The public knowledge base intentionally excludes Anis's phone number and precise home address. The chatbot can return only the public MedTech email and GitHub profile for contact questions.

## Local run

```bash
cd rag-api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export XAI_API_KEY="your-key"
uvicorn main:app --reload
```

Open:

- `http://127.0.0.1:8000/health`
- POST `http://127.0.0.1:8000/ask` with `{ "question": "What did Anis build at Vermeg?" }`

## Deploy on Render

A Blueprint is already defined in the repository root as `render.yaml`.

1. In Render, choose **New → Blueprint**.
2. Connect the GitHub repository `anischelly26/treasure-hunter`.
3. Render reads `render.yaml` and creates the `anischelly26-cv-rag` web service with `rag-api` as its root directory.
4. When prompted for `XAI_API_KEY`, paste your xAI API key. Never commit the key to GitHub.
5. Deploy.
6. Verify `/health` returns `grok_configured: true`.

The frontend currently targets:

```text
https://anischelly26-cv-rag.onrender.com
```

If Render assigns another URL, change `DEFAULT_API_URL` at the top of `rag.js`.

## Production controls

- CORS restricted to `https://anischelly26.github.io`
- 500-character question limit
- per-IP public-demo rate limiting
- semantic similarity threshold before generation
- strict CV-only Grok system prompt
- retrieved CV source labels returned with each answer
- no Grok/API secret exposed in browser JavaScript

## Optional future upgrade

The API already contains a path for native xAI Collections RAG. If an `XAI_COLLECTION_ID` is configured, Grok can use xAI's `file_search` tool instead of the local MiniLM index. Collection creation/upload requires xAI Collections management permissions.
