/* global console */
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const rawPath = path.join(projectRoot, "data/raw/business_school_rankings_raw.json");
const outDir = path.join(projectRoot, "src/data/generated");
const reportDir = path.join(projectRoot, "data/processed");

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const schools = new Map(raw.schools.map((school) => [school.key, school]));
const startYear = 2000;
const endYear = 2026;
const noRankingYearMap = new Map(
  (raw.noRankingYears ?? []).map((yearStatus) => [yearStatus.year, yearStatus])
);

const sourcePriority = {
  pq_2026_recent: 4,
  pq_historical_2001_2012: 3,
  infogram_1990_2021: 2
};

const rankingsByYearSchool = new Map();

for (const matrix of raw.rankingMatrixSources) {
  for (const row of matrix.rows) {
    const [year, ...ranks] = row;
    matrix.schoolKeys.forEach((schoolKey, index) => {
      const rank = ranks[index];
      if (rank === null || rank === "" || rank === undefined) {
        return;
      }

      const mapKey = `${year}:${schoolKey}`;
      const previous = rankingsByYearSchool.get(mapKey);
      const next = {
        year,
        schoolKey,
        rank,
        overallScore: null,
        sourceId: matrix.sourceId
      };

      if (
        !previous ||
        (sourcePriority[next.sourceId] ?? 0) > (sourcePriority[previous.sourceId] ?? 0)
      ) {
        rankingsByYearSchool.set(mapKey, next);
      }
    });
  }
}

const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, index) => startYear + index
);
const yearly = years.map((year) => {
  const rows = [...rankingsByYearSchool.values()]
    .filter((row) => row.year === year)
    .map((row) => {
      const school = schools.get(row.schoolKey);
      if (!school) {
        throw new Error(`Unknown school key: ${row.schoolKey}`);
      }

      return {
        key: row.schoolKey,
        rank: row.rank,
        tied: false,
        name: school.shortName,
        fullName: school.displayName,
        color: school.color,
        overallScore: row.overallScore,
        rankingSourceId: row.sourceId
      };
    })
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

  const rankCounts = new Map();
  rows.forEach((row) => rankCounts.set(row.rank, (rankCounts.get(row.rank) ?? 0) + 1));
  rows.forEach((row) => {
    row.tied = (rankCounts.get(row.rank) ?? 0) > 1;
  });

  return {
    year,
    status: rows.length > 0 ? "ranked" : (noRankingYearMap.get(year)?.status ?? "missing"),
    statusNote: rows.length > 0 ? null : (noRankingYearMap.get(year)?.note ?? null),
    statusSourceId: rows.length > 0 ? null : (noRankingYearMap.get(year)?.sourceId ?? null),
    entries: rows.filter((row) => row.rank <= 20)
  };
});

const normalized = {
  startYear,
  endYear,
  visualMetric: {
    id: "ranking_movement",
    label: "Rank movement",
    note:
      "The scoreboard uses U.S. News rank for row order and movement indicators derived from the previous verified ranking year. No bar-length metric or other quantitative metric is used."
  },
  sources: raw.sources,
  years: yearly
};

const coverage = yearly.map((yearData) => {
  const entries = yearData.entries;
  return {
    year: yearData.year,
    status: yearData.status,
    statusNote: yearData.statusNote,
    rankingRows: entries.length,
    top20Complete: entries.length >= 20,
    tiedRanks: new Set(
      entries
        .filter((entry) => entry.tied)
        .map((entry) => entry.rank)
    ).size,
    sourceIds: [...new Set(entries.map((entry) => entry.rankingSourceId))]
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "businessSchoolRankings.generated.json"),
  JSON.stringify(normalized, null, 2) + "\n"
);
fs.writeFileSync(
  path.join(reportDir, "coverage_summary.json"),
  JSON.stringify(coverage, null, 2) + "\n"
);

const coverageMarkdown = [
  "# Data Coverage Summary",
  "",
  "The current animation covers 2000-2026 only because earlier historical data were incomplete. Years before 2000 remain in the raw research file when available, but they are outside the generated animation timeline.",
  "",
  "| year | status | schools shown (rank <= 20, ties included) | top 20 complete | tied rank groups | source ids |",
  "| --- | --- | ---: | --- | ---: | --- |",
  ...coverage.map((row) =>
    `| ${row.year} | ${row.status} | ${row.rankingRows} | ${row.top20Complete ? "yes" : "no"} | ${row.tiedRanks} | ${row.sourceIds.join("; ")} |`
  ),
  "",
  "The animation is ranking-only: rank, school, movement indicator, and yearly callout. No bar-length metric or non-ranking quantitative field is used.",
  "",
  "Rows marked `top 20 complete = no` indicate years where the available source data include fewer than 20 displayable schools at rank #20 or better.",
  ""
];

fs.writeFileSync(path.join(reportDir, "coverage_summary.md"), coverageMarkdown.join("\n"));

const csvRows = [
  "year,school_key,field,source_id,source_url,note",
  ...yearly.flatMap((yearData) =>
    yearData.entries.flatMap((entry) => {
      const rankingSource = raw.sources[entry.rankingSourceId];
      const rows = [
        [
          yearData.year,
          entry.key,
          "rank",
          entry.rankingSourceId,
          rankingSource?.url ?? "",
          entry.rankingSourceId === "infogram_1990_2021"
            ? "Secondary public compilation; see research notes."
            : "Reported from U.S. News."
        ]
      ];
      return rows.map((cols) =>
        cols.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
      );
    })
  )
];

fs.writeFileSync(path.join(reportDir, "source_mapping.csv"), csvRows.join("\n") + "\n");

console.log(
  `Built ${yearly.reduce((sum, yearData) => sum + yearData.entries.length, 0)} ranking rows across ${yearly.length} years.`
);
