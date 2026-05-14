# Best Colleges Tuition

This Remotion video adapts `../../continuous_data_show/best-colleges-us-news.html` into a vertical YouTube Shorts composition titled **"America's Best Colleges Over Time"**.

The video shows the U.S. News Best Colleges ranking timeline from 1983 through 2025. Rows are ordered by U.S. News rank. Bar length represents Tuition & Fees only when the source HTML dataset has an explicit value for that school and year.

## Structure

```text
src/
├── BestCollegesComposition.tsx
├── Root.tsx
├── components/
├── data/
│   └── collegeTuitionRankings.ts
├── hooks/
└── styles/
```

## Preview

From the workspace root:

```powershell
pnpm -C best-colleges-tuition start
```

Or:

```powershell
pnpm start:best-colleges-tuition
```

## Render

From the workspace root:

```powershell
pnpm -C best-colleges-tuition render
```

The MP4 is written to:

```text
best-colleges-tuition/out/best-colleges-tuition.mp4
```

## Updating Data

Ranking anchors, college metadata, and explicit Tuition & Fees values live in `src/data/collegeTuitionRankings.ts`. Update that file when the source data changes.

Missing tuition values are stored as `null` and displayed as `N/A`. Rows with missing tuition use a short faint placeholder bar so the viewer can see that no real dollar value is implied.

## Shared Workspace Code

This project uses the workspace package `@remotion-proj/shared` for currency formatting. The visual components are local to this video because their layout is specific to this YouTube Shorts composition.
