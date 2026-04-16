import { describe, expect, it } from "vitest";
import { getHealthStatusPresentation, summarizePortalHealth } from "@/lib/data-health";
import type { BuildMetadata, ValidationReport } from "@/types/domain";

const BUILD_METADATA: BuildMetadata = {
  generatedAt: "2026-04-15T00:00:00.000Z",
  sourceFilesUsed: ["researchers.csv", "datasets.csv"],
  processedEntityCounts: {
    researchers: 1,
    projects: 0,
    datasets: 1,
    technologies: 1,
    diseaseAreas: 1,
  },
  latestSourceUpdateDate: "2026-04-10",
  validationStatus: "passed_with_warnings",
  validationWarningsSummary: {
    count: 1,
    warnings: ["[projects.csv] No rows found."],
  },
};

const VALIDATION_REPORT: ValidationReport = {
  generatedAt: "2026-04-15T00:01:00.000Z",
  status: "passed_with_warnings",
  summary: {
    filesScanned: 13,
    tableCount: { core: 5, relationship: 8, total: 13 },
    rowCount: 42,
    issueCountBySeverity: { error: 0, warning: 2 },
    issueCountByType: { empty_table: 2 },
    normalizationSubstitutionCount: 3,
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
  },
  normalizationSummary: {
    totalSubstitutions: 3,
    substitutions: [],
  },
};

describe("data-health helpers", () => {
  it("summarizes from validation report when present", () => {
    const summary = summarizePortalHealth(BUILD_METADATA, VALIDATION_REPORT);

    expect(summary.status).toBe("passed_with_warnings");
    expect(summary.errorCount).toBe(0);
    expect(summary.warningCount).toBe(2);
    expect(summary.sourceFileCount).toBe(13);
    expect(summary.filesWithIssues).toHaveLength(2);
    expect(summary.filesWithIssues[0].fileName).toBe("project_researchers.csv");
  });

  it("falls back to build warning summaries when report is missing", () => {
    const summary = summarizePortalHealth(BUILD_METADATA, null);
    expect(summary.status).toBe("passed_with_warnings");
    expect(summary.warningCount).toBe(1);
    expect(summary.filesWithIssues).toHaveLength(1);
    expect(summary.filesWithIssues[0].fileName).toBe("projects.csv");
  });

  it("returns unavailable status when artifacts are missing", () => {
    const summary = summarizePortalHealth(null, null);
    expect(summary.status).toBe("unknown");
    expect(summary.errorCount).toBe(0);
    expect(summary.warningCount).toBe(0);

    const presentation = getHealthStatusPresentation(summary.status);
    expect(presentation.label).toBe("Unavailable");
  });
});
