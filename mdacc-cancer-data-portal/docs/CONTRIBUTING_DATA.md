# Contributing Data Safely

## Purpose
Use this guide when updating source CSV files in `data/raw/`.

## Source-of-truth contract
- Contract module: `scripts/data_contract.ts`
- Generated contract artifact: `data/templates/raw_data_contract.json`
- CSV header templates: `data/templates/*.csv`

The validator and templates both come from the same contract module.

## Recommended workflow
1. Regenerate templates from the contract:
   - `npm run data:templates`
2. Update raw CSV files in `data/raw/`.
3. Run validation:
   - `npm run data:validate`
4. Review report:
   - `data/processed/validation_report.json`
5. Run preflight summary:
   - `npm run data:preflight`
6. Rebuild processed data:
   - `npm run data:build`
7. Run full repo checks:
   - `npm run verify`

## Preflight vs verify
- `data:preflight`: quick contributor/operator check (template refresh + validation + concise summary output)
- `verify`: full quality gate (validation + tests + lint + production build)

## How to read validation status
- `passed`: no errors or warnings
- `passed_with_warnings`: buildable, but warnings should be reviewed
- `failed`: fix errors before building/releasing

## Common failure cases
- Missing required column in a CSV header
- Missing required value in a row
- Duplicate core IDs (for example duplicate `dataset_id`)
- Invalid controlled vocabulary value (for example unsupported `dataset_type`)
- Missing foreign-key reference in relationship tables
- Duplicate relationship rows for the same composite key

## In-app status view
Use `/status` for a calm, compact view of build metadata and validation health.
