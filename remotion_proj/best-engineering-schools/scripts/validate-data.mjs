/* global console, process */
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const dataPath = path.join(
  projectRoot,
  "src/data/generated/engineeringSchoolRankings.generated.json"
);
const rawPath = path.join(projectRoot, "data/raw/engineering_school_rankings_raw.json");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const knownSchools = new Set(raw.schools.map((school) => school.key));
const documentedNoRankingYears = new Set(raw.noVerifiedRowsYears ?? []);
const errors = [];
const warnings = [];
const expectedStartYear = 2000;
const expectedEndYear = 2026;

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

assert(data.startYear === expectedStartYear, `Expected startYear to be ${expectedStartYear}.`);
assert(data.endYear === expectedEndYear, `Expected endYear to be ${expectedEndYear}.`);
assert(
  data.years.length === expectedEndYear - expectedStartYear + 1,
  "Expected one timeline object for each year 2000-2026."
);
for (let year = expectedStartYear; year <= expectedEndYear; year += 1) {
  assert(data.years.some((yearData) => yearData.year === year), `${year} must be represented.`);
}
assert(
  data.years.every(
    (yearData) => yearData.year >= expectedStartYear && yearData.year <= expectedEndYear
  ),
  "Generated timeline must not include years outside 2000-2026."
);
assert(data.visualMetric?.id === "ranking_movement", "Visual metric must be ranking_movement.");
assert(
  /movement/i.test(data.visualMetric?.label ?? ""),
  "Visual metric label must explicitly mention movement."
);

const schoolNames = new Set();
for (const school of raw.schools) {
  assert(school.key && school.displayName && school.shortName, `${school.key}: missing school name metadata.`);
  const normalizedName = school.displayName.trim().toLowerCase();
  assert(!schoolNames.has(normalizedName), `${school.key}: duplicate or inconsistent display name ${school.displayName}.`);
  schoolNames.add(normalizedName);
}

const rawYearSet = new Set();
for (const yearData of raw.yearlyRankings ?? []) {
  assert(
    yearData.year >= expectedStartYear && yearData.year <= expectedEndYear,
    `Raw data includes year outside 2000-2026: ${yearData.year}.`
  );
  assert(!rawYearSet.has(yearData.year), `Raw data has duplicate year block ${yearData.year}.`);
  rawYearSet.add(yearData.year);
  assert(raw.sources[yearData.sourceId], `${yearData.year}: unknown raw source ${yearData.sourceId}.`);

  const rawSeen = new Set();
  for (const entry of yearData.entries ?? []) {
    const entrySourceId = entry.sourceId ?? yearData.sourceId;
    assert(raw.sources[entrySourceId], `${yearData.year} ${entry.schoolKey}: unknown raw source ${entrySourceId}.`);
    assert(knownSchools.has(entry.schoolKey), `${yearData.year}: unknown raw school key ${entry.schoolKey}.`);
    assert(!rawSeen.has(entry.schoolKey), `${yearData.year}: duplicate raw school entry ${entry.schoolKey}.`);
    assert(Number.isInteger(entry.rank), `${yearData.year} ${entry.schoolKey}: raw rank must be an integer.`);
    assert(entry.rank >= 1 && entry.rank <= 20, `${yearData.year} ${entry.schoolKey}: raw top-20 rank must be 1-20.`);
    rawSeen.add(entry.schoolKey);
  }
}

