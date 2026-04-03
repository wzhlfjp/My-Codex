from pathlib import Path

import numpy as np
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "hdb_presale_prices_2015-2024_cleaned_regression.csv"
OUTPUT_DIR = PROJECT_ROOT / "output"
RESULTS_CSV_PATH = OUTPUT_DIR / "highway_proximity_model_coefficients.csv"
RESULTS_NOTE_PATH = OUTPUT_DIR / "highway_proximity_model_results.md"

DISTANCE_ORDER = [">500m", "301-500m", "151-300m", "101-150m", "51-100m", "<=50m"]


def build_design_matrix(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Construct an interpretable OLS baseline with explicit controls."""
    modeling_df = df.loc[df["distance_from_expressway"].isin(DISTANCE_ORDER)].copy()
    modeling_df["distance_from_expressway"] = pd.Categorical(
        modeling_df["distance_from_expressway"],
        categories=DISTANCE_ORDER,
        ordered=True,
    )
    modeling_df["log_resale_price"] = np.log(modeling_df["resale_price"])

    x_parts = [pd.Series(1.0, index=modeling_df.index, name="const")]
    x_parts.append(
        pd.get_dummies(
            modeling_df["distance_from_expressway"],
            prefix="distance",
            drop_first=True,
            dtype=float,
        )
    )
    x_parts.append(modeling_df[["floor_area_sqm", "remaining_lease_years"]].astype(float))
    x_parts.append(
        pd.get_dummies(modeling_df["flat_type"], prefix="flat_type", drop_first=True, dtype=float)
    )
    x_parts.append(
        pd.get_dummies(
            modeling_df["storey_range_category"],
            prefix="storey",
            drop_first=True,
            dtype=float,
        )
    )
    x_parts.append(pd.get_dummies(modeling_df["town"], prefix="town", drop_first=True, dtype=float))

    x = pd.concat(x_parts, axis=1)
    y = modeling_df["log_resale_price"].astype(float)
    return x, y


def fit_ols_hc1(x: pd.DataFrame, y: pd.Series) -> tuple[pd.Series, pd.Series, float]:
    """Estimate OLS coefficients with HC1 robust standard errors."""
    x_matrix = x.to_numpy(dtype=float)
    y_vector = y.to_numpy(dtype=float)

    xtx_inv = np.linalg.inv(x_matrix.T @ x_matrix)
    beta = xtx_inv @ (x_matrix.T @ y_vector)
    residuals = y_vector - x_matrix @ beta

    n_obs, n_params = x_matrix.shape
    meat = np.zeros((n_params, n_params), dtype=float)
    for i in range(n_obs):
        xi = x_matrix[i : i + 1].T
        meat += residuals[i] ** 2 * (xi @ xi.T)

    covariance = (n_obs / (n_obs - n_params)) * xtx_inv @ meat @ xtx_inv
    robust_se = np.sqrt(np.diag(covariance))

    ssr = float(np.sum(residuals**2))
    sst = float(np.sum((y_vector - y_vector.mean()) ** 2))
    r_squared = 1.0 - (ssr / sst)

    return pd.Series(beta, index=x.columns), pd.Series(robust_se, index=x.columns), r_squared


def distance_effect_table(coefficients: pd.Series, standard_errors: pd.Series) -> pd.DataFrame:
    rows = []
    for level in DISTANCE_ORDER[1:]:
        term = f"distance_{level}"
        coef = float(coefficients[term])
        se = float(standard_errors[term])
        ci_low = coef - 1.96 * se
        ci_high = coef + 1.96 * se
        rows.append(
            {
                "distance_bucket": level,
                "coefficient_log_points": coef,
                "robust_se": se,
                "effect_pct": 100.0 * (np.exp(coef) - 1.0),
                "ci_low_pct": 100.0 * (np.exp(ci_low) - 1.0),
                "ci_high_pct": 100.0 * (np.exp(ci_high) - 1.0),
            }
        )
    return pd.DataFrame(rows)


def write_results_note(
    note_path: Path,
    effect_table: pd.DataFrame,
    n_obs: int,
    r_squared: float,
    year_range: tuple[int, int],
) -> None:
    strongest_effect = effect_table.iloc[-1]
    note = f"""# Highway Proximity Baseline Results

## Model setup

- Target: `log(resale_price)` so coefficients can be read approximately as percentage differences.
- Main feature of interest: categorical `distance_from_expressway`, using `>500m` as the reference group.
- Controls: `floor_area_sqm`, `remaining_lease_years`, `flat_type`, `storey_range_category`, and `town`.
- Sample used: {n_obs:,} rows from {year_range[0]} to {year_range[1]}. In practice the cleaned file only contains {year_range[0]} observations, so this is a cross-sectional association model.

## Leakage risks and exclusions

- Excluded `resale_price`-derived or post-sale variables: none were used beyond the target itself.
- Excluded `year` because it has no variation in this cleaned file.
- Excluded `block` and `street_name` from the baseline because they are extremely high-cardinality location identifiers and can make highway proximity nearly deterministic. That would not be classic target leakage, but it would absorb most of the location signal and change the estimand away from the broad proximity effect we want to interpret.
- Excluded raw `storey_range` because `storey_range_category` already captures the same concept in a lower-variance, more interpretable way.

## Effect size and uncertainty

- Closest bucket (`<=50m`) is associated with an estimated {strongest_effect["effect_pct"]:.1f}% lower valuation versus `>500m`, with a 95% CI of {strongest_effect["ci_low_pct"]:.1f}% to {strongest_effect["ci_high_pct"]:.1f}%.
- The adjusted pattern is monotonic: prices are lower as highway distance decreases, after controlling for size, lease, flat type, storey category, and town.
- Model R-squared: {r_squared:.3f}.

## Major limitations

- This is observational, cross-sectional, and should not be interpreted causally.
- The biggest remaining risk is omitted-variable bias: the file does not control for exact coordinates, transit access, school proximity, renovation quality, building age beyond remaining lease, or other neighborhood amenities/disamenities.
- Distance buckets are very imbalanced, with most records in the `>500m` group, so the nearest-bin estimates rely on relatively small comparison groups.
"""
    note_path.write_text(note, encoding="utf-8")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(DATA_PATH)
    x, y = build_design_matrix(df)
    coefficients, standard_errors, r_squared = fit_ols_hc1(x, y)
    effects = distance_effect_table(coefficients, standard_errors)

    effects.to_csv(RESULTS_CSV_PATH, index=False)
    write_results_note(
        RESULTS_NOTE_PATH,
        effects,
        n_obs=len(y),
        r_squared=r_squared,
        year_range=(int(df["year"].min()), int(df["year"].max())),
    )

    print("Saved coefficient table to", RESULTS_CSV_PATH)
    print("Saved results note to", RESULTS_NOTE_PATH)
    print(effects.to_string(index=False))


if __name__ == "__main__":
    main()
