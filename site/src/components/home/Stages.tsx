"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import alex from "@/assets/projects/eclipse-alex.png";
import crab from "@/assets/projects/eclipse-crab.png";
import far from "@/assets/projects/eclipse-far.png";
import mid from "@/assets/projects/eclipse-mid.png";
import nova from "@/assets/projects/eclipse-nova.png";
import sky from "@/assets/projects/eclipse-sky.png";
import { onFrame } from "@/lib/motion";
import { world } from "@/lib/world/store";

/* ————————————————————————————————————————————————————————————————
   PADELVISION — what the pose pipeline sees, drawn over the picture.
   Coordinates are in the artwork's own 1200×675 space.
   ———————————————————————————————————————————————————————————————— */
export function PadelOverlay() {
  const points: [number, number][] = [
    [468, 232],
    [551, 243],
    [433, 347],
    [498, 353],
    [548, 414],
    [318, 548],
    [527, 520],
  ];
  return (
    <svg className="cv" viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <polygon className="cv__half" points="0,492 1200,566 1200,675 0,675" />
      <g className="cv__court">
        <path className="cv__line" pathLength={1} d="M0 492 L1200 566" />
        <path className="cv__line" pathLength={1} d="M765 442 L902 308" />
        <path className="cv__line" pathLength={1} d="M575 270 L1196 270" />
        <path className="cv__line" pathLength={1} d="M0 470 L396 380" />
      </g>
      <g className="cv__box" data-box="a">
        <rect x="385" y="148" width="265" height="420" pathLength={1} />
        <path d="M385 172 V148 H409 M626 148 H650 V172 M650 544 V568 H626 M409 568 H385 V544" />
        <text x="385" y="136">POSE 01 — ON YOUR HALF</text>
      </g>
      <g className="cv__box cv__box--dim" data-box="b">
        <rect x="935" y="192" width="100" height="122" pathLength={1} />
        <text x="935" y="180">POSE 02 — OTHER HALF · IGNORED</text>
      </g>
      <g className="cv__points">
        {points.map(([x, y]) => (
          <circle className="cv__pt" key={`${x}-${y}`} cx={x} cy={y} r="5" />
        ))}
      </g>
      <g className="cv__feet">
        <ellipse cx="318" cy="560" rx="46" ry="13" />
        <ellipse cx="527" cy="526" rx="46" ry="13" />
        <path className="cv__line" pathLength={1} d="M318 560 L527 526" />
        <text x="250" y="606">FOOT POSITION → FRAME-TO-FRAME ASSOCIATION</text>
      </g>
      <text className="cv__note" x="24" y="650">
        SELECTED COURT HALF
      </text>
    </svg>
  );
}

/* ————————————————————————————————————————————————————————————————
   VERMEG / FORM — scan, regions, OCR output. Box positions are fractions
   of the real 1440×1450 capture; text and confidences are the capture's own.
   ———————————————————————————————————————————————————————————————— */
const regions = [
  { type: "heading", text: "Hello FORM", conf: "95%", box: { left: 29.6, top: 34.5, width: 13.9, height: 3 } },
  { type: "heading", text: "Build something useful", conf: "96%", box: { left: 29.8, top: 37.9, width: 11.6, height: 3.6 } },
  { type: "button", text: "Continue", conf: "96%", box: { left: 30, top: 42.4, width: 11.5, height: 2.4 } },
];

export function VermegOverlay() {
  return (
    <>
      <div className="scan" aria-hidden="true">
        <span className="scan__line" />
        {regions.map((r) => (
          <span
            className="scan__box"
            key={r.text}
            style={{ left: `${r.box.left}%`, top: `${r.box.top}%`, width: `${r.box.width}%`, height: `${r.box.height}%` } as CSSProperties}
          />
        ))}
      </div>
      <div className="readout mono" aria-hidden="true">
        <p className="readout__row readout__head">
          <span>OCR output</span>
          <span>One page-level pass</span>
        </p>
        {regions.map((r) => (
          <p className="readout__row" key={r.text}>
            <span>{r.type}</span>
            <span>“{r.text}”</span>
            <span>{r.conf}</span>
          </p>
        ))}
        <p className="readout__row readout__foot">
          <span>→ Sanitized HTML / CSS</span>
          <span>ZIP</span>
        </p>
      </div>
    </>
  );
}

/* ————————————————————————————————————————————————————————————————
   SQL GRADER — one real row from results/v2_dev.jsonl (item q089).
   ———————————————————————————————————————————————————————————————— */
export function SqlOverlay() {
  return (
    <div className="readout readout--sql mono" aria-hidden="true">
      <p className="readout__row readout__head">
        <span>Item q089</span>
        <span>dev split · prompt v2</span>
      </p>
      <p className="readout__row readout__code">
        SELECT course_id, COUNT(*) FROM enrollments GROUP BY course_id HAVING COUNT(*) % 2 = 0;
      </p>
      <p className="readout__row readout__say">
        <span>Generator</span>
        <span>
          “This query counts how many students are enrolled in each course and then groups the results by course. It only includes courses where the
          number of students is an even number.”
        </span>
      </p>
      <p className="readout__row readout__verdict">
        <span>Judge</span>
        <span>
          <b>Good</b> — covers select, group by and having, in clear language.
        </span>
      </p>
    </div>
  );
}

