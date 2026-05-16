# Best Business Schools Remotion Video

Vertical Remotion project for "U.S. News Best Business Schools: Top Full-Time MBA Programs, 2000-2026."

## Commands

From `remotion_proj`:

```bash
pnpm --filter best-business-schools build:data
pnpm --filter best-business-schools validate:data
pnpm --filter best-business-schools dev
pnpm --filter best-business-schools render
```

Or with root scripts:

```bash
pnpm dev:best-business-schools
pnpm render:best-business-schools
```

## Composition

- Composition ID: `BestBusinessSchools`
- Size: 1080 x 1920
- FPS: 60
- Timeline: 2000-2026, 1.5 seconds per ranking year, plus a short intro/outro buffer

## Data Pipeline

- Raw data: `data/raw/business_school_rankings_raw.json`
- Build script: `scripts/build-data.mjs`
- Validation script: `scripts/validate-data.mjs`
- Generated animation data: `src/data/generated/businessSchoolRankings.generated.json`
- Generated coverage report: `data/processed/coverage_summary.json`
- Generated coverage table: `data/processed/coverage_summary.md`
- Generated source mapping: `data/processed/source_mapping.csv`

Run `pnpm --filter best-business-schools build:data` after editing raw data.

## Accuracy Notes

Accuracy is prioritized over completeness.

The current animation covers 2000-2026 because earlier historical data were incomplete. The raw research file still preserves earlier source material where available, but the generated animation data and validation window begin at 2000.

The historical rank series uses Poets&Quants and a public Infogram compilation where direct U.S. News historical data was not available. The Infogram-backed rows are marked lower confidence in the raw source metadata and should be replaced with official or archived U.S. News sources if obtained.

The animation is ranking-only. Rows show rank, school name, and movement versus the previous verified ranking year. No bar-length metric or non-ranking quantitative field is used.

Displayed rows include all schools ranked #20 or better, so years with ties at the cutoff may show more than 20 rows.

Some years in 2000-2026 have fewer than 20 displayable rows in the current source data; see `data/processed/coverage_summary.md`.
