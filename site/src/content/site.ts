export const site = {
  name: "Anis Chelly",
  first: "ANIS",
  last: "CHELLY",
  mark: "ANIS.C",
  roles: ["AI / Software Engineer", "Creative Developer"],
  tagline: "I build intelligent digital experiences.",
  description:
    "Anis Chelly — AI and software engineer. Computer vision, LLM pipelines, data systems, and the interfaces that make them usable.",
  location: "Tunis, Tunisia",
  coords: "36.8065° N — 10.1815° E",
  status: "Available for PFE internship",
  statusPeriod: "2026 — 27",
  focus: "AI/ML · Backend · Full stack",
  year: "2026",
  email: "anis.chelli@medtech.tn",
  github: "https://github.com/anischelly26",
  // Rendered only when set.
  linkedin: "",
  // Live demos stay on the existing GitHub Pages deployment.
  demos: "https://anischelly26.github.io/treasure-hunter",
  url: "https://anischelly26.github.io/treasure-hunter",
} as const;

export const about = {
  paragraph:
    "Final-year Software Engineering student at MedTech Tunis. I work where software engineering meets applied AI: computer vision and OCR, LLM pipelines and how to evaluate them, data systems — and the interfaces that make all of it usable, including the 3D and audio kind.",
  fields: ["Software Engineering", "Artificial Intelligence", "Computer Vision", "LLMs", "Data", "Creative Development"],
  facts: [
    { label: "Education", value: "Software Engineering — MedTech Tunis", note: "2022 — 2027" },
    { label: "Experience", value: "Vermeg · Monoprix HQ · Orange Digital Center", note: "AI intern · Data intern · Team project" },
    { label: "Focus", value: "AI/ML · Backend · Full stack", note: "From idea to system" },
    { label: "Languages", value: "Arabic · English · French", note: "Native · Fluent · Intermediate" },
  ],
} as const;

export const resume = {
  profile:
    "Final-year Software Engineering student at MedTech Tunis, seeking a PFE opportunity for 2026–2027 in software engineering, AI/ML, backend or full-stack development. Experience with AI prototypes, automated data workflows and team-based application development.",
  experience: [
    {
      role: "Artificial Intelligence Intern",
      org: "Vermeg",
      period: "July — August 2024",
      points: [
        "Built a Python prototype converting UI screenshots into HTML and CSS using OpenCV, Tesseract OCR, LLaVA and Ollama.",
        "Applied contrast and sharpness enhancement, CLAHE and binarization to low-contrast text extraction; validated generated-code syntax and layout relevance.",
      ],
    },
    {
      role: "Data Management Intern",
      org: "Monoprix Headquarters, Tunis",
      period: "July 2024",
      points: [
        "Designed and implemented a centralized MySQL database for store sales data.",
        "Developed Python scripts to automate external-file imports and reduce repetitive manual handling.",
      ],
    },
  ],
  teamProject: {
    title: "Explainable AI Internship & PFE Portal",
    org: "Orange Digital Center × MedTech",
    period: "2025 — 2026 · Team project",
    text: "Contributed to data preparation, backend/system logic and Agile delivery for an internship-management project covering CV parsing, skill matching, candidate ranking and human-readable shortlisting explanations. Documented architecture: React, Node.js, Express and MongoDB.",
  },
  education: {
    title: "Software Engineering — MedTech Tunis",
    period: "2022 — present · Expected graduation 2027",
    text: "Relevant study: AI, databases, web development, object-oriented programming, software analysis and design, networks, operating systems and UX.",
  },
  skills: [
    "Python · Java · JavaScript · C · PHP · HTML/CSS",
    "React · Node.js · OpenCV · Tesseract · LLaVA · Ollama",
    "MySQL · SQL Server · Git · Linux · Agile/Scrum",
  ],
  languages: "Arabic: native · English: fluent · French: intermediate",
} as const;

export const experiments = [
  {
    word: "OCR",
    text: "One page-level Tesseract pass, bounded image processing, and — in the 2024 prototype — CLAHE and binarization for low-contrast text.",
    from: "FORM Studio · Vermeg",
  },
  {
    word: "LLM",
    text: "LLaVA through Ollama for vision-to-code. A generator and a judge model graded against a labelling guide. Retrieval over my own CV.",
    from: "SQL Explanation Grader · FORM · CV assistant",
  },
  {
    word: "Data",
    text: "A centralized MySQL model for store sales. PostGIS, append-only price snapshots and FX normalization for two property markets. A Gaussian HMM for weather states.",
    from: "Monoprix · Market Explorer · HMM Weather",
  },
  {
    word: "Computer Vision",
    text: "MediaPipe pose for up to four people, a pair picked by court half, positions associated frame to frame. OpenCV for interface element detection.",
    from: "PadelVision AI · FORM Studio",
  },
  {
    word: "XAI",
    text: "Rankings a coordinator can inspect. Trust-aware matching that says why each person fits. Decision support, never the decision.",
    from: "Orange XAI Portal · HERE · VeriPath AI",
  },
  {
    word: "3D",
    text: "Nine connected rooms built in code with Three.js, batched by material and room, with a frame governor that trims resolution when the frame rate sags.",
    from: "AURA Music House",
  },
  {
    word: "Music",
    text: "Sixteen synthesized voices, eleven drum voices, eight insert effects, a 180 ms lookahead scheduler, and real WAV, stem and MIDI export.",
    from: "AURA Music House",
  },
  {
    word: "Games",
    text: "A Java 21 action adventure with companion and enemy behaviour systems. A four-level C/SDL2 platformer built as a team.",
    from: "ZERO ECLIPSE · Treasure Hunter",
  },
] as const;

export const stackRows = [
  ["Python", "React", "Node", "Three.js", "TypeScript"],
  ["LLMs", "SQL", "Java", "FastAPI", "Computer Vision"],
  ["OpenCV", "Tesseract", "Ollama", "Docker", "PostGIS"],
] as const;
