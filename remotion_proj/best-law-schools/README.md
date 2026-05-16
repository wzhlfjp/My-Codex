# Best Law Schools Remotion Video

Vertical Remotion project for "America's Best Law Schools", covering U.S. News law school rankings from 2000-2026.

## Commands

From `remotion_proj`:

```bash
pnpm --filter best-law-schools build:data
pnpm --filter best-law-schools validate:data
pnpm --filter best-law-schools dev
pnpm --filter best-law-schools render
```

Or with root scripts:

```bash
pnpm dev:best-law-schools
pnpm render:best-law-schools
```

## Composition

- Composition ID: `BestLawSchools`
- Size: 1080 x 1920
- FPS: 60
- Timeline: 2000-2026, 1.5 seconds per ranking year, plus the same intro/outro buffer as `best-business-schools`

## Data Pipeline

- Raw data: `data/raw/law_school_rankings_raw.json`
- Build script: `scripts/build-data.mjs`
- Validation script: `scripts/validate-data.mjs`
- Generated animation data: `src/data/generated/lawSchoolRankings.generated.json`
- Generated coverage report: `data/processed/coverage_summary.json`
- Generated coverage table: `data/processed/coverage_summary.md`
- Generated source mapping: `data/processed/source_mapping.csv`

Run `pnpm --filter best-law-schools build:data` after editing raw data.

## Accuracy Notes

The animation is ranking-only. Rows show rank, school name, and movement versus the previous verified ranking year. No bar-length metric or non-ranking quantitative field is used.

Displayed rows include all schools ranked #20 or better, so years with ties at the cutoff may show more than 20 rows.

Sources used:

- 2000-2011: U.S. News & World Report rankings compiled by George D. Wilson, Stanford Law School Robert Crown Law Library, Research Paper No. 28.
- 2012-2013: U.S. News & World Report rankings compiled by George D. Wilson, Stanford Law School Robert Crown Law Library, Research Paper No. 31.
- 2014-2026: 7Sage's historical law-school ranking table, labeled as U.S. News data from 2014 onward, cross-checked against the current U.S. News ranking page where available.

See `research_notes.md` and `data/processed/coverage_summary.md` for source and coverage details.
