# PadelVision AI — team movement studio

[Open the live team application](https://anischelly26.github.io/treasure-hunter/padelvision/) · [Inspect the browser code](../padelvision/) · [Original Python stroke research](https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai)

## Problem

Padel partners need to review *how they move together* across a rally, not just one player's stroke. A fixed-camera recording can help identify when the pair advances, stays deep or occupies different netward positions, with the original frames available for coach review.

## What works now

The browser demo accepts a local 3–90 second video, asks the user which side of a visible net contains their team, and runs a pretrained MediaPipe Pose Landmarker for up to four people on sampled frames. It selects two players on the chosen side, associates positions across frames, draws the two skeletons and reports pair coverage, together-near-net share, deeper share and depth difference. The report suggests *practice to test* based on transparent screen-space rules and can export measurements with optional coach annotations. No account, server video upload or made-up accuracy score is involved.

The original Python/Streamlit v0.5 project covers individual stroke and movement-reference research. It is a separate local app, not the hosted team model.

## Research status

The **body-pose model is pretrained**, but no team-fault or best-strategy model has been trained. The current rule cues cannot establish whether a pair should attack more to win, whether a volley happened or who caused a mistake. The optional coach labels exported with each rally can support a future model; [`training/train.py`](../padelvision/training/train.py) requires independent match groups and compares results with a baseline before saving a local research candidate. No labelled team dataset or candidate weights are shipped.

## Limits and next work

Single-camera positions are not calibrated court coordinates. Feet must be visible; player identities may switch when teammates cross or a camera cuts. Real tactical advice requires ball/racket and opponent context, actual outcomes, multiple qualified coach labels and held-out matches. See the [measurement method](../padelvision/docs/methodology.md), [architecture](../padelvision/docs/architecture.md) and [training protocol](../padelvision/docs/training.md).
