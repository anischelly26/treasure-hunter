# PadelVision AI — movement analysis studio

**[Open the browser application](../padelvision/)** · **[Inspect the original Python/Streamlit source](https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai)**

## Problem

Raw padel footage is difficult to review systematically. PadelVision organizes a short, single-stroke recording into pose observations that a player and coach can inspect together.

## Implemented

- Existing Python/Streamlit v0.5: video upload, OpenCV frame reading and annotated export, MediaPipe 33-landmark tracking, basic angles, directional comparisons with a movement reference database, and a local strategy-oriented coaching interface. It can run locally with `streamlit run app.py` from the linked source folder.
- Hosted browser demo v0.6: upload an MP4/WebM/MOV (subject to browser decoding), sample up to 2 frames per second locally, run the MediaPipe Pose Landmarker, inspect detected skeletons at phase-window timestamps, measure tracking coverage, median 2D elbow flexion and relative stance width, and download the measurements as JSON. No login, API key or video upload to a server.

## Method

The user selects the stroke and dominant hand. A MediaPipe model locates body landmarks in sampled video frames. The report describes what was tracked and measured. Its seven timeline sections divide the clip evenly for navigation; they are **not automatically recognized movement phases**. Measurements are camera dependent. The browser demo does not compare the uploaded video to coach-approved reference technique.

## Boundaries

The model does not detect the racket, ball, contact instant or actual stroke class. No validated technique or tactical score is produced. The existing Python movement reference labels require coach validation; its prototype score is not a scientifically validated performance grade. Privacy and speed depend on the browser and device; the hosted demo processes frames locally and downloads the model on first use.

## Next validation steps

1. Obtain coach-reviewed reference clips and labels with consent.
2. Assess pose tracking across camera angles, lighting, occlusion and player styles.
3. Develop and evaluate stroke segmentation and ball/racket tracking separately.
4. Only after validation, test technique feedback against coach assessment.

See [architecture](../padelvision/docs/architecture.md) and [methodology](../padelvision/docs/methodology.md).
