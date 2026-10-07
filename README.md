# Anis Chelly — Portfolio

**[anischelly26.github.io/treasure-hunter](https://anischelly26.github.io/treasure-hunter/)**

One repository, three things published together at that address:

| What | Where it lives | Published at |
| --- | --- | --- |
| **The portfolio** — Next.js, one continuous WebGL shader world, eight project scenes, case studies | [`site/`](./site/) | `/` , `/work/…`, `/resume/` |
| **Live demos** — the real things, runnable | `aura/`, `form-studio/`, `padelvision/`, `zero-eclipse/`, `here/` | `/aura/`, `/form-studio/`, `/padelvision/`, `/zero-eclipse/`, `/here/` |
| **The classic site** — the earlier ANIS.EXE interface with its terminal, in-card project tests, ratings and the playable Treasure Hunter | repository root (`classic.html` and its scripts) | `/classic.html` |

The CV question-answering backend in [`rag-api/`](./rag-api/) deploys separately to Render (`render.yaml`).

## Live demos

- **[AURA Music House](https://anischelly26.github.io/treasure-hunter/aura/)** — first-person browser music workstation: nine connected rooms, a timeline table, a working drum machine, synthesizer and mixer, a sampling turntable, Web Audio synthesis and WAV export. [Source](https://github.com/anischelly26/Aura-music-house)
- **[FORM Studio](https://anischelly26.github.io/treasure-hunter/form-studio/)** — the personal 2026 rebuild of the VERMEG internship prototype: edit code, compare responsive previews, save workspaces. No backend or sign-in. [Case study](https://anischelly26.github.io/treasure-hunter/case-studies/form-vision-to-code.html) · [Source](https://github.com/anischelly26/ui-to-html-css-translator)
- **[PadelVision AI](https://anischelly26.github.io/treasure-hunter/padelvision/)** — team movement analysis from a local rally video, in the browser.
- **[ZERO ECLIPSE](https://anischelly26.github.io/treasure-hunter/zero-eclipse/)** — one browser level with the V9 sprites, and the desktop game download. [Source](https://github.com/anischelly26/ZERO-ECLIPSE)
- **[HERE](https://anischelly26.github.io/treasure-hunter/here/)** — need-first matching concept: `NEED → UNDERSTAND → TRUST → MATCH`. See [HERE.md](./HERE.md).
- **Treasure Hunter** — the C/SDL2 platformer adapted to the browser, inside the [classic site](https://anischelly26.github.io/treasure-hunter/classic.html#missions). See [NOTICE-TREASURE-HUNTER.md](./NOTICE-TREASURE-HUNTER.md).

The portfolio lists these in its **Live demos** section and links each one from its project scene and case study.

## Documented case studies

[Orange XAI portal](./case-studies/orange-xai-portal.md) · [Monoprix data centralization](./case-studies/monoprix-data-centralization.md) · [PadelVision](./case-studies/padelvision.md) · [Hidden Markov weather analysis](./case-studies/hmm-weather-analysis.md) · [FORM — Vision to Code](./case-studies/form-vision-to-code.md) · [Study-abroad AI](./case-studies/study-abroad-ai.md)

## Working on the portfolio

```bash
cd site
npm install
npm run dev          # http://localhost:3000
```

Content is in `site/src/content/`; see [`site/README.md`](./site/README.md) for how the shader world, scroll engine and transitions fit together.

## How it is published

Every push to `main` runs [`verify-portfolio.yml`](./.github/workflows/verify-portfolio.yml), and only a passing run is deployed:

1. FORM is checked out at the revision pinned in `form-studio/source.json` and built in demo mode; AURA is built from the revision pinned in `aura/source.json`.
2. The portfolio in `site/` is linted and exported as static files for the `/treasure-hunter` base path.
3. Chromium checks run against the classic page, the FORM case study and the FORM demo (editing, persistence, safe downloads, backup/import, no API requests, 390px layout), and the shared ratings service.
4. Everything is staged into `_site/` — tracked public files, the two demo builds, and the portfolio export on top as the site root.
5. The staged site is checked the way GitHub Pages serves it: home page, all eight project scenes, the index, every hosted demo link, a case study, the résumé, the classic page and the 390px layout.

A failing check blocks publication; the previous site stays online.

To reproduce the pipeline locally:

```bash
# once: check out the pinned sources next to this repo's files
git clone https://github.com/anischelly26/ui-to-html-css-translator .form-source   # then: git -C .form-source checkout <ref from form-studio/source.json>
git clone https://github.com/anischelly26/Aura-music-house .aura-source            # then: git -C .aura-source checkout <ref from aura/source.json>

npm --prefix .form-source/web ci && npm --prefix .form-source/web run build:demo && node qa/build-demo.mjs
npm --prefix .aura-source ci && npm --prefix .aura-source run build && node qa/build-aura.mjs
npm ci --prefix site && (cd site && node scripts/build-pages.mjs treasure-hunter)

npm ci --prefix qa && npx --prefix qa playwright install chromium
npm test --prefix qa            # classic page, FORM case study, FORM demo
node qa/stage-site.mjs          # → _site/
node qa/verify-site.mjs         # the staged site, as Pages serves it
node qa/preview.mjs             # http://127.0.0.1:4173/treasure-hunter/
```

## Shared project ratings (classic site)

The classic page's project cards offer anonymous 1–5 star ratings, stored in a Cloudflare D1 database through the companion [ratings service](https://anis-project-ratings.rhythmx.chatgpt.site). Local storage holds only a random browser identifier. The service accepts writes from the public portfolio origin and validates scores, projects and request size, with rate limits.

## FORM verification

The FORM case study uses actual application screenshots from a passing Chromium workflow. 39 Python tests, 14 workspace tests and 4 Chromium journeys passed on 30 September 2026. [CI evidence](https://github.com/anischelly26/ui-to-html-css-translator/actions/runs/36707003245). Live Ollama generation and production scale remain unverified.
