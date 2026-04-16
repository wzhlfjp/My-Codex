import { describe, expect, it } from "vitest";
import { createPreflightSummary, renderPreflightSummary } from "../scripts/data_preflight";
import type { ValidationReport } from "../scripts/validate_csv";

const REPORT_WITH_WARNINGS: ValidationReport = {
  generatedAt: "2026-04-15T00:00:00.000Z",
  status: "passed_with_warnings",
  summary: {
    filesScanned: 13,
    tableCount: {
      core: 5,
      relationship: 8,
      total: 13,
    },
    rowCount: 100,
    issueCountBySeverity: {
      error: 0,
      warning: 2,
    },
    issueCountByType: {
      empty_table: 2,
    },
    normalizationSubstitutionCount: 0,
  },
  issuesByFile: {
    "projects.csv": {
      rowCount: 0,
      errors: [],
      warnings: ["[projects.csv] No rows found."],
    },
    "project_researchers.csv": {
      rowCount: 0,
      errors: [],
      warnings: ["[project_researchers.csv] No rows found."],
    },
    "datasets.csv": {
      rowCount: 10,
      errors: [],
      warnings: [],
    },
  },
  normalizationSummary: {
    totalSubstitutions: 0,
    substitutions: [],
  },
};

describe("data_preflight helpers", () => {
  it("creates a ranked preflight summary", () => {
    const summary = createPreflightSummary(REPORT_WITH_WARNINGS);
    expect(summary.status).toBe("passed_with_warnings");
    expect(summary.errorCount).toBe(0);
    expect(summary.warningCount).toBe(2);
    expect(summary.filesWithIssues).toHaveLength(2);
  });

  it("renders concise output lines", () => {
    const summary = createPreflightSummary(REPORT_WITH_WARNINGS);
    const lines = renderPreflightSummary(summary, "data/processed/validation_report.json");
    expect(lines[0]).toContain("Data preflight summary");
    expect(lines.join("\n")).toContain("projects.csv");
    expect(lines.join("\n")).toContain("Full report");
  });
});
