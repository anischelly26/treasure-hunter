# FORM — Vision to Code Studio

**Origin:** VERMEG internship, July–August 2024.  
**Current work:** personal product rebuild, September 2026.  
[Visual case study](https://anischelly26.github.io/treasure-hunter/case-studies/form-vision-to-code.html) · [Source and setup](https://github.com/anischelly26/ui-to-html-css-translator)

The initial screenshot-to-code prototype became a studio for reviewing and refining reconstructions. The 2026 rebuild adds a React/TypeScript frontend, typed FastAPI service and shared CLI pipeline.

## Product workflow

1. Upload, drop or paste a PNG, JPEG or WebP screenshot.
2. Inspect source overlays and searchable detected elements; correct text, type and colors.
3. Compare the source with responsive HTML/CSS previews and edit the generated code.
4. Continue through IndexedDB autosave and validated JSON backups; Undo restores code, elements and baseline together.
5. Export a sanitized HTML/CSS ZIP from the Python service.

The editable sample workspace is explicitly labeled. OCR confidence measures text recognition, not screenshot fidelity. Reconstruction is heuristic and cannot recover an application's original business logic, assets or interactions.

## Engineering decisions

- One page-level Tesseract pass and bounded geometric inference reduce repeated OCR work.
- Typed request/response models, upload byte and pixel limits, bounded jobs and timeouts keep processing controlled.
- A shared CLI/API pipeline avoids parallel implementations of detection and generation.
- Operator-key, origin and host checks protect the local deployment model. Previews are sandboxed; exports sanitize HTML/CSS and exclude scripts and remote resources.
- Explicit workspace snapshots, autosave cancellation on deletion, validated imports and stale-preview guards improve reliability.
- A locked frontend dependency tree and an unprivileged production Docker image make setup reproducible.

## Verified on 30 September 2026

| Check | Result |
| --- | --- |
| Python regression suite | 39 passing tests |
| Workspace regression suite | 14 passing tests |
| Chromium user journeys | 4 passing journeys |
| Real upload → OCR → correction → full Undo → ZIP | Passed |
| Autosave, reload, deletion and recovery | Passed |
| Valid/invalid backups and offline editing | Passed |
| 390px viewport | No horizontal page overflow in the checked journey |
| Production Docker | Built, started, health verified, runtime UID 10001 |
| Ruff and TypeScript/Vite | Passed |

[Exact verified CI run](https://github.com/anischelly26/ui-to-html-css-translator/actions/runs/36707003245) on revision `30f8c2043b821a9538683ba4b68159ad7ea3c01e`. The screenshots in this portfolio are real captures from that workflow. Production frontend assets measured approximately 87.9 KB gzip JavaScript and 6.9 KB gzip CSS.

## Current limits

The complete application runs locally or in Docker; this portfolio page is a static case study. The backend is a bounded single-process studio for a trusted operator. Live Ollama generation, physical devices, Safari/Firefox, full accessibility compliance and production load remain unverified. Public multi-user hosting would require identity, tenant isolation and durable distributed jobs.
