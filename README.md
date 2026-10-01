# ANIS.EXE

Interactive portfolio / recruiter experience for **Anis Chelly**.

## HERE / Human Intelligence Network

**HERE** is a need-first AI product concept that interprets a human request, evaluates contextual trust and risk, and ranks people by explainable fit instead of popularity.

**[▶ OPEN HERE LIVE DEMO](https://anischelly26.github.io/treasure-hunter/here/)**  
**[VIEW HERE SOURCE / DEMO FILES](./here/)**

`NEED → UNDERSTAND → TRUST → MATCH`

---

This is intentionally not a conventional portfolio. It behaves more like a software system / game interface:

- cinematic boot sequence
- animated particle field and cursor light
- mission-based project navigation
- AI × software engineering positioning
- responsive mobile layout
- interactive terminal
- recruiter-friendly project playground with project name, description, test purpose and source level
- source-backed project tests instead of generic animations
- playable Treasure Hunter browser adaptation based on the public C/SDL2 team source

## Selected missions

- **AURA Music House** — first-person browser music workstation with nine connected rooms, editable MIDI, Web Audio synthesis, a mixer, WAV export, seven guided lessons and a living-room console game. [Try live](https://aura-music-studio.rhythmx.chatgpt.site) · [Source](https://github.com/anischelly26/Aura-music-house)

- **FORM — Vision to Code Studio** — personal 2026 rebuild of the VERMEG internship prototype: React/TypeScript, FastAPI, editable OCR, responsive previews, persistent workspaces and sanitized HTML/CSS exports. [Live demo](https://anischelly26.github.io/treasure-hunter/form-studio/) · [Case study](https://anischelly26.github.io/treasure-hunter/case-studies/form-vision-to-code.html) · [Source](https://github.com/anischelly26/ui-to-html-css-translator)
- **Orange Digital Center × MedTech** — Internship & PFE Management Portal with Explainable AI shortlisting
- **ZERO: ECLIPSE** — cinematic 2D action adventure game focused on gameplay systems, AI behaviors, combat mechanics and custom game architecture.
- **Monoprix** — Sales Data Centralization and Python-driven database import automation
- **HERE — Human Intelligence Network** — need interpretation, contextual trust/risk modeling and explainable human matching.
- **Hidden Markov Weather Analysis** — Gaussian HMM, Baum-Welch, Viterbi, AIC/BIC model selection and forecasting
- **Barcelona & Dubai Market Explorer** — in-progress cross-market property analytics MVP with normalized pricing, geospatial signals and interactive comparisons.
- **PadelVision AI** — computer-vision sports coaching prototype
- **ML Pipeline** — distributed ingest → clean → train → explain workflow with FastAPI, Supabase, Hugging Face Spaces and Vercel.
- **Treasure Hunter** — C/SDL2 platform game with four levels, spike hazards, crab enemies, health/combat logic and a final shark boss.
- **VeriPath AI** — study-abroad discovery and decision-support system

## FORM verification

**[Try the FORM interactive demo](https://anischelly26.github.io/treasure-hunter/form-studio/)** — edit code, compare responsive previews, save workspaces, import/export backups and download protected HTML. No backend or sign-in is needed. Screenshot OCR, element correction, model generation and sanitized ZIP export require the full local/Docker app.

The FORM case study uses actual application screenshots from a passing Chromium workflow. 39 Python tests, 14 workspace tests and 4 Chromium journeys passed on 30 September 2026. [CI evidence](https://github.com/anischelly26/ui-to-html-css-translator/actions/runs/36707003245). Live Ollama generation and production scale remain unverified.

## Shared project ratings

All 12 project cards offer anonymous 1–5 star ratings, with shared averages and vote counts stored in a Cloudflare D1 database through the companion [ratings service](https://anis-project-ratings.rhythmx.chatgpt.site). A browser can change its existing vote for each project. Local storage holds only a random browser identifier; clearing it or using another browser creates a new identity. Votes persist independently of GitHub Pages deployments. The service accepts writes from the public portfolio origin and validates scores, projects and request size, with rate limits.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

## Deployment

The repository includes a GitHub Pages deployment workflow.

Publishing checks out the exact FORM revision pinned in `form-studio/source.json` and builds its React app in demo mode. Chromium journeys check the case study and live demo, including editing, persistence, safe downloads, backup/import, absence of API requests and the 390px layout. Only the verified site artifact is deployed; a failing check blocks publication. Generated bundles are not maintained as a second source code copy.

To prepare a local demo from your FORM checkout, run its `npm --prefix web run build:demo`, then `node qa/build-demo.mjs /path/to/ui-to-html-css-translator` in this repository. Install browser checks with `npm ci --prefix qa` and `npx --prefix qa playwright install chromium`, then run `npm test --prefix qa`.

---

**ANIS.EXE // AI × SOFTWARE ENGINEERING // BUILD 2026**
