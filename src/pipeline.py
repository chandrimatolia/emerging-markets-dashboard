"""
Emerging Markets Investment Visualiser
ML Pipeline: Data processing, clustering, regression, PCA, scoring
"""

import pandas as pd
import numpy as np
import json
import warnings
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score
from sklearn.decomposition import PCA

warnings.filterwarnings("ignore")


# ─────────────────────────────────────────────────────────────────────────────
# 1. FEATURE DEFINITIONS
# ─────────────────────────────────────────────────────────────────────────────

FEATURES = [
    "gdp_growth",          # GDP per capita growth (%) — WB WDI
    "inflation",           # Inflation, consumer prices (%) — IMF WEO
    "current_account",     # Current account balance (% GDP) — IMF WEO
    "fdi_inflows",         # FDI net inflows (% GDP) — WB WDI
    "pol_stability",       # Political stability index — WB WGI
    "rule_of_law",         # Rule of law index — WB WGI
    "control_corruption",  # Control of corruption index — WB WGI
    "ext_debt_gni",        # External debt stocks (% GNI) — WB WDI
    "gross_cap_form",      # Gross capital formation (% GDP) — WB WDI
    "unemployment",        # Unemployment rate (%) — WB WDI
    "trade_openness",      # (Exports + Imports) / GDP (%) — WB WDI
    "mobile_per100",       # Mobile subscriptions per 100 people — WB WDI
]

# Positive direction = higher value → more attractive
# Negative direction = higher value → less attractive
DIRECTION = {
    "gdp_growth": 1,
    "inflation": -1,
    "current_account": 1,
    "fdi_inflows": 1,
    "pol_stability": 1,
    "rule_of_law": 1,
    "control_corruption": 1,
    "ext_debt_gni": -1,
    "gross_cap_form": 1,
    "unemployment": -1,
    "trade_openness": 1,
    "mobile_per100": 1,
}

# Approximate weights for composite score (must sum to 1)
WEIGHTS = {
    "gdp_growth": 0.14,
    "pol_stability": 0.14,
    "rule_of_law": 0.12,
    "control_corruption": 0.10,
    "inflation": 0.10,
    "fdi_inflows": 0.10,
    "ext_debt_gni": 0.08,
    "gross_cap_form": 0.06,
    "current_account": 0.06,
    "unemployment": 0.06,
    "trade_openness": 0.04,
    "mobile_per100": 0.00,
}


# ─────────────────────────────────────────────────────────────────────────────
# 2. LOAD DATA
# ─────────────────────────────────────────────────────────────────────────────

def load_data(path: str = "data/em_raw.csv") -> pd.DataFrame:
    """Load raw CSV data. Expected columns: country, iso3, region + FEATURES."""
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")
    return df


# ─────────────────────────────────────────────────────────────────────────────
# 3. PREPROCESSING
# ─────────────────────────────────────────────────────────────────────────────

def preprocess(df: pd.DataFrame) -> pd.DataFrame:
    """Impute missing values and validate features."""
    df = df.copy()

    for feat in FEATURES:
        if feat not in df.columns:
            print(f"  ⚠  Feature '{feat}' missing — filling with 0")
            df[feat] = 0
            continue

        n_missing = df[feat].isna().sum()
        if n_missing > 0:
            # Regional median imputation, fallback to global median
            regional_medians = df.groupby("region")[feat].transform("median")
            global_median = df[feat].median()
            df[feat] = df[feat].fillna(regional_medians).fillna(global_median)
            print(f"  Imputed {n_missing} missing values in '{feat}'")

    return df


# ─────────────────────────────────────────────────────────────────────────────
# 4. COMPOSITE SCORE
# ─────────────────────────────────────────────────────────────────────────────

