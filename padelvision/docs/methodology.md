# Team positioning methodology v0.7

MediaPipe supplies up to four human poses per sampled frame. For each visible person, PadelVision uses the midpoint of the two ankles as an approximate screen-space foot location. It retains detections on the selected side of the user-set net line (plus a 2.5% image-height margin), orders the two selected players by image foot position, then maps subsequent detections to previous player positions with the lower total displacement. It does **not** re-identify players across cuts, occlusions or player crossings.

The approximate netward depth is `(1 - foot_y) / (1 - net_y)` for the camera-near half and `foot_y / net_y` for the far half, clamped to `[0,1]`. Both feet must be visible. These values normalize screen positions against the net guide and **do not measure court distances or speed**.

For frames with both teammates, the report calculates:

| Metric | Screen-space definition |
| --- | --- |
| Pair coverage | Frames with both selected poses ÷ sampled frames. |
| Together near net | Share where both estimated depths are at least 0.64. |
| Both deeper | Share where both estimated depths are at most 0.38. |
| Depth difference | Share where absolute depth difference exceeds 0.23. |
| Narrow pairing | Share with horizontal foot separation below 0.12 of image width. |
| Median gap | Median absolute horizontal foot separation as share of image width. |

If fewer than `max(6, ceil(55% of samples))` paired frames are available, the UI refuses to suggest a style. Otherwise, if more than 55% of paired frames have both players near the net, it describes the pair as **net-forward** and proposes a paired volley drill. If more than 55% have both deeper, it describes **defense-first positioning** and proposes a transition drill. Otherwise it describes a **mixed/transition** pattern. A depth difference above 35% of paired frames prompts a transition review; narrow horizontal pairing above 35% prompts a camera-aware lateral-coverage review. These thresholds are engineering hypotheses, **not learned from coaching data**. The percentages indicate where bodies appear; they say nothing about a successful volley, an error or the optimal plan against a particular opponent.

The seven timeline tiles are equal-time navigation windows. Every report statement is derived from sampled detections and the user-entered court guide. No ball, racket, shot events, opponent strategy, rally outcome, score, injury status or actual team fault is inferred. Coaches should review the selected frames in context. Camera perspective can distort every threshold. More work is needed on calibration, stable multi-person tracking and coach validation before any tactical model or decisive recommendation is appropriate.
