import type { StaticImageData } from "next/image";
import { site } from "./site";

import auraLiving from "@/assets/projects/aura-living-room.jpg";
import auraMidnight from "@/assets/projects/aura-midnight.jpg";
import auraDrums from "@/assets/projects/aura-drums.jpg";
import auraCoach from "@/assets/projects/aura-coach.jpg";
import auraArrange from "@/assets/projects/aura-arrange.jpg";
import auraTerrace from "@/assets/projects/aura-terrace.jpg";
import auraConsole from "@/assets/projects/aura-console.jpg";
import padelConcept from "@/assets/projects/padel-concept.webp";
import padelApp from "@/assets/projects/padel-app.png";
import formDark from "@/assets/projects/form-dark.webp";
import formLight from "@/assets/projects/form-light.webp";
import formMobile from "@/assets/projects/form-mobile.webp";
import vermegConcept from "@/assets/projects/vermeg-concept.webp";
import orangeConcept from "@/assets/projects/orange-concept.webp";
import monoprixConcept from "@/assets/projects/monoprix-concept.webp";
import bcnOverview from "@/assets/projects/bcn-overview.jpg";
import bcnVillas from "@/assets/projects/bcn-villas.jpg";
import bcnRoi from "@/assets/projects/bcn-roi.jpg";
import sqlDashboard from "@/assets/projects/sql-dashboard.png";
import eclipseSky from "@/assets/projects/eclipse-sky.png";
import hereConcept from "@/assets/projects/here-concept.webp";
import hmmConcept from "@/assets/projects/hmm-concept.webp";
import mlConcept from "@/assets/projects/ml-pipeline-concept.webp";
import treasure from "@/assets/projects/treasure-hunter.webp";
import veripathConcept from "@/assets/projects/veripath-concept.webp";

export type Shot = {
  src: StaticImageData;
  alt: string;
  /** What the picture is: a capture of the running software, or illustrative artwork. */
  kind: "capture" | "concept";
  caption: string;
  /** Focal point for object-position when the frame crops the picture. */
  focus?: string;
};

export type ArchNode = { label: string; note: string };

export type CaseStudy = {
  role: string;
  context: string;
  problem: string;
  idea: string;
  how: string[];
  architecture: ArchNode[];
  process: string[];
  result: string;
  caveat: string;
  gallery: Shot[];
};

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  num: string;
  name: string;
  /** Display title, one entry per line. */
  title: string[];
  subtitle?: string;
  category: string;
  year: string;
  tech: string[];
  summary: string;
  /** Three-step essence, shown as A → B → C. */
  flow: string[];
  cover: Shot;
  links: ProjectLink[];
  /** Key into the shader world's scene states. */
  world: string;
  layout: "right" | "left" | "rise";
  /** Bespoke stage treatment on the home page. */
  stage?: "aura" | "padel" | "vermeg" | "eclipse" | "sql";
  study: CaseStudy;
};

export type ArchiveProject = {
  slug: string;
  num: string;
  name: string;
  category: string;
  year: string;
  summary: string;
  cover: Shot;
  href: string;
  world: string;
};

const demo = (path: string) => `${site.demos}/${path}`;

