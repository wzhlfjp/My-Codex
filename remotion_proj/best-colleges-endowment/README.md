# America's Best Colleges and Their Endowments

Vertical Remotion video for a 43-second YouTube Shorts-style data story:

**America's Best Colleges and Their Endowments**

It is a companion project to `best-colleges-tuition` and intentionally keeps the same dark navy background, teal and gold accents, rounded ranking card, compact rows, animated year display, progress bar, and source-note placement.

## What It Shows

The video follows the U.S. News Best Colleges ranking timeline from 1983 through 2025. Ranking order comes from the same timeline structure used by `best-colleges-tuition`; row order is never sorted by endowment. Endowment is used only as the bar-length and value metric.

## Project Structure

- `src/Root.tsx` registers the `BestCollegesEndowment` composition.
- `src/BestCollegesEndowmentComposition.tsx` lays out the full video.
- `src/data/collegeEndowmentRankings.ts` contains ranking order, college metadata, verified endowment values, and per-value provenance.
- `src/data/endowmentSources.ts` summarizes the source set.
- `src/components/*` mirrors the tuition project's header, progress bar, chart, row, year, and source-note layout.
- `src/hooks/useInterpolatedEndowmentRankings.ts` updates each ranking year once per second and animates row/bar transitions.
- `src/styles/localTheme.ts` keeps local layout constants and visual tokens.

## Preview

```bash
pnpm -C best-colleges-endowment start
```

## Render MP4

```bash
pnpm -C best-colleges-endowment render
```

The render target is `out/best-colleges-endowment.mp4`.

## Data Sources

Endowment values are populated from official NACUBO public workbooks plus explicit university or university-archive sources for values missing from the NACUBO public workbook:

- NACUBO historic endowment market-values workbook covering fiscal years 1974 through 2023.
- 2024 NACUBO-Commonfund Study of Endowments public institution market-value table.
- 2025 NACUBO-Commonfund Study of Endowments public institution market-value table.
- Harvard University Fact Book 2009-2010 for Harvard FY1991.
- Notre Dame Report, March 20, 1992, for Notre Dame FY1991.

The NACUBO pages note that IPEDS can be used for broader finance data. This project currently uses NACUBO public workbook values for the main dataset and explicit official/archive source overrides only where a NACUBO public workbook value was unavailable.

## Populated Years

Verified NACUBO values are present for fiscal/ranking years 1983-1990 and 1992-2025 where the workbook row could be matched to the college in the ranking timeline.

The 1991 NACUBO public workbook sheet did not expose usable institution rows during extraction. The audit added Harvard FY1991 from the Harvard Fact Book and Notre Dame FY1991 from the Notre Dame Report archive. Harvard is the only interpolated 1991 top-20 school with a verified FY1991 value currently shown; the other 1991 top-20 schools remain `N/A`.

Some universities remain `N/A` in specific years when the workbook did not provide a directly matched institution/campus/foundation value. For example, UCLA and UC Berkeley are only shown when their specific foundation rows are available; the University of California system total is not substituted for either campus.

See `DATA_AUDIT.md` for the latest audit notes, values added, and remaining limitations.

## Updating Data

Add or update values in `src/data/collegeEndowmentRankings.ts` only when a source reports the exact value. Store values as full numeric dollar amounts, not formatted labels. Include the fiscal year, source name, URL, and note through the existing provenance helpers. If a value cannot be verified, leave it absent so the row displays `N/A`.

## Missing Values

Missing values display as `N/A` with a faint short placeholder bar. Placeholder bars are not used for scaling and should not be interpreted as estimated endowment values.

## Ranking vs. Metric

The row order follows U.S. News ranking context. The bar length shows endowment as a financial-resource metric. This avoids turning the chart into an endowment leaderboard and preserves the historical ranking story.
