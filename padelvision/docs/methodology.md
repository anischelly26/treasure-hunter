# Methodology and limitations

The user selects the stroke and handedness. The hosted app decodes the video in the browser, samples at up to 2 fps and runs Google's Pose Landmarker on each sampled frame. For detected poses, it measures elbow flexion as the angle at shoulder–elbow–wrist in video pixel coordinates. Relative stance width is ankle distance divided by shoulder distance in the same plane; it is unitless and does not estimate real-world court distance. Medians summarize available values. Coverage is detected samples / total sampled frames.

The timeline has seven equally sized time windows labelled ready position, preparation, backswing, acceleration, contact window, follow-through and recovery. Those are **review labels**, not phase predictions. Clicking one seeks to the nearest sampled frame and overlays the actual detected landmarks; a window label does not prove that a given action occurred.

No racket or ball keypoints, impact detection, swing speed, movement efficiency, tactical assessment, injury assessment or AI performance grade is implemented in the hosted demo. Camera position, player overlap, poor light and video decoding influence results. The Python research project has additional movement-reference heuristics and a prototype score; its labels require coach validation and its phases use equal-time segmentation. Do not present the score as validated.

Before any coaching claims, collect consented clips spanning skill levels and camera views, obtain multiple qualified coach annotations, measure inter-rater agreement, assess landmark robustness and compare feedback to held-out expert assessments.
