"""Train a coach-labelled positioning classifier from exported team sessions.

No model or coach labels are shipped. This script deliberately refuses to train on
unreviewed exports or on too few distinct matches.
"""

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

from joblib import dump
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import balanced_accuracy_score, f1_score
from sklearn.model_selection import StratifiedGroupKFold, cross_val_predict

FEATURES = ("coverage", "netShare", "backShare", "staggerShare", "narrowShare", "medianGap")
LABELS = {"defensive_positioning", "net_positioning", "transition_gap", "spacing_review", "no_issue"}


def load_sessions(paths):
    rows = []
    for path in paths:
        item = json.loads(path.read_text(encoding="utf-8"))
        review = item.get("coachReview") or {}
        if item.get("version") != "browser-team-v0.7" or review.get("label") not in LABELS:
            continue
        match_id = review.get("matchId", "").strip()
        if not match_id or item.get("coverage", 0) < .55:
            continue
        if any(not isinstance(item.get(key), (int, float)) for key in FEATURES):
            continue
        rows.append((tuple(item[key] for key in FEATURES), review["label"], match_id))
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("sessions", nargs="+", type=Path, help="Coach-reviewed JSON exports")
    parser.add_argument("--output", type=Path, default=Path("training-output"))
    args = parser.parse_args()
    rows = load_sessions(args.sessions)
    if len(rows) < 50 or len({row[2] for row in rows}) < 10:
        parser.error("Need at least 50 reviewed rallies from 10 separate matches; nothing was trained.")
    by_label = defaultdict(set)
    for _, label, match in rows:
        by_label[label].add(match)
    if len(by_label) < 2 or any(len(matches) < 5 for matches in by_label.values()):
        parser.error("Need at least two coach labels with five independent matches per label.")
    x = [row[0] for row in rows]
    y = [row[1] for row in rows]
    groups = [row[2] for row in rows]
    folds = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
    baseline = DummyClassifier(strategy="most_frequent")
    model = RandomForestClassifier(n_estimators=160, max_depth=5, min_samples_leaf=3,
                                   class_weight="balanced", random_state=42)
    baseline_predictions = cross_val_predict(baseline, x, y, groups=groups, cv=folds)
    predictions = cross_val_predict(model, x, y, groups=groups, cv=folds)
    report = {
        "reviewed_sessions": len(rows), "matches": len(set(groups)),
        "labels": dict(Counter(y)), "features": FEATURES,
        "grouping": "five folds separated by coach-entered match ID",
        "macro_f1": f1_score(y, predictions, average="macro", zero_division=0),
        "balanced_accuracy": balanced_accuracy_score(y, predictions),
        "majority_baseline_macro_f1": f1_score(y, baseline_predictions, average="macro", zero_division=0),
        "warning": "Position-only features and coach labels do not establish that a recommended style wins more points."
    }
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "evaluation.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    if report["macro_f1"] <= report["majority_baseline_macro_f1"]:
        print("Model did not beat the majority baseline. No model saved; see evaluation.json")
        return
    model.fit(x, y)
    dump({"model": model, "features": FEATURES, "labels": sorted(set(y))}, args.output / "team-model.joblib")
    print(f"Saved local research model and evaluation in {args.output}. This model is not deployed.")


if __name__ == "__main__":
    main()