def compute_composite_score(df: pd.DataFrame) -> pd.DataFrame:
    """
    Compute investment attractiveness score (0–100).
    1. Standardise each feature.
    2. Flip sign for negative-direction features.
    3. Weighted sum.
    4. Rescale to 0–100.
    """
    df = df.copy()
    scaler = StandardScaler()
    scaled = scaler.fit_transform(df[FEATURES])
    scaled_df = pd.DataFrame(scaled, columns=FEATURES, index=df.index)

    # Apply direction and weights
    raw_score = sum(
        scaled_df[f] * DIRECTION[f] * WEIGHTS[f]
        for f in FEATURES
    )

    # Rescale to 0–100
    mn, mx = raw_score.min(), raw_score.max()
    df["investment_score"] = ((raw_score - mn) / (mx - mn) * 100).round(1)

    return df, scaler


# ─────────────────────────────────────────────────────────────────────────────
# 5. KMEANS CLUSTERING
# ─────────────────────────────────────────────────────────────────────────────

TIER_LABELS = {
    0: "Tier 1: High Potential",
    1: "Tier 2: Moderate Potential",
    2: "Tier 3: Cautious",
    3: "Tier 4: High Risk",
}

TIER_COLORS = {
    "Tier 1: High Potential":    "#00D4AA",
    "Tier 2: Moderate Potential":"#4A9EFF",
    "Tier 3: Cautious":          "#FFB547",
    "Tier 4: High Risk":         "#FF5A5A",
}


def cluster_countries(df: pd.DataFrame, scaler: StandardScaler, k: int = 4) -> pd.DataFrame:
    """
    KMeans clustering on standardised features.
    Clusters are renamed by descending average investment score.
    """
    df = df.copy()
    X = scaler.transform(df[FEATURES])

    km = KMeans(n_clusters=k, n_init=20, random_state=42)
    raw_labels = km.fit_predict(X)

    # Map raw cluster IDs → tiers by descending avg score
    temp = df[["investment_score"]].copy()
    temp["raw_cluster"] = raw_labels
    avg_scores = temp.groupby("raw_cluster")["investment_score"].mean().sort_values(ascending=False)
    rank_map = {old: new for new, old in enumerate(avg_scores.index)}

    df["tier_id"]    = [rank_map[c] for c in raw_labels]
    df["tier"]       = df["tier_id"].map(TIER_LABELS)
    df["tier_color"] = df["tier"].map(TIER_COLORS)

    print("\nCluster sizes:")
    for tid, label in TIER_LABELS.items():
        n = (df["tier_id"] == tid).sum()
        avg = df.loc[df["tier_id"] == tid, "investment_score"].mean()
        print(f"  {label}: {n} countries, avg score {avg:.1f}")

    return df, km


# ─────────────────────────────────────────────────────────────────────────────
# 6. RIDGE REGRESSION
# ─────────────────────────────────────────────────────────────────────────────

def fit_ridge(df: pd.DataFrame, scaler: StandardScaler, alpha: float = 1.0):
    """Fit Ridge Regression; report CV R² and feature coefficients."""
    X = scaler.transform(df[FEATURES])
    y = df["investment_score"].values

    ridge = Ridge(alpha=alpha)
    cv_scores = cross_val_score(ridge, X, y, cv=5, scoring="r2")
    ridge.fit(X, y)

    train_r2 = ridge.score(X, y)
    cv_r2    = cv_scores.mean()

    print(f"\nRidge Regression (α={alpha}):")
    print(f"  Train R²  = {train_r2:.4f}")
    print(f"  CV R²     = {cv_r2:.4f}  (5-fold)")

    coefs = pd.Series(ridge.coef_, index=FEATURES).sort_values(ascending=False)
    print("\n  Top coefficients:")
    for feat, coef in coefs.items():
        print(f"    {feat:25s}  {coef:+.3f}")

    return ridge, cv_r2, coefs


# ─────────────────────────────────────────────────────────────────────────────
# 7. PCA PROJECTION
# ─────────────────────────────────────────────────────────────────────────────

