# MISSION_04 — Hidden Markov Weather Analysis

**Course:** CS280 — Introduction to Artificial Intelligence  
**Team:** Youssef Mani, Anis Chelly  
**Date:** November 2025

## Goal

Model and infer latent weather states from temperature observations using a Gaussian Hidden Markov Model, then use the learned transition dynamics for forecasting.

## Data

The project used a reproducible synthetic dataset representing **365 days** of temperature observations generated from three hidden weather states:

- Sunny
- Cloudy
- Rainy

This controlled setup made it possible to compare inferred hidden states with known ground truth.

## Pipeline

```text
Synthetic weather sequence
        ↓
Train / validation / test split
        ↓
Gaussian HMM training
        ↓
Model selection (AIC / BIC)
        ↓
Viterbi state decoding
        ↓
Forward likelihood evaluation
        ↓
Next-step forecasting
        ↓
Comparison with moving-average baseline
```

## Algorithms & implementation

- Gaussian Hidden Markov Model with `hmmlearn`
- Baum-Welch / EM training
- Viterbi decoding
- Forward log-likelihood evaluation
- AIC and BIC model-complexity comparison
- sequential train / validation / test split
- MSE and MAE forecasting evaluation
- moving-average baseline comparison
- result visualizations and confusion matrix

## Model selection

The project compared HMMs with different numbers of hidden states and selected **K = 3** as the preferred model based on AIC / BIC analysis in the project report.

The learned model recovered an interpretable high-temperature state around 25°C with strong persistence, while the cooler states exhibited different transition behavior.

## Limitations

The project intentionally used synthetic, single-feature temperature data. Future extensions include real meteorological datasets, multivariate observations such as humidity and pressure, seasonal/non-stationary models and comparisons with other sequential approaches.

---

`PYTHON` `HMMLEARN` `HIDDEN MARKOV MODEL` `BAUM-WELCH` `VITERBI` `AIC/BIC` `TIME SERIES` `FORECASTING`
