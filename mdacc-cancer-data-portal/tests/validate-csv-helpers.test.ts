import { describe, expect, it } from "vitest";
import {
  normalizeBoolean,
  normalizeDate,
  normalizeEnumValue,
  type CsvRow,
  type RelationshipConfig,
  validateForeignKeys,
  validateRelationshipUniqueness,
} from "../scripts/validate_csv";

describe("validate_csv helper behavior", () => {
  it("normalizes booleans and dates", () => {
    expect(normalizeBoolean("yes")).toBe("TRUE");
    expect(normalizeBoolean("0")).toBe("FALSE");
    expect(normalizeDate("4/5/2026")).toBe("2026-04-05");
    expect(normalizeDate("2026-04-15")).toBe("2026-04-15");
  });

  it("normalizes known enum aliases", () => {
    expect(normalizeEnumValue("Computational Analysis")).toBe("computational");
    expect(normalizeEnumValue("Pathology/Cytology")).toBe("pathology workflow");
  });

  it("flags duplicate relationship rows", () => {
    const schema: RelationshipConfig = {
      fileName: "researcher_datasets.csv",
      requiredColumns: ["researcher_id", "dataset_id"],
      uniqueComposite: ["researcher_id", "dataset_id"],
      foreignKeys: [],
    };
    const rows: CsvRow[] = [
      { researcher_id: "R1", dataset_id: "D1" },
      { researcher_id: "R1", dataset_id: "D1" },
    ];
    const errors: string[] = [];
    validateRelationshipUniqueness(schema, rows, errors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("Duplicate relationship row");
  });

  it("flags missing foreign key references", () => {
    const schema: RelationshipConfig = {
      fileName: "dataset_technologies.csv",
      requiredColumns: ["dataset_id", "technology_id"],
      uniqueComposite: ["dataset_id", "technology_id"],
      foreignKeys: [
        {
          column: "dataset_id",
          targetFile: "datasets.csv",
          targetIdColumn: "dataset_id",
        },
      ],
    };
    const rows: CsvRow[] = [{ dataset_id: "D_MISSING", technology_id: "T1" }];
    const tables: Record<string, CsvRow[]> = {
      "datasets.csv": [{ dataset_id: "D1" }],
    };
    const errors: string[] = [];
    validateForeignKeys(schema, rows, tables, errors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("missing foreign key");
  });
});
