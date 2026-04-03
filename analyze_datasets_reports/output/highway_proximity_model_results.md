# Highway Proximity Baseline Results

## Model setup

- Target: `log(resale_price)` so coefficients can be read approximately as percentage differences.
- Main feature of interest: categorical `distance_from_expressway`, using `>500m` as the reference group.
- Controls: `floor_area_sqm`, `remaining_lease_years`, `flat_type`, `storey_range_category`, and `town`.
- Sample used: 20,157 rows from 2017 to 2017. In practice the cleaned file only contains 2017 observations, so this is a cross-sectional association model.

## Leakage risks and exclusions

- Excluded `resale_price`-derived or post-sale variables: none were used beyond the target itself.
- Excluded `year` because it has no variation in this cleaned file.
- Excluded `block` and `street_name` from the baseline because they are extremely high-cardinality location identifiers and can make highway proximity nearly deterministic. That would not be classic target leakage, but it would absorb most of the location signal and change the estimand away from the broad proximity effect we want to interpret.
- Excluded raw `storey_range` because `storey_range_category` already captures the same concept in a lower-variance, more interpretable way.

## Effect size and uncertainty

- Closest bucket (`<=50m`) is associated with an estimated -11.0% lower valuation versus `>500m`, with a 95% CI of -12.1% to -9.9%.
- The adjusted pattern is monotonic: prices are lower as highway distance decreases, after controlling for size, lease, flat type, storey category, and town.
- Model R-squared: 0.883.

## Major limitations

- This is observational, cross-sectional, and should not be interpreted causally.
- The biggest remaining risk is omitted-variable bias: the file does not control for exact coordinates, transit access, school proximity, renovation quality, building age beyond remaining lease, or other neighborhood amenities/disamenities.
- Distance buckets are very imbalanced, with most records in the `>500m` group, so the nearest-bin estimates rely on relatively small comparison groups.