def run_pca(df: pd.DataFrame, scaler: StandardScaler, n_components: int = 2) -> pd.DataFrame:
    """Project countries onto 2D PCA space for scatter visualisation."""
    df = df.copy()
    X = scaler.transform(df[FEATURES])

    pca = PCA(n_components=n_components, random_state=42)
    coords = pca.fit_transform(X)

    df["pca_x"] = coords[:, 0].round(4)
    df["pca_y"] = coords[:, 1].round(4)

    var = pca.explained_variance_ratio_
    print(f"\nPCA explained variance: PC1={var[0]:.4f} ({var[0]*100:.1f}%), PC2={var[1]:.4f} ({var[1]*100:.1f}%)")
    print(f"  Total: {sum(var)*100:.1f}%")

    return df, pca


# ─────────────────────────────────────────────────────────────────────────────
# 8. REGIONAL AGGREGATES
# ─────────────────────────────────────────────────────────────────────────────

def regional_aggregates(df: pd.DataFrame) -> list:
    """Compute per-region summary statistics."""
    agg = (
        df.groupby("region")
        .agg(
            avg_score=("investment_score", "mean"),
            avg_gdp_growth=("gdp_growth", "mean"),
            avg_inflation=("inflation", "mean"),
            avg_fdi=("fdi_inflows", "mean"),
            country_count=("country", "count"),
        )
        .reset_index()
    )
    agg["avg_score"]      = agg["avg_score"].round(1)
    agg["avg_gdp_growth"] = agg["avg_gdp_growth"].round(2)
    agg["avg_inflation"]  = agg["avg_inflation"].round(2)
    agg["avg_fdi"]        = agg["avg_fdi"].round(2)
    return agg.to_dict(orient="records")


# ─────────────────────────────────────────────────────────────────────────────
# 9. CORRELATION MATRIX
# ─────────────────────────────────────────────────────────────────────────────

def compute_correlation_matrix(df: pd.DataFrame) -> list:
    """Pearson correlation matrix for all features + investment_score."""
    cols = FEATURES + ["investment_score"]
    corr = df[cols].corr().round(3)
    return corr.values.tolist()


# ─────────────────────────────────────────────────────────────────────────────
# 10. EXPORT JSON
# ─────────────────────────────────────────────────────────────────────────────

def export_json(df: pd.DataFrame, pca, ridge_cv_r2: float, coefs, output: str = "data/em_data.json"):
    """Export all data needed by the React dashboard to JSON."""
    countries = df[[
        "country", "iso3", "region", "investment_score", "tier", "tier_color",
        "pca_x", "pca_y",
    ] + FEATURES].to_dict(orient="records")

    regional = regional_aggregates(df)
    corr_matrix = compute_correlation_matrix(df)
    var = pca.explained_variance_ratio_

    feature_importance = [
        {"label": f.replace("_", " ").title(), "coefficient": round(float(coefs[f]), 3)}
        for f in FEATURES
    ]

    output_data = {
        "countries": countries,
        "regional": regional,
        "correlation_matrix": corr_matrix,
        "feature_importance": feature_importance,
        "meta": {
            "n_countries": len(df),
            "n_features": len(FEATURES),
            "pca_variance_pc1": round(float(var[0]), 4),
            "pca_variance_pc2": round(float(var[1]), 4),
            "ridge_cv_r2": round(ridge_cv_r2, 4),
        },
    }

    with open(output, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"\n✓ Exported JSON → {output}")
    return output_data


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def run_pipeline(data_path: str = "data/em_raw.csv"):
    print("=" * 60)
    print("  Emerging Markets ML Pipeline")
    print("=" * 60)

    df = load_data(data_path)
    df = preprocess(df)
    df, scaler = compute_composite_score(df)
    df, km = cluster_countries(df, scaler)
    ridge, cv_r2, coefs = fit_ridge(df, scaler)
    df, pca = run_pca(df, scaler)
    export_json(df, pca, cv_r2, coefs)

    print("\n✓ Pipeline complete")
    return df


if __name__ == "__main__":
    run_pipeline()