export const projects: Project[] = [
  {
    slug: "aura-music-house",
    num: "01",
    name: "AURA Music House",
    title: ["AURA", "MUSIC HOUSE"],
    category: "3D / Music / Web Audio",
    year: "2026",
    tech: ["Three.js", "Web Audio", "Web MIDI", "IndexedDB"],
    summary:
      "A first-person music house where the rooms are the interface. Arrange clips on the coffee-table timeline, play a working drum machine, synthesizer and mixer, sample records on the turntable — and export a real WAV.",
    flow: ["Play", "Arrange", "Mix", "Export"],
    cover: {
      src: auraLiving,
      alt: "AURA's living room: a sunken lounge around the timeline table, the arrangement on the wall and AURA's brass halo above",
      kind: "capture",
      caption: "Actual application — the living room",
    },
    links: [
      { label: "Enter the house", href: demo("aura/") },
      { label: "Source", href: "https://github.com/anischelly26/Aura-music-house" },
    ],
    world: "p-aura",
    layout: "right",
    stage: "aura",
    study: {
      role: "Design and engineering",
      context: "Personal project · v0.5.0",
      problem:
        "A music workstation is usually a wall of panels. One project hides behind dozens of windows, and nothing in the interface tells a beginner where an idea starts or where a song ends.",
      idea: "Make the house the interface. Nine connected rooms lead from an idea to an editable arrangement and a real exported WAV. The coffee table is the timeline: sit down and the arrangement rises into strips you move, trim, copy and loop by hand. The wall behind it shows the whole song.",
      how: [
        "One project, one transport and one audio engine sit behind every room. The house owns no audio graph — a knob turned on the desk, a step lit on the phone and a note drawn in the piano roll are the same edit.",
        "Sixteen synthesized voices and eleven drum voices, all native Web Audio. Nothing is a sampled instrument.",
        "Eight insert processors — EQ, compressor, delay, saturation, chorus, tremolo, high-pass, stereo width — run identically in playback and offline render.",
        "A worker wakes a 180 ms lookahead scheduler every 25 ms. Notes use AudioContext time; visuals read measurements separately.",
        "AURA, the brass halo above the table, teaches by rule on the device: five hands-on lessons where every step waits for your hands and is a real, undoable edit.",
        "Delivery is real: 16/24-bit WAV at 44.1/48 kHz, aligned stems as a ZIP, standard MIDI, and the editable project.",
      ],
      architecture: [
        { label: "The house", note: "Three.js world — rooms, instruments, the phone" },
        { label: "Presentation adapter", note: "Same state and commands the precise editor uses" },
        { label: "Project", note: "Schema, validation, 50-snapshot undo history" },
        { label: "Audio engine", note: "Synthesis, scheduling, inserts, routing" },
        { label: "Offline render", note: "WAV, stems, MIDI through the same graph" },
        { label: "Storage", note: "IndexedDB sessions, checkpoints, portable .aura files" },
      ],
      process: [
        "The audio engine, project format and editors came first, as a precise workstation (0.4.2).",
        "A written audit on 1 October 2026 documented its defects, repairs and measurements.",
        "Version 0.5.0 rebuilt the house around that engine without touching the audio graph.",
        "Scenario scripts drive the house in headless Chrome with real pointer, keyboard and touch events — every lesson, every phone app, every seat, five skies, four graphics presets.",
      ],
      result:
        "Twenty-three Node tests and ten OfflineAudioContext checks cover project logic, routing, PCM encoding, MIDI and render correctness. On the development laptop's integrated Intel UHD graphics, Auto selects Medium and the house ran between about 60 and 110 frames per second depending on the room.",
      caveat:
        "Measured on one machine; no frame-rate guarantee is made. Physical iOS and Android devices remain unverified, and nothing here claims professional mastering or accessibility conformance. Furniture models come from supplied FBX packs with no licence manifest.",
      gallery: [
        { src: auraMidnight, alt: "The living room at midnight with the arrangement glowing on the wall", kind: "capture", caption: "Midnight — the same room, another sky" },
        { src: auraDrums, alt: "Focused view of the drum machine with its pads and step row", kind: "capture", caption: "Drum machine — working pads and sixteen steps" },
        { src: auraArrange, alt: "The timeline table with arrangement strips raised above it", kind: "capture", caption: "The coffee table is the timeline" },
        { src: auraCoach, alt: "AURA's guided lesson interface", kind: "capture", caption: "AURA school — lessons that wait for your hands" },
        { src: auraTerrace, alt: "The terrace at sunset, where projects are exported", kind: "capture", caption: "The terrace — export WAV, stems, MIDI" },
        { src: auraConsole, alt: "Sundown Rally being played on the living-room wall", kind: "capture", caption: "Sundown Rally on the wall console" },
      ],
    },
  },
  {
    slug: "padelvision-ai",
    num: "02",
    name: "PadelVision AI",
    title: ["PADELVISION", "AI"],
    category: "Computer Vision / Sports AI",
    year: "2026",
    tech: ["MediaPipe Pose", "JavaScript", "Python", "Streamlit"],
    summary:
      "Reads a padel pair from a fixed-camera rally. Two teammates are tracked by pose, their net positioning and coordinated movement measured, and practice cues linked back to those measurements.",
    flow: ["Pair", "Position", "Practice"],
    cover: {
      src: padelConcept,
      alt: "Illustrative artwork of padel players with pose tracking lines; the demo does not track the ball",
      kind: "concept",
      caption: "Concept image — the demo tracks poses, not the ball",
    },
    links: [
      { label: "Open the application", href: demo("padelvision/") },
      { label: "Python source", href: "https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai" },
    ],
    world: "p-padel",
    layout: "left",
    stage: "padel",
    study: {
      role: "Design, engineering, research",
      context: "Personal R&D project",
      problem:
        "Padel partners need to review how they move together across a rally, not just one player's stroke. Which moments did the pair advance, stay deep, or split?",
      idea: "A browser tool that accepts a local 3–90 second video, asks which side of the net is yours, and measures the pair: coverage, time together near the net, depth difference. The original frames stay available for a coach. No account, no server upload, no made-up accuracy score.",
      how: [
        "The browser decodes the video and samples up to two frames per second.",
        "A pretrained MediaPipe Pose Landmarker detects up to four people per frame.",
        "Two players on the chosen court half are selected and associated across frames by nearest previous foot position.",
        "Screen-space depth and separation produce pair coverage, together-near-net share and depth difference.",
        "Transparent rules turn measurements into practice cues to test, and the session exports as JSON with optional coach annotations.",
      ],
      architecture: [
        { label: "Local rally", note: "3–90 s video, never uploaded" },
        { label: "Video decoder", note: "Up to 2 sampled frames per second" },
        { label: "Pose landmarker", note: "MediaPipe, up to four people" },
        { label: "Pair selection", note: "Two players on the chosen court half" },
        { label: "Association", note: "Nearest previous foot position" },
        { label: "Measurements", note: "Coverage, depth, separation" },
        { label: "Review", note: "Cues, dual skeletons, JSON export" },
      ],
      process: [
        "Started as a Python/Streamlit project on individual stroke and movement references (v0.1 → v0.5).",
        "The team-movement mode was rebuilt as a static browser application so no video leaves the device.",
        "A training script consumes coach-labelled exports, requires independent match groups and compares against a baseline before saving a research candidate.",
      ],
      result:
        "A working browser application and an honest research status: the body-pose model is pretrained, and no team-fault or best-strategy model has been trained. No labelled team dataset or candidate weights ship.",
      caveat:
        "Single-camera positions are not calibrated court coordinates. Feet must be visible, and identities may switch when teammates cross. Real tactical advice needs ball, racket and opponent context, outcomes and several qualified coach labels.",
      gallery: [
        { src: padelApp, alt: "The PadelVision team movement application: Read the pair. Train the movement.", kind: "capture", caption: "Actual application — team movement studio" },
        { src: padelConcept, alt: "Illustrative artwork of padel players with pose tracking lines", kind: "concept", caption: "Concept image — illustrative" },
      ],
    },
  },
  {
    slug: "vermeg-ai-vision",
    num: "03",
    name: "Vermeg AI Vision",
    title: ["VERMEG", "AI VISION"],
    subtitle: "FORM — Vision to Code Studio",
    category: "OCR / Vision to Code",
    year: "2024 → 2026",
    tech: ["React", "TypeScript", "FastAPI", "OpenCV", "Tesseract", "Docker"],
    summary:
      "A screenshot holds pixels, not structure. What began as a Vermeg internship prototype is now FORM: a studio that turns a screenshot into a workspace you can inspect, correct, preview and export.",
    flow: ["Reconstruct", "Refine", "Export"],
    cover: {
      src: formDark,
      alt: "FORM studio: reconstructed interface, responsive preview and the detected-element inspector",
      kind: "capture",
      caption: "Actual application — 2026 rebuild",
      focus: "50% 0%",
    },
    links: [
      { label: "Try the studio", href: demo("form-studio/") },
      { label: "Visual case study", href: demo("case-studies/form-vision-to-code.html") },
      { label: "Source", href: "https://github.com/anischelly26/ui-to-html-css-translator" },
      { label: "Verified CI run", href: "https://github.com/anischelly26/ui-to-html-css-translator/actions/runs/36707003245" },
    ],
    world: "p-vermeg",
    layout: "rise",
    stage: "vermeg",
    study: {
      role: "AI intern, then solo rebuild",
      context: "Vermeg internship, July–August 2024 · Personal rebuild, September 2026",
      problem:
        "A screenshot contains pixels, not reusable structure. Generated markup also needs review, correction, and a reliable place to continue working.",
      idea: "Stop treating screenshot-to-code as a one-shot generator. Build a studio around it: detected elements you can search and correct, source overlays, responsive previews beside the original, an editor, and a clean export.",
      how: [
        "Upload, drop or paste a PNG, JPEG or WebP screenshot.",
        "One page-level Tesseract pass plus bounded geometric inference produce detected elements with text, type and colour.",
        "Inspect source overlays, correct what the OCR got wrong, and compare the source with responsive HTML/CSS previews.",
        "IndexedDB autosave and validated JSON backups keep the work; Undo restores code, elements and baseline together.",
        "The Python service exports a sanitized HTML/CSS ZIP — no scripts, no remote resources.",
      ],
      architecture: [
        { label: "Screenshot", note: "PNG, JPEG or WebP — byte and pixel limits" },
        { label: "Image processing", note: "OpenCV, bounded worker jobs" },
        { label: "OCR", note: "One page-level Tesseract pass" },
        { label: "Element model", note: "Typed request and response models" },
        { label: "FastAPI service", note: "Shared CLI/API pipeline, timeouts" },
        { label: "React studio", note: "Inspect, correct, preview, edit" },
        { label: "Export", note: "Sanitized HTML/CSS ZIP" },
      ],
      process: [
        "2024, at Vermeg: a Python prototype with OpenCV, Tesseract, LLaVA and Ollama, using CLAHE and binarization for low-contrast text.",
        "2026: rebuilt as FORM with a React/TypeScript frontend, a typed FastAPI backend and a shared CLI pipeline, so detection and generation are implemented once.",
        "Operator-key, origin and host checks protect the local deployment; previews are sandboxed.",
        "A locked dependency tree and an unprivileged Docker image make setup reproducible.",
      ],
      result:
        "57 checks passed on 30 September 2026: 39 Python tests, 14 workspace tests and 4 Chromium journeys. The production Docker runtime and the real upload → OCR → correction → Undo → ZIP flow were verified. Frontend assets measure about 87.9 KB gzip JavaScript and 6.9 KB gzip CSS.",
      caveat:
        "A local, single-operator studio. Live Ollama generation, production load, physical devices and full accessibility compliance remain unverified. OCR confidence measures text recognition, not visual fidelity. The 2026 rebuild is separate from the original Vermeg internship.",
      gallery: [
        { src: formLight, alt: "FORM studio in its light theme", kind: "capture", caption: "Light theme — the same workspace" },
        { src: formMobile, alt: "FORM studio at a 390 pixel viewport", kind: "capture", caption: "390 px — no horizontal overflow" },
        { src: vermegConcept, alt: "Concept artwork: a document becoming extracted, structured data", kind: "concept", caption: "Concept image — sample data" },
      ],
    },
  },
  {
    slug: "orange-xai-portal",
    num: "04",
    name: "Orange XAI Portal",
    title: ["ORANGE", "XAI PORTAL"],
    category: "Explainable AI / Full Stack",
    year: "2025 — 26",
    tech: ["React", "Node.js", "Express", "MongoDB", "Azure"],
    summary:
      "An internship and PFE management portal where candidate shortlisting comes with a reason a coordinator can inspect. Team project with Orange Digital Center and MedTech.",
    flow: ["CV", "Match", "Explain"],
    cover: {
      src: orangeConcept,
      alt: "Concept artwork for the Orange explainable AI portal; illustrative match scores shown",
      kind: "concept",
      caption: "Concept image — sample data",
    },
    links: [
      { label: "Documented case study", href: "https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/orange-xai-portal.md" },
    ],
    world: "p-orange",
    layout: "right",
    study: {
      role: "Data preparation, backend and system logic",
      context: "Orange Digital Center × MedTech · Senior team project · Team of six",
      problem:
        "Internship and PFE recruitment becomes slow and hard to justify when CVs, applications, supervisor assignments and evaluations live in separate workflows. A ranking also needs an explanation a coordinator can inspect.",
      idea: "Automate the workflow without turning candidate ranking into a black box. The matching module is decision support: skill extraction and ranking assist a human coordinator rather than making the final call.",
      how: [
        "Coordinators publish internship and PFE offers; students apply and upload a CV.",
        "CVs are parsed and skills extracted, then matched against each offer.",
        "Candidates are ranked, and every ranking carries a human-readable explanation.",
        "Supervisors are assigned, milestones tracked and evaluations managed in the same portal.",
      ],
      architecture: [
        { label: "Students · Coordinators · Supervisors", note: "Three roles, one portal" },
        { label: "React portal", note: "Offers, applications, tracking" },
        { label: "Express API", note: "Node.js services" },
        { label: "CV parsing", note: "Skill extraction" },
        { label: "Matching and ranking", note: "Skill-to-offer fit" },
        { label: "Explanation", note: "Why this candidate, in words" },
        { label: "Human decision", note: "The coordinator decides" },
      ],
      process: [
        "Specified as a modern web architecture: React, Node.js, Express and MongoDB, targeting a Microsoft Azure environment.",
        "Delivered with Agile/Scrum across a six-person team.",
        "My part: data preparation, backend and system logic, across the CV-matching and application-management scope.",
      ],
      result:
        "The team developed an internship and PFE portal project covering application management and explainable matching. No production adoption or hiring-impact metrics are claimed.",
      caveat:
        "Shared work, not sole authorship. Team: Asma Gannar, Eya Bedoui, Fares Anas, Adem Bouaccida, Skander Bouricha and Anis Chelly.",
      gallery: [],
    },
  },
  {
    slug: "monoprix-data-pipeline",
    num: "05",
    name: "Monoprix Data Pipeline",
    title: ["MONOPRIX", "DATA PIPELINE"],
    category: "Data Engineering",
    year: "2024",
    tech: ["Python", "MySQL", "SQL Server", "XAMPP"],
    summary:
      "Sales information from many stores, centralized. A relational model for stores, products, time and transactions, and Python imports that replace repetitive manual handling.",
    flow: ["Files", "Import", "Database"],
    cover: {
      src: monoprixConcept,
      alt: "Concept artwork for the Monoprix data pipeline; illustrative dashboard shown",
      kind: "concept",
      caption: "Concept image — sample data",
    },
    links: [
      { label: "Documented case study", href: "https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/monoprix-data-centralization.md" },
    ],
    world: "p-monoprix",
    layout: "left",
    study: {
      role: "Data management intern",
      context: "Monoprix Headquarters, Tunis · July 2024",
      problem:
        "Daily sales information from multiple stores needed a structured, centralized database and a repeatable path from external files into it.",
      idea: "One consistent foundation for sales data: a relational structure that organizes store, product, time and transaction information, fed by scripts instead of by hand.",
      how: [
        "Designed a centralized sales-data structure in MySQL.",
        "Wrote Python scripts that import external-file data into the database.",
        "Organized product, store, time and transaction information to reduce redundancy.",
        "Kept integrity and consistency in view during import and storage.",
      ],
      architecture: [
        { label: "Store sales files", note: "External files, many stores" },
        { label: "Python import", note: "Automated, repeatable" },
        { label: "Structure checks", note: "Integrity and consistency" },
        { label: "MySQL", note: "Stores · products · time · transactions" },
        { label: "Queries", note: "Centralized, faster access" },
      ],
      process: [
        "The main challenge was moving external-file data into the correct database structure and connecting the Python workflow to the database environment.",
        "Worked with MySQL and SQL Server concepts and tooling throughout the internship.",
      ],
      result:
        "A practical import and centralization workflow that reduces repetitive manual handling and makes sales information more accessible — a working pipeline rather than a theoretical database exercise.",
      caveat: "Commercial data is not exposed. No invented time savings or throughput figures are included.",
      gallery: [],
    },
  },
  {
    slug: "barcelona-dubai-market-explorer",
    num: "06",
    name: "Barcelona–Dubai Market Explorer",
    title: ["BARCELONA–DUBAI", "MARKET EXPLORER"],
    category: "Data / Geospatial / Full Stack",
    year: "2026",
    tech: ["Next.js", "TypeScript", "FastAPI", "PostGIS", "Leaflet", "Docker"],
    summary:
      "Two property markets on one normalized data layer. AED becomes EUR, square feet become square metres, and Barcelona and Dubai can finally be compared in the same sentence.",
    flow: ["Ingest", "Normalize", "Compare"],
    cover: {
      src: bcnOverview,
      alt: "Market Explorer dashboard comparing Barcelona and Dubai median prices per square metre",
      kind: "capture",
      caption: "Actual application — public demo data",
      focus: "50% 0%",
    },
    links: [
      { label: "Source", href: "https://github.com/anischelly26/barcelona-dubai-market-explorer" },
      { label: "Hosted dashboard", href: "https://barcelona-dubai-market-explorer.rhythmx.chatgpt.site" },
    ],
    world: "p-bcn",
    layout: "rise",
    study: {
      role: "Full-stack and data engineering",
      context: "Personal project · Engineering demonstration",
      problem:
        "Property portals represent price, currency, floor area and location differently. Comparing markets takes more than a chart: the data has to be collected with permission, validated, normalized, kept historically, and queried by geography.",
      idea: "Normalize both cities into one geospatial data model, expose comparative analytics through an API, and keep every assumption visible in the interface — including when the data is a demo set.",
      how: [
        "A rate-limited adapter framework ingests only from explicitly permitted sources.",
        "Normalization converts AED to EUR and sqft to sqm, validates each record and computes comparable metrics such as EUR/m² and rental yield.",
        "PostgreSQL with PostGIS stores neighbourhood boundaries, property coordinates, append-only price snapshots and dated FX rates.",
        "FastAPI serves filtering, summaries, monthly trends, radius search with ST_DWithin and an ROI scenario calculator.",
        "A Next.js dashboard with two Leaflet maps falls back to a clearly labelled demo dataset if the API is unavailable.",
      ],
      architecture: [
        { label: "Permitted sources", note: "No CAPTCHA or auth bypass, by design" },
        { label: "Rate-limited adapters", note: "Timeouts, bounded retries, declared agent" },
        { label: "Validation + normalization", note: "AED→EUR, sqft→sqm, fingerprints" },
        { label: "PostgreSQL + PostGIS", note: "Spatial indexes, append-only snapshots" },
        { label: "FastAPI", note: "Filters, trends, radius search, ROI" },
        { label: "Next.js dashboard", note: "Maps, comparisons, explicit fallback" },
      ],
      process: [
        "Source-specific extraction is separated from the normalized domain model: a connector produces raw listings, the normalization service does the rest.",
        "Duplicates are prevented by source name and external ID; snapshots are append-only.",
        "CI runs linting, type checks, frontend and backend tests, and builds both production containers.",
      ],
      result:
        "The pipeline runs end to end with Docker Compose: dashboard, API documentation and health check, initialized with a small deterministic dataset.",
      caveat:
        "A portfolio and engineering demonstration. The included records are synthetic or curated examples and are not investment advice. The hosted dashboard may require sign-in.",
      gallery: [
        { src: bcnVillas, alt: "Market Explorer filtered to villas with both city maps", kind: "capture", caption: "Filtered view — both markets, one scale" },
        { src: bcnRoi, alt: "Market Explorer analytics and ROI calculator", kind: "capture", caption: "Analytics and the ROI scenario calculator" },
      ],
    },
  },
  {
    slug: "sql-explanation-grader",
    num: "07",
    name: "SQL Explanation Grader",
    title: ["SQL EXPLANATION", "GRADER"],
    category: "LLM Evaluation",
    year: "2026",
    tech: ["Python", "Ollama", "qwen2.5", "SQLite"],
    summary:
      "One local model explains a SQL query in plain language; a second judges the explanation against a labelling guide. A measurement harness, so that changing a prompt is an experiment rather than a guess.",
    flow: ["Explain", "Judge", "Measure"],
    cover: {
      src: sqlDashboard,
      alt: "SQL Explanation Grader live dashboard: 30 of 50 explanations judged good on the dev split, against a 30 percent baseline",
      kind: "capture",
      caption: "Actual dashboard — v2 prompt, dev split",
      focus: "50% 0%",
    },
    links: [{ label: "Source", href: "https://github.com/anischelly26/sql-explanation-grader" }],
    world: "p-sql",
    layout: "left",
    stage: "sql",
    study: {
      role: "Shared repository",
      context: "Collaborative project · Local models only",
      problem:
        "Asking a model to explain SQL is easy. Knowing whether the explanation is correct, complete and clear — across a whole dataset, every time the prompt changes — is the actual problem.",
      idea: "Treat explanation quality as something to measure. A generator model writes the explanation, a judge model labels it good or bad against a written guide, and every run lands in a results file a dashboard reads live.",
      how: [
        "A dataset of 166 SQLite SELECT queries is split into 50 development and 116 test items; every item parses and passes EXPLAIN.",
        "A generator model, run locally through Ollama, writes a plain-language explanation from the schema and the query.",
        "A judge model labels each explanation good only if it is correct, complete and clear.",
        "Each row records the explanation, the binary score, the judge's reason, latency and token counts. Crashed runs resume where they stopped.",
        "A live dashboard reads the results files and shows accuracy against the baseline.",
      ],
      architecture: [
        { label: "Dataset", note: "166 SQLite queries, 70 rejected generations logged" },
        { label: "Validation", note: "Every item passes EXPLAIN" },
        { label: "Generator", note: "Local model via Ollama, versioned prompt" },
        { label: "Judge", note: "Second model + labelling guide" },
        { label: "Results", note: "JSONL — score, reason, latency, tokens" },
        { label: "Dashboard", note: "Live accuracy against baseline" },
      ],
      process: [
        "Prompt v1 was a single instruction: explain the query for a non-technical reader.",
        "Prompt v2 became a ten-step checklist covering columns, filters, joins, subqueries, aggregates, grouping, window functions, CTEs, CASE and ordering, with a hard rule against leaking SQL keywords.",
        "The judge prompt was split into its own versioned file with richer examples.",
      ],
      result:
        "The v1 baseline scored 15 of 50 on the development split and 36 of 116 on test — about 30 percent on both. With the v2 checklist prompt, the development split reached 30 of 50: 60 percent.",
      caveat:
        "Scores are produced by an LLM judge and vary with model versions and prompts. This is a shared repository; the work is collaborative.",
      gallery: [],
    },
  },
  {
    slug: "zero-eclipse",
    num: "08",
    name: "ZERO ECLIPSE",
    title: ["ZERO", "ECLIPSE"],
    category: "Game / Java",
    year: "2026",
    tech: ["Java 21", "Custom engine", "Game AI"],
    summary:
      "A cinematic 2D action adventure built in Java on a custom game architecture: combat, exploration, a companion that follows and enemies that decide.",
    flow: ["Explore", "Fight", "Escape"],
    cover: {
      src: eclipseSky,
      alt: "ZERO ECLIPSE: the hero Alex and the companion NOVA walking past a ruined gate, drawn with the game's V9 artwork",
      kind: "capture",
      caption: "V9 artwork — layers and sprites from the game",
    },
    links: [
      { label: "Play the browser demo", href: demo("zero-eclipse/") },
      { label: "Download the V9 desktop game", href: demo("zero-eclipse/#desktop") },
      { label: "Source", href: "https://github.com/anischelly26/ZERO-ECLIPSE" },
    ],
    world: "p-eclipse",
    layout: "right",
    stage: "eclipse",
    study: {
      role: "Design and engineering",
      context: "Personal project · V9",
      problem:
        "Game behaviour gets tangled fast. Movement, combat, a companion and enemy decisions all want to own the same character state, and every new mechanic makes the last one harder to change.",
      idea: "Write the architecture, not just the game. A custom Java foundation where movement, companion behaviour and enemy decisions are separate systems that can each grow.",
      how: [
        "A custom Java game architecture — no engine underneath.",
        "Character movement, combat and exploration, with time-based mechanics.",
        "NOVA, a companion with its own behaviour system.",
        "The foundation of an enemy decision system.",
      ],
      architecture: [
        { label: "Game loop", note: "Custom Java architecture" },
        { label: "Movement", note: "Overhauled in V9" },
        { label: "Combat", note: "Combat systems" },
        { label: "Companion", note: "NOVA's behaviour system" },
        { label: "Enemy decisions", note: "Decision-system foundation" },
        { label: "Release", note: "Java 21 JAR, SHA-256 verified" },
      ],
      process: [
        "V9 introduced the AI and movement overhaul: character movement improvements, the companion behaviour system and a cleaner, expandable architecture.",
        "The browser demo is a short JavaScript adaptation using the V9 artwork — one level, three fragments, three enemies, a following NOVA and touch controls.",
        "The desktop download joins two release parts in the browser and verifies the SHA-256 before offering the file.",
      ],
      result:
        "A playable Java 21 desktop game, published byte-for-byte identical to the V9 JAR, plus a browser adaptation that runs with no build step.",
      caveat:
        "The browser demo is not the full Java game and does not include all its AI systems.",
      gallery: [],
    },
  },
];

