# Anis Chelly — Portfolio

A single continuous experience: one WebGL shader world that follows the page from the hero to the last line, enormous type, and eight projects that each get their own atmosphere. Built with Next.js 16, React 19, TypeScript, Lenis, GSAP ScrollTrigger and React Three Fiber.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## How it is put together

**One clock.** `src/lib/motion.ts` runs Lenis, ScrollTrigger, velocity-driven DOM and the WebGL render inside the same GSAP tick, in that order. A frame never shows the canvas and the DOM at different scroll positions.

**One shader world.** `src/components/world/` renders a single mesh behind the whole site. It is never reset between sections. Scene states live in `src/lib/world/states.ts` and use ShaderGradient's vocabulary — three colours, `strength`, `density`, `frequency`, `amplitude`, `speed`, camera angles — plus `morph`, which slides every vertex from a sphere to a sheet so shapes blend instead of swapping.

A section claims a state with an attribute:

```html
<section data-world="p-aura">…</section>
```

The store (`src/lib/world/store.ts`) reads those markers' positions and blends from one state to the next as each section scrolls in. Suffixes adjust a state without redefining it: `p-aura:top` for a case-study hero, `p-aura:calm` behind long-form text.

**Depth.** The canvas sits at `z-index: 1`. Type can sit behind it (`0`) or in front (`2`); the hero name does both at once. The WORK moment is a black sheet in `multiply` blend, so the shader shows only inside the letters.

**Route transitions.** React's `<ViewTransition>` morphs a project's picture from the home page into its case-study hero and back (`src/styles/transitions.css`). Project links prefetch the whole page so the destination is there when the navigation commits.

## Where things live

| Path | What |
| --- | --- |
| `src/content/site.ts` | Name, links, about, résumé, experiments, stack |
| `src/content/projects.ts` | Every project: copy, images, links, case-study chapters — and the list of live demos |
| `src/lib/world/states.ts` | Shader scene states and palettes |
| `src/components/home/` | Home page sections, in scroll order |
| `src/components/home/Stages.tsx` | Per-project treatments: Padel overlay, Vermeg scan, SQL read-out, Zero Eclipse scene, AURA sound |
| `src/app/work/[slug]/page.tsx` | Case-study template |
| `src/styles/` | Stylesheets, one per area |

To add a project: add an entry to `projects` in `src/content/projects.ts`, drop its images in `src/assets/projects/`, and add a `p-…` state in `states.ts`.

## Honesty rules for content

Pictures carry a marker: a filled dot for a capture of running software, a hollow one for concept artwork. Numbers in the case studies come from the projects' own READMEs and reports. Keep both true when editing.

## Accessibility and fallbacks

- **Reduced motion:** no smooth scrolling, no pinned choreography, the shader holds still. Every section falls back to a plain document layout (the base CSS; the `.motion` class adds the staging).
- **No WebGL:** the same scene states drive a CSS gradient.
- **Touch:** native scrolling, no custom cursor, no hover-only interactions; project scenes become a document with large pictures.
- **Weak GPUs:** fewer mesh segments, a lower pixel-ratio ceiling, and resolution that steps down when frames run long.
- Semantic headings, a skip link, visible focus, alt text, labelled links.

## Deploying

This folder is the portfolio inside the `treasure-hunter` repository. Pushing to `main` builds it as a static export for the `/treasure-hunter` base path and publishes it as the site root, next to the live demos; the pipeline is described in the repository's README.

- `npm run build` — standard Next build (image optimisation, Node host).
- `npm run build:pages` — the static export GitHub Pages serves, written to `out/`. Pass another repository name to change the base path (`node scripts/build-pages.mjs my-repo`, or `root` for none).

Live demos (AURA, FORM Studio, PadelVision, Zero Eclipse, HERE) and the classic site are published from the same repository. `site.demos` in `src/content/site.ts` is the address they are linked at; the list itself is `demos` in `src/content/projects.ts`.

## QA scripts

They drive an installed Chrome through `playwright-core`.

```bash
npm run qa:shots -- --url http://localhost:3000 --vw 390 --vh 844 --mobile true --scrolls 0,0.25p,0.5p,1p
npm run qa:shots -- --url http://localhost:3000 --reduced true     # reduced motion
npm run qa:shots -- --url http://localhost:3000 --nogl true        # no WebGL
npm run qa:fps -- http://localhost:3000                            # frame pacing over a full scroll
npm run qa:transitions -- http://localhost:3000 aura-music-house   # which elements morph on navigation
```

## Credits

Type: Bricolage Grotesque, Instrument Serif, Geist Mono (SIL Open Font License). `src/assets/fonts/` holds a static ExtraBold Condensed cut of Bricolage Grotesque with overlapping contours merged, used wherever type is drawn as an outline. Simplex noise by Ian McEwan / Ashima Arts (MIT).