/* ————————————————————————————————————————————————————————————————
   ZERO ECLIPSE — the game's own parallax layers and sprite sheets.
   ———————————————————————————————————————————————————————————————— */
export function EclipseScene() {
  const ref = useRef<HTMLDivElement>(null);

  // Sprites only animate while the scene is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => el.classList.toggle("is-live", entry.isIntersecting), { rootMargin: "10%" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const vars = {
    "--sky": `url(${sky.src})`,
    "--far": `url(${far.src})`,
    "--mid": `url(${mid.src})`,
    "--alex": `url(${alex.src})`,
    "--nova": `url(${nova.src})`,
    "--crab": `url(${crab.src})`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className="eclipse"
      style={vars}
      role="img"
      aria-label="ZERO ECLIPSE: the hero Alex and the companion NOVA walking past a ruined gate, drawn with the game's V9 artwork"
    >
      <span className="eclipse__sky" />
      <span className="eclipse__layer eclipse__far" />
      <span className="eclipse__layer eclipse__mid" />
      <span className="eclipse__ground" />
      <span className="eclipse__sprite eclipse__crab" />
      <span className="eclipse__sprite eclipse__nova" />
      <span className="eclipse__sprite eclipse__alex" />
    </div>
  );
}

/* ————————————————————————————————————————————————————————————————
   AURA — an opt-in ambient sketch. While it plays, its low and high energy
   reach the shader: the surface swells on the pulse, highlights brighten.
   ———————————————————————————————————————————————————————————————— */
const BPM = 112;
const BEAT = 60 / BPM;
const CHORDS = [
  [50, 57, 60, 64, 65],
  [46, 53, 57, 62, 65],
  [41, 53, 57, 60, 64],
  [48, 55, 57, 62, 64],
];
const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

function createSketch() {
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.82;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.7;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 420;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  const delay = ctx.createDelay(1);
  delay.delayTime.value = BEAT * 0.75;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  filter.connect(delay).connect(feedback).connect(delay);
  delay.connect(master);
  filter.connect(master);
  master.connect(analyser).connect(ctx.destination);

  let step = 0;
  let next = ctx.currentTime + 0.08;

  const pad = (when: number, notes: number[], length: number) => {
    for (const note of notes) {
      for (const [type, detune, level] of [
        ["triangle", -5, 0.05],
        ["sawtooth", 6, 0.014],
      ] as const) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = hz(note);
        osc.detune.value = detune;
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(level, when + 1.3);
        gain.gain.setValueAtTime(level, when + length - 0.6);
        gain.gain.linearRampToValueAtTime(0, when + length + 1.6);
        osc.connect(gain).connect(filter);
        osc.start(when);
        osc.stop(when + length + 1.7);
      }
    }
  };

  const pulse = (when: number, level: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(92, when);
    osc.frequency.exponentialRampToValueAtTime(46, when + 0.16);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(level, when + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, when + 0.5);
    osc.connect(gain).connect(master);
    osc.start(when);
    osc.stop(when + 0.55);
  };

  // Lookahead scheduling against the audio clock.
  const timer = window.setInterval(() => {
    while (next < ctx.currentTime + 0.35) {
      if (step % 8 === 0) pad(next, CHORDS[(step / 8) % CHORDS.length], BEAT * 8);
      if (step % 4 === 0) pulse(next, 0.5);
      else if (step % 4 === 2) pulse(next, 0.22);
      next += BEAT;
      step++;
    }
  }, 90);

  master.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.6);

  const bins = new Uint8Array(analyser.frequencyBinCount);
  const avg = (from: number, to: number) => {
    let sum = 0;
    for (let i = from; i < to; i++) sum += bins[i];
    return sum / (to - from) / 255;
  };

  return {
    read() {
      analyser.getByteFrequencyData(bins);
      return { bass: avg(0, 5), high: avg(18, 90) };
    },
    stop() {
      window.clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.18);
      window.setTimeout(() => void ctx.close(), 900);
    },
  };
}

export function AuraSound() {
  const [on, setOn] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!on) return;
    const sketch = createSketch();
    const off = onFrame(() => {
      const { bass, high } = sketch.read();
      world.audio.bass = Math.min(1, bass * 1.5);
      world.audio.high = Math.min(1, high * 3);
    }, 90);

    // The sketch belongs to this scene: leaving it, or the tab, ends it.
    const scene = button.current?.closest(".project");
    const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && setOn(false), { threshold: 0 });
    if (scene) observer.observe(scene);
    const hidden = () => document.hidden && setOn(false);
    document.addEventListener("visibilitychange", hidden);

    return () => {
      off();
      observer.disconnect();
      document.removeEventListener("visibilitychange", hidden);
      sketch.stop();
      world.audio.bass = 0;
      world.audio.high = 0;
    };
  }, [on]);

  return (
    <div className="sound">
      <button ref={button} type="button" className={`sound__button mono${on ? " is-on" : ""}`} aria-pressed={on} data-cursor="sound" onClick={() => setOn((v) => !v)}>
        <span className="sound__bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        {on ? "Stop the sketch" : "Play an ambient sketch"}
      </button>
      <p className="sound__note mono">A browser-generated sketch, not AURA’s own output. The surface listens.</p>
    </div>
  );
}