for (const yearData of data.years) {
  const seen = new Set();
  const rankCounts = new Map();
  let previousRank = 0;

  assert(
    yearData.status === "ranked" || documentedNoRankingYears.has(yearData.year),
    `${yearData.year}: year has no ranked rows but is not explicitly documented.`
  );

  if (documentedNoRankingYears.has(yearData.year)) {
    assert(
      yearData.entries.length === 0,
      `${yearData.year}: documented source-gap year should not contain fabricated ranking rows.`
    );
    assert(
      typeof yearData.statusNote === "string" && yearData.statusNote.length > 0,
      `${yearData.year}: documented source-gap year must include a status note.`
    );
  }

  for (const entry of yearData.entries) {
    assert(Number.isInteger(entry.rank), `${yearData.year} ${entry.key}: rank must be an integer.`);
    assert(entry.rank >= 1 && entry.rank <= 252, `${yearData.year} ${entry.key}: impossible rank ${entry.rank}.`);
    assert(knownSchools.has(entry.key), `${yearData.year}: unknown school key ${entry.key}.`);
    assert(entry.name && entry.fullName, `${yearData.year} ${entry.key}: missing display names.`);
    assert(!seen.has(entry.key), `${yearData.year}: duplicate school entry ${entry.key}.`);
    seen.add(entry.key);
    rankCounts.set(entry.rank, (rankCounts.get(entry.rank) ?? 0) + 1);
    assert(
      entry.rank >= previousRank,
      `${yearData.year}: ranks are not sorted around ${entry.key}.`
    );
    previousRank = entry.rank;

    for (const disallowedField of [
      "salaryBonus",
      "employmentAtGraduation",
      "employmentThreeMonths",
      "acceptanceRate",
      "gmat",
      "gmatType",
      "gre",
      "gpa",
      "gpaType"
    ]) {
      assert(
        !(disallowedField in entry),
        `${yearData.year} ${entry.key}: ranking-only generated data should not include ${disallowedField}.`
      );
    }
  }

  for (const entry of yearData.entries) {
    const shouldBeTied = (rankCounts.get(entry.rank) ?? 0) > 1;
    assert(
      entry.tied === shouldBeTied,
      `${yearData.year} ${entry.key}: tie flag does not match duplicated rank ${entry.rank}.`
    );
  }

  if (yearData.entries.length === 0 && documentedNoRankingYears.has(yearData.year)) {
    warnings.push(`${yearData.year}: no source-backed U.S. News engineering ranking rows verified; documented explicitly.`);
  } else if (yearData.entries.length === 0) {
    errors.push(`${yearData.year}: no verified ranking rows and no source-gap documentation.`);
  } else if (yearData.entries.length < 20) {
    warnings.push(
      `${yearData.year}: available source data include ${yearData.entries.length} displayable rank <= 20 rows; documented in coverage summary.`
    );
  }

  for (const entry of yearData.entries) {
    const previous = data.years
      .find((candidate) => candidate.year === yearData.year - 1)
      ?.entries.find((candidate) => candidate.key === entry.key);
    if (previous && Math.abs(previous.rank - entry.rank) >= 10) {
      warnings.push(
        `${yearData.year} ${entry.key}: rank moved from ${previous.rank} to ${entry.rank}; confirm source row.`
      );
    }
  }
}

const sourceFilesToScan = [
  path.join(projectRoot, "src/hooks/useInterpolatedEngineeringRankings.ts"),
  path.join(projectRoot, "src/components/RankingRow.tsx"),
  path.join(projectRoot, "src/components/RankingChart.tsx")
];

for (const filePath of sourceFilesToScan) {
  const source = fs.readFileSync(filePath, "utf8");
  assert(
    !source.includes("rankToVisualValue") && !source.includes("maxRankForScale"),
    `${path.relative(projectRoot, filePath)} contains rank-based bar scaling.`
  );
  assert(
    !/21\s*-\s*Math\.min\(rank/.test(source),
    `${path.relative(projectRoot, filePath)} appears to derive bar width from rank.`
  );
  assert(
    !source.includes("SalaryBonus") && !source.includes("salaryToWidth") && !source.includes("animatedSalaryBonus"),
    `${path.relative(projectRoot, filePath)} still contains salary-based bar scaling.`
  );
  assert(
    !source.includes("animatedGmat") && !source.includes("gmatToWidth") && !source.includes("barWidth"),
    `${path.relative(projectRoot, filePath)} still contains metric bar rendering.`
  );
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(warnings.join("\n"));
}

console.log(`Validation passed with ${warnings.length} warning(s).`);
