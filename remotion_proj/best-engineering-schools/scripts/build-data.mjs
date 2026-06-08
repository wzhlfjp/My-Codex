/* global console */
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const rawPath = path.join(projectRoot, "data/raw/engineering_school_rankings_raw.json");
const outDir = path.join(projectRoot, "src/data/generated");
const reportDir = path.join(projectRoot, "data/processed");

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const schools = new Map(raw.schools.map((school) => [school.key, school]));
const startYear = 2000;
const endYear = 2026;
const rankingsByYearSchool = new Map();
const noVerifiedRowsYears = new Set(raw.noVerifiedRowsYears ?? []);
const getSourceType = (source) => {
  if (!source) return "";
  if (source.sourceType) return source.sourceType;
  return source.primarySource ? "official or archived primary source" : "secondary repost or news source";
};

for (const yearData of raw.yearlyRankings) {
  for (const entry of yearData.entries) {
    const mapKey = `${yearData.year}:${entry.schoolKey}`;
    rankingsByYearSchool.set(mapKey, {
      year: yearData.year,
      schoolKey: entry.schoolKey,
      rank: entry.rank,
      overallScore: null,
      sourceId: entry.sourceId ?? yearData.sourceId
    });
  }
}

const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, index) => startYear + index
);
const yearly = years.map((year) => {
  const statusSourceId = noVerifiedRowsYears.has(year) ? "source_gap" : null;
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
        name: school.displayName,
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
    status: rows.length > 0 ? "ranked" : "missing",
    statusNote:
      rows.length > 0
        ? null
        : "No source-backed top-20 engineering ranking table has been verified for this year.",
    statusSourceId,
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
  path.join(outDir, "engineeringSchoolRankings.generated.json"),
  JSON.stringify(normalized, null, 2) + "\n"
);
fs.writeFileSync(
  path.join(reportDir, "coverage_summary.json"),
  JSON.stringify(coverage, null, 2) + "\n"
);

const coverageMarkdown = [
  "# Data Coverage Summary",
  "",
  "The animation timeline covers U.S. News engineering school ranking years 2000-2026. Years without source-backed rows are left empty rather than interpolated.",
  "",
  "| year | status | schools shown (rank <= 20, ties included) | top 20 complete | tied rank groups | source ids |",
  "| --- | --- | ---: | --- | ---: | --- |",
  ...coverage.map((row) =>
    `| ${row.year} | ${row.status} | ${row.rankingRows} | ${row.top20Complete ? "yes" : "no"} | ${row.tiedRanks} | ${row.sourceIds.join("; ")} |`
  ),
  "",
  "The animation is ranking-only: rank, school, movement indicator, and yearly callout. No bar-length metric or non-ranking quantitative field is used.",
  "",
  "Rows can exceed 20 schools when the #20 boundary includes a tie.",
  ""
];

fs.writeFileSync(path.join(reportDir, "coverage_summary.md"), coverageMarkdown.join("\n"));

const csvRows = [
  "year,school_key,field,source_id,source_type,confidence,source_url,note",
  ...yearly.flatMap((yearData) =>
    yearData.entries.flatMap((entry) => {
      const rankingSource = raw.sources[entry.rankingSourceId];
      const rows = [
        [
          yearData.year,
          entry.key,
          "rank",
          entry.rankingSourceId,
          getSourceType(rankingSource),
          rankingSource?.confidence ?? "",
          rankingSource?.url ?? "",
          rankingSource?.note ?? "Source-backed U.S. News engineering ranking row."
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
