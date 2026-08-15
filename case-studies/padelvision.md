# PadelVision AI

## Mission

**Movement → Metrics → Coaching**

PadelVision is a sports-AI R&D project focused on structuring padel stroke and movement analysis so that future computer-vision systems can compare observed movement against meaningful reference patterns.

## Current reference dataset

The current v0.1 dataset organizes right-handed padel movement by:

- stroke type and variant
- ordered movement phases
- phase objective
- head/gaze behavior
- center-of-mass direction
- trunk and pelvis/hip movement
- shoulder, elbow and wrist directions
- knee and foot actions
- racket and ball-contact direction
- tempo and notes

The dataset includes strokes such as volleys, serve and bandeja and treats the movement labels as a **starting ontology**, not final biomechanical truth.

## Validation philosophy

The reference work is informed by:

- official padel rules for context
- systematic/scoping reviews on padel performance analysis and measurable outcomes
- biomechanics and injury literature
- shoulder-kinematics research in padel strokes

Crucially, the current directional labels are explicitly marked as **needing qualified coach validation** before they should be treated as ground truth.

## Why it matters

The goal is to create a defensible bridge between raw player video/motion data and useful coaching feedback rather than inventing arbitrary movement scores.

## Direction

Future work can connect this reference model to pose estimation, stroke recognition, movement-phase segmentation and player feedback.

---

**Anis Chelly // ANIS.EXE // Sports AI R&D**
