# Team movement architecture

```text
Local rally → browser video decoder → up to 2 sampled frames/s
  → MediaPipe Pose Landmarker (up to four people)
  → choose two visible players on the selected court half
  → associate detected poses by nearest previous foot position
  → pair coverage, screen-space depth and separation
  → explainable review cues + dual-skeleton video inspection
  → optional coach annotation → local JSON export
```

The browser application is static on GitHub Pages. MediaPipe's pinned runtime and official Lite model load from their hosts. No video is sent to an analysis server, and no session is stored. The chosen court half and net position are entered by the user; there is no automatic court calibration. For a second run the VIDEO-mode landmarker is created afresh, so frame timestamps increase within each session.

The training script consumes multiple JSON exports with a coach label and match ID. It builds a separate **research candidate** after match-grouped cross-validation. No such dataset or trained strategy model ships with the demo; the browser never loads a candidate model. The original Python/Streamlit [individual-stroke project](https://github.com/anischelly26/anischelly26/tree/main/projects/padelvision-ai) is independent of this browser team mode.

## Failure modes

- Pose detections can confuse teammates and opponents, or exchange player A/B when they cross. The app uses a camera-side filter and nearest-position association, not identity recognition.
- If feet are hidden, the player is excluded. Low pair coverage blocks a play-style suggestion.
- MediaPipe's image preprocessing may require a WebGL context even with CPU inference. The UI gives an actionable error; running the Python app is an alternative.
- Browser video decoding and model download depend on codecs and connectivity. Files are limited to 100 MB and 3–90 seconds.
