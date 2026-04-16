# Data Refresh Runbook

## Purpose
This runbook describes how to refresh portal content from local CSV source files.

## Source of truth
- Raw CSV inputs: `data/raw/`
- Generated artifacts: `data/processed/`
- Raw-data contract: `scripts/data_contract.ts`
- Generated CSV templates: `data/templates/`

Do not edit generated processed files manually.

## Step-by-step refresh
1. Update raw CSV files in `data/raw/`.
2. Validate schema and relationships:

```bash
npm run data:validate
```

Optional: refresh header templates from the same contract source:

```bash
npm run data:templates
```

Optional contributor/operator preflight (templates + validation summary):

```bash
npm run data:preflight
```

3. Rebuild processed artifacts:

```bash
npm run data:build
```

4. Run full repo verification:

```bash
npm run verify
```

5. Review build metadata:
   - `data/processed/build_metadata.json`
   - `data/processed/validation_report.json`
   - Confirm:
     - `generatedAt`
     - `sourceFilesUsed`
     - `processedEntityCounts`
     - `validationStatus`
     - `validationWarningsSummary`
     - grouped warnings/errors and issue counts in `validation_report.json`

6. Perform a quick UI sanity pass:
   - `/`
   - `/explore`
   - `/status`
   - `/researchers`, `/datasets`, `/technologies`, `/disease-areas`, `/projects`
   - one detail page for each entity type

## Common issues
1. Missing required columns in raw CSVs:
   - Fix headers to match schema docs.
2. Foreign-key validation errors:
   - Ensure relationship-table IDs match existing core-entity IDs.
3. Empty relationship output:
   - Check relationship CSV row content and ID casing.
4. Header mismatch errors:
   - Compare CSV headers against `data/templates/*.csv` regenerated from `scripts/data_contract.ts`.

## Related docs
- `docs/DATA_SCHEMA.md`
- `docs/DEPLOYMENT.md`
- `docs/CONTRIBUTING_DATA.md`
- `README.md`
