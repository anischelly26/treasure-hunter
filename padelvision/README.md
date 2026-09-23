# PadelVision AI — hosted movement studio

Live demo: https://anischelly26.github.io/treasure-hunter/padelvision/

This directory contains the GitHub Pages browser application. It provides **real on-device pose inference**, without a hosted processing API or a pretend AI score. The separate [Python/Streamlit v0.5 source](https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai) already implements MediaPipe/OpenCV video processing and prototype reference comparison.

## Run locally

Serve the repository root over HTTP: `python3 -m http.server 8000`, then open `http://localhost:8000/padelvision/`. Local file URLs are not supported because the vision runtime and model use browser fetch.

To run the fuller original Python app, follow the linked repository's README. The hosted browser application intentionally does not call or advertise an undeployed backend.

## Workflow

1. Select a short padel clip with one fully visible player and a steady camera. MP4 (H.264) or WebM is preferred. Files must be under 100 MB and 2–60 seconds long; 3–15 seconds works best.
2. Select the stroke and dominant hand. The app does not classify these automatically.
3. On Analyze, the browser fetches a pinned MediaPipe Tasks Vision runtime and the official Lite Pose Landmarker model, then samples up to two frames per second. Video bytes remain local.
4. The report displays the sampled tracking rate, median 2D elbow angle, normalized stance width and seven equal-time review windows. Click a window to inspect the nearest sampled skeleton.
5. Download a JSON summary of the measurements. No persistent sessions, account, video upload, fake profiles, or invented performance score.

## Architecture

`HTML/CSS/JavaScript → browser video decoder → MediaPipe Pose Landmarker → geometry → report`.

The underlying research code uses `Streamlit → OpenCV → MediaPipe → movement references → coaching output`. See [architecture](docs/architecture.md) and [methodology](docs/methodology.md).

## Limits

- Body pose alone does not reveal racket path, ball trajectory, impact timing, tactical decision quality or scientifically valid technique scores.
- Seven named windows are **equal-time navigation**, not detected stroke phases.
- Geometry is image-space and sensitive to camera placement and occlusion.
- The original reference labels need qualified padel-coach validation. Original Python scores are prototype heuristics.
- An internet connection is required to fetch the model and runtime. MediaPipe also requires a working browser graphics context even with its CPU inference delegate; browsers with disabled WebGL may fail. Unsupported video codecs will fail clearly. The linked Python application is an alternative on machines where browser inference cannot run.

## Next steps

Coach-reviewed examples; evaluated stroke segmentation; racket/ball detection; comparative tests across cameras; optional privacy-preserving session history with explicit consent.

## Credits

MediaPipe Pose Landmarker by Google (Apache 2.0 runtime). Concept image in the portfolio is illustrative, not an analysis screenshot. PadelVision AI by Anis Chelly.