export const archive: ArchiveProject[] = [
  {
    slug: "here",
    num: "09",
    name: "HERE — Human Intelligence Network",
    category: "Product AI / Matching",
    year: "2026",
    summary:
      "A need-first AI product concept: it interprets a human request, weighs contextual trust and risk, and ranks people by explainable fit instead of popularity.",
    cover: { src: hereConcept, alt: "Concept artwork of a human matching network with need and trust signals", kind: "concept", caption: "Concept image" },
    href: demo("here/"),
    world: "a-here",
  },
  {
    slug: "veripath-ai",
    num: "10",
    name: "VeriPath AI",
    category: "Recommender / EdTech",
    year: "2026",
    summary: "Transparent study-abroad discovery and ranking — a decision-support system built in Python and Streamlit.",
    cover: { src: veripathConcept, alt: "Concept artwork of study-abroad paths and explainable academic fit cards", kind: "concept", caption: "Concept image" },
    href: "https://github.com/anischelly26/anischelly26/tree/main/projects/veripath-ai",
    world: "a-veripath",
  },
  {
    slug: "hmm-weather",
    num: "11",
    name: "Hidden Markov Weather Analysis",
    category: "Probabilistic ML",
    year: "2025",
    summary:
      "A Gaussian HMM that infers hidden weather states from temperature, with Baum-Welch training, Viterbi decoding and AIC/BIC model selection. With Youssef Mani.",
    cover: { src: hmmConcept, alt: "Concept artwork showing weather states linked in a Hidden Markov Model", kind: "concept", caption: "Concept image" },
    href: "https://github.com/anischelly26/treasure-hunter/blob/main/case-studies/hmm-weather-analysis.md",
    world: "a-hmm",
  },
  {
    slug: "ml-pipeline",
    num: "12",
    name: "Distributed ML Pipeline",
    category: "MLOps / Collaboration",
    year: "2026",
    summary: "A multi-stage ingest → clean → train → explain workflow with FastAPI, Supabase and Hugging Face Spaces. Collaborative fork.",
    cover: { src: mlConcept, alt: "Concept artwork of connected ingestion, cleaning, training and explanation modules", kind: "concept", caption: "Concept image" },
    href: "https://github.com/anischelly26/ml_pipeline",
    world: "a-ml",
  },
  {
    slug: "treasure-hunter",
    num: "13",
    name: "Treasure Hunter",
    category: "Game / C + SDL2",
    year: "2025",
    summary: "A team-built C/SDL2 platformer: four levels, spike hazards, crab enemies, health and combat logic, and a final shark boss.",
    cover: { src: treasure, alt: "Treasure Hunter, a pixel-art platform game", kind: "capture", caption: "Team project" },
    href: demo("classic.html#missions"),
    world: "a-treasure",
  },
];

