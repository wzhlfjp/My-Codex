# Best Engineering Schools Remotion Video

Vertical Remotion project for "America's Best Engineering Schools", covering U.S. News engineering school ranking years from 2000-2026.

## Commands

From `remotion_proj`:

```bash
pnpm --filter best-engineering-schools build:data
pnpm --filter best-engineering-schools validate:data
pnpm --filter best-engineering-schools dev
pnpm --filter best-engineering-schools render
```

Or with root scripts:

```bash
pnpm dev:best-engineering-schools
pnpm render:best-engineering-schools
```

## Composition

- Composition ID: `BestEngineeringSchools`
- Size: 1080 x 1920
- FPS: 60
- Timeline: 2000-2026, 1.5 seconds per ranking year, plus the same intro/outro buffer as `best-law-schools`

## Data Pipeline

- Raw data: `data/raw/engineering_school_rankings_raw.json`
- Build script: `scripts/build-data.mjs`
- Validation script: `scripts/validate-data.mjs`
- Generated animation data: `src/data/generated/engineeringSchoolRankings.generated.json`
- Generated coverage report: `data/processed/coverage_summary.json`
- Generated coverage table: `data/processed/coverage_summary.md`
- Generated source mapping: `data/processed/source_mapping.csv`

Run `pnpm --filter best-engineering-schools build:data` after editing raw data.

## Accuracy Notes

The animation is ranking-only. Rows show rank, university name, and movement versus the previous verified ranking year. No bar-length metric or non-ranking quantitative field is used.

Displayed rows include all sourced schools ranked #20 or better. Ties are preserved. Years without source-backed ranking rows remain in the timeline but display the no-data state.

Sources used:

- 2003: archived mirror of the U.S. News 2003 Graduate School Rankings: Engineering page.
- 2007-2012, 2015-2023, 2025: public archives, reposts, and republications labeled as U.S. News engineering rankings.
- 2024: official U.S. News press release verifying the top five only.
- 2026: official U.S. News press release for the top three, a higher-education news summary for the top 10, and official Texas A&M and Maryland releases for additional verified rows.

Current remaining source gaps are 2000-2002, 2004-2006, 2013, and 2014. The 2003, 2017, 2024, and 2026 entries are partial because accessible sources verify fewer than 20 display rows.

`source_mapping.csv` records source URL, source type, confidence, and source notes for every generated school-year rank row.

See `research_notes.md` and `data/processed/coverage_summary.md` for source and coverage details.
