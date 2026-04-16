import { describe, expect, it } from "vitest";
import { buildValidationReport, inferIssueType, type ValidationResult } from "../scripts/validate_csv";

describe("validation report helpers", () => {
  it("infers issue types from message text", () => {
    expect(inferIssueType("[a.csv] Missing required column: id")).toBe("missing_required_column");
    expect(inferIssueType("[b.csv] Row 3 has missing foreign key x=y; target t.id not found")).toBe(
      "missing_foreign_key",
    );
    expect(inferIssueType("some unexpected message")).toBe("other");
  });

  it("builds grouped summary counts by severity, file, and issue type", () => {
    const result: ValidationResult = {
      ok: false,
      status: "failed",
      errors: [
        "[datasets.csv] Missing required column: dataset_name",
        "[dataset_technologies.csv] Row 2 has missing foreign key technology_id=T999; target technologies.csv.technology_id not found",
      ],
      warnings: ["[projects.csv] No rows found."],
      tables: {
        "datasets.csv": [],
        "dataset_technologies.csv": [{ dataset_id: "D1", technology_id: "T999" }],
        "projects.csv": [],
      },
      normalizationSummary: {
        totalSubstitutions: 2,
        substitutions: [
          {
            fileName: "technologies.csv",
            column: "technology_category",
            from: "pathology/cytology",
            to: "pathology workflow",
            count: 2,
          },
        ],
      },
    };

    const report = buildValidationReport(result, { generatedAt: "2026-04-15T00:00:00.000Z" });

    expect(report.generatedAt).toBe("2026-04-15T00:00:00.000Z");
    expect(report.status).toBe("failed");
    expect(report.summary.issueCountBySeverity).toEqual({ error: 2, warning: 1 });
    expect(report.summary.issueCountByType.missing_required_column).toBe(1);
    expect(report.summary.issueCountByType.missing_foreign_key).toBe(1);
    expect(report.summary.issueCountByType.empty_table).toBe(1);
    expect(report.issuesByFile["dataset_technologies.csv"].errors).toHaveLength(1);
    expect(report.issuesByFile["projects.csv"].warnings).toHaveLength(1);
    expect(report.summary.normalizationSubstitutionCount).toBe(2);
  });
});
