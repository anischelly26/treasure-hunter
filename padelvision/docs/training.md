# Training a team-review model: protocol

The browser runs a pretrained pose estimator and an **untrained rule system** for team movement. It has no coach-reviewed team-fault dataset. To create one, record multiple independent matches with consent, consistent camera annotations and actual rally outcomes. A qualified padel coach should inspect the footage and choose one exported `coachReview.label` per rally, with a note explaining the context. Labels currently supported: `defensive_positioning`, `net_positioning`, `transition_gap`, `spacing_review`, `no_issue`. These are situation labels, **not verified causes of losing points**. Use distinct match IDs so adjacent rallies never land in train and evaluation folds together.

The downloaded JSON summary includes six numeric features plus optional coach label/note and match ID. To run the local baseline after collecting enough independently reviewed sessions:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r training/requirements.txt
python training/train.py exports/*.json --output training-output
```

The script refuses to run with fewer than 50 reviewed rallies, fewer than 10 matches, fewer than two labels or fewer than five distinct matches per observed label. It compares a random forest to a majority baseline using five folds grouped by match. It writes `evaluation.json` and saves a local `team-model.joblib` **only** when macro F1 beats the baseline. This artifact is a research candidate; it is not connected to the public app and should not be deployed from one evaluation alone. Inspect confusion per class, performance by camera, levels and occlusions, inter-coach agreement, and a held-out match set. The available public PadelTracker100 annotations include player positions and shot events, but do not constitute coach labels for this team's errors or prove which style wins for them.

Do not commit personal footage or exports without permission. This project contains neither a coach-labelled dataset nor trained tactical model weights.
