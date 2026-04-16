import { describe, expect, it } from "vitest";
import { createExportFilename, inferExportColumns, rowsToCsv } from "@/lib/export";

describe("export helpers", () => {
  it("creates deterministic readable filenames", () => {
    const fileName = createExportFilename("Explore Results", "csv", new Date("2026-04-15T12:00:00Z"));
    expect(fileName).toBe("explore-results-2026-04-15.csv");
  });

  it("infers columns in first-seen order", () => {
    const columns = inferExportColumns([{ id: "1", name: "A" }, { name: "B", updated: "2026-04-01" }]);
    expect(columns).toEqual(["id", "name", "updated"]);
  });

  it("serializes rows to escaped csv", () => {
    const csv = rowsToCsv(
      [
        { id: "R1", summary: "Contains,comma", note: 'Has "quotes"' },
        { id: "R2", summary: "Plain", note: "" },
      ],
      ["id", "summary", "note"],
    );

    expect(csv).toContain('R1,"Contains,comma","Has ""quotes"""');
    expect(csv.split("\n")[0]).toBe("id,summary,note");
  });
});
