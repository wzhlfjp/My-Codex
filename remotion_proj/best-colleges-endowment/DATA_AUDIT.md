# Endowment Data Audit

Audit completed on May 14, 2026.

## Scope

This audit checked the endowment values used by `best-colleges-endowment` for the 1983-2025 ranking timeline. The visual ranking order was not changed; U.S. News ranking order remains the row order and endowment remains only the bar/value metric.

## Sources Checked

- NACUBO historic endowment market-values workbook covering fiscal years 1974-2023.
- 2024 NACUBO-Commonfund Study of Endowments public market-value table.
- 2025 NACUBO-Commonfund Study of Endowments public market-value table.
- Harvard University Fact Book 2009-2010, Endowment Performance table.
- Notre Dame Report, March 20, 1992, archived by the University of Notre Dame.

## Years Audited

All ranking years from 1983 through 2025 were rechecked against the NACUBO public workbooks where workbook data were available.

The NACUBO historic workbook's 1991 sheet did not expose usable institution rows in the public file checked during this audit, so 1991 was researched separately using university and university-archive sources.

## Values Added

- Harvard University, FY1991: `4708407000`, from the Harvard Fact Book 2009-2010 Endowment Performance table.
- University of Notre Dame, FY1991: `637200000`, from the Notre Dame Report article dated March 20, 1992.

Harvard is in the interpolated 1991 top-20 ranking list. Notre Dame is not in that specific top-20 list, but the value was added because the archive explicitly reports the June 30, 1991 value and identifies it as the filing date for the NACUBO report.

## Values Corrected

No existing non-1991 numeric values required correction. The audit comparison found zero mismatches between the project data and the corresponding extracted NACUBO workbook values.

## Values Removed Or Kept As N/A

No existing numeric values were removed.

For 1991, all schools other than the explicitly sourced Harvard and Notre Dame entries remain `N/A`. Rounded or contextual statements such as "about" or "just under" were not used as displayed values.

## Remaining Limitations

- 1991 remains substantially incomplete. In the interpolated 1991 top-20 list, Harvard is populated and the other 19 displayed schools remain `N/A`.
- Some campus-specific values remain unavailable in certain years. For example, UCLA and UC Berkeley are populated only when the public workbook provides a direct UCLA Foundation or UC Berkeley Foundation row; broader University of California system totals are not substituted for campus values.
- Some universities have scattered historical gaps where the public workbook did not provide a directly matched institution row.

## Validation Notes

- Every numeric value has provenance through either a NACUBO fiscal-year source or an explicit per-school source override.
- No interpolation, estimation, or adjacent-year substitution is used.
- Values are stored as numeric dollar amounts and formatted only during rendering.
