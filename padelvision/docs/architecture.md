# Architecture

## Hosted browser demo

```text
Local video file
  → browser video decoder
  → frame sampling (maximum 2 fps, 120 frames)
  → MediaPipe Pose Landmarker (CPU, one pose, 33 landmarks)
  → per-frame 2D elbow angle and relative stance width
  → tracking coverage + medians + equal-time timeline
  → local JSON export
```

The app is static and runs on GitHub Pages. It fetches MediaPipe from a pinned CDN version and Google's official model from its model host. Video pixels and frame measurements do not leave the user's browser. There is no server-side state, login or API key. The skeleton is drawn only on a sampled frame when the user selects a timeline window.

## Existing Python application

[Source](https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai): Streamlit UI, OpenCV frame processing, MediaPipe PoseLandmarker, movement reference dataset, local coaching interface, optional LLM mode. The hosted browser demo links to this source; it does not claim that the Python application is hosted or expose an imaginary FastAPI service.

## Reliability choices

- File size and duration limits bound memory and analysis time.
- Only a single pose is processed. Detection coverage is reported so missing landmarks are visible.
- MediaPipe `VIDEO` mode receives increasing timestamps and each new analysis reuses the model. Browser video decoding and remote model loading can fail; the UI shows a retryable error.
- No external user video URL, backend upload or local-storage session database.