/** Something a visitor can run right now. */
export type Demo = {
  /** Set when the demo belongs to one of the eight featured projects. */
  slug?: string;
  name: string;
  what: string;
  needs: string;
  href: string;
  world: string;
};

export const demos: Demo[] = [
  {
    slug: "aura-music-house",
    name: "AURA Music House",
    what: "Walk the nine rooms, play the drum machine, synthesizer and mixer, and export a real WAV.",
    needs: "In the browser · WebGL 2",
    href: demo("aura/"),
    world: "p-aura",
  },
  {
    slug: "vermeg-ai-vision",
    name: "FORM Studio",
    what: "Edit the HTML and CSS, compare responsive previews, save workspaces. No backend, no sign-in.",
    needs: "In the browser",
    href: demo("form-studio/"),
    world: "p-vermeg",
  },
  {
    slug: "padelvision-ai",
    name: "PadelVision AI",
    what: "Give it a 3–90 second rally video. Poses are analysed on your device; nothing is uploaded.",
    needs: "In the browser · bring a video",
    href: demo("padelvision/"),
    world: "p-padel",
  },
  {
    slug: "zero-eclipse",
    name: "ZERO ECLIPSE",
    what: "Play one level with the V9 sprites, then download the full desktop game.",
    needs: "In the browser · desktop build needs Java 21",
    href: demo("zero-eclipse/"),
    world: "p-eclipse",
  },
  {
    name: "HERE",
    what: "Describe a need in your own words; see the intent, the risk and an explained match.",
    needs: "In the browser",
    href: demo("here/"),
    world: "a-here",
  },
  {
    name: "Treasure Hunter",
    what: "The C/SDL2 platformer, adapted to run in the browser from the team’s level maps.",
    needs: "Inside the classic site",
    href: demo("classic.html#missions"),
    world: "a-treasure",
  },
  {
    slug: "barcelona-dubai-market-explorer",
    name: "Market Explorer",
    what: "The hosted dashboard on public demo data: filter, map and compare both cities.",
    needs: "Hosted · may ask you to sign in",
    href: "https://barcelona-dubai-market-explorer.rhythmx.chatgpt.site",
    world: "p-bcn",
  },
];

/** The earlier ANIS.EXE site, kept online with its terminal and in-card project tests. */
export const classicSite = demo("classic.html");

export const demoFor = (slug: string) => demos.find((d) => d.slug === slug);

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
