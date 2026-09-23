# PadelVision AI — team movement studio v0.7

[Try the live browser demo](https://anischelly26.github.io/treasure-hunter/padelvision/) · [Read the portfolio case study](../case-studies/padelvision.md)

PadelVision now centers a **two-player padel team**. It processes a rally locally with Google's trained MediaPipe Pose Landmarker, tracks the chosen pair on a fixed-camera court, and measures how often both appear near the net, remain deeper, or occupy different estimated depths. It displays both detected skeletons and offers *rule-based practice cues* linked to those observations. It does not know whether the team should attack more to win, or detect a confirmed fault. The [earlier Python/Streamlit stroke prototype](https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai) remains available separately.

## Run

From the repository root, serve over HTTP with `python3 -m http.server 8000`; open `http://localhost:8000/padelvision/`. The static site requires internet to fetch the pinned MediaPipe runtime and Pose Landmarker model, plus a working WebGL browser graphics context. It needs no account, backend or API key. Video pixels are processed in the browser.

## Use

1. Record a 3–90 second H.264 MP4 or browser-compatible WebM with a stationary camera behind a baseline; include both teammates' feet. Limit: 100 MB.
2. Choose the team closest to the camera or across the net. Set the amber net guide to the actual net in the preview. The other team can be visible, but the model detects at most four poses.
3. Analyze up to two sampled frames per second. MediaPipe estimates body poses, then the app selects two poses on the chosen side and associates them across frames by proximity.
4. Inspect the paired-frame coverage, net/deep shares, depth difference, observations and suggested drills. Select a timeline moment to see the detected team skeletons.
5. Optionally record a qualified coach's situation label, note and match ID. Download the JSON report. The annotation is **not used to change the live model**.

## Model status

The pre-trained **body-pose model** is real. **Team strategy and fault detection are not trained.** The current positioning labels and drills are transparent rules in [`team-analysis.mjs`](team-analysis.mjs), with a minimum of six paired frames and 55% coverage to produce a play-style cue. They are unvalidated and do not infer ball, racket, shots, errors or wins.

[`training/train.py`](training/train.py) is a research training pipeline for future **coach-reviewed** exported rallies. It rejects too few recordings and requires independent matches per label; evaluates against a majority baseline with match-grouped folds; and saves a local candidate model only if it beats that baseline. There are no supplied labels or pretrained tactical weights. The script has not trained a tactical model, and its artifact is not loaded by this browser demo. See [training protocol](docs/training.md).

## Documentation

- [Architecture](docs/architecture.md): browser analysis, pair selection and data flow.
- [Methodology](docs/methodology.md): formulas, thresholds and limitations.
- [Training protocol](docs/training.md): annotation quality, validation and local training commands.

## Limitations and next steps

Screen coordinates are not court metres. Moving the camera, player overlap, crossed teammates, cropped feet and the wrong net guide can spoil the result. Strategy needs rally outcomes, opponent and ball context, coach-reviewed faults and prospective validation before it can be recommended as optimal. Public padel tracking datasets offer useful research material but do not supply this team's coach labels or permission to claim trained tactical advice. A future system would add court calibration, stable re-identification, shot events, outcome capture and coach feedback, then evaluate by **match**, not by adjacent frames.

Concept artwork on the portfolio card is illustrative; it is not an analysis screenshot. PadelVision AI by Anis Chelly.
