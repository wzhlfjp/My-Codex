import { describe, expect, it } from "vitest";
import {
  buildMap,
  invertMap,
  latestDateFromRows,
  mergeMaps,
  toNumber,
  toOptional,
} from "../scripts/csv_to_json";

describe("csv_to_json helper behavior", () => {
  it("builds and inverts relationship maps", () => {
    const map = buildMap(
      [
        { researcher_id: "R1", dataset_id: "D1" },
        { researcher_id: "R1", dataset_id: "D2" },
        { researcher_id: "R2", dataset_id: "D1" },
      ],
      "researcher_id",
      "dataset_id",
    );
    expect(map).toEqual({
      R1: ["D1", "D2"],
      R2: ["D1"],
    });
    expect(invertMap(map)).toEqual({
      D1: ["R1", "R2"],
      D2: ["R1"],
    });
  });

  it("merges maps with de-duplicated values", () => {
    const merged = mergeMaps({ C1: ["T1", "T2"] }, { C1: ["T2", "T3"] }, { C2: ["T4"] });
    expect(merged).toEqual({
      C1: ["T1", "T2", "T3"],
      C2: ["T4"],
    });
  });

  it("parses optional and numeric fields safely", () => {
    expect(toOptional("  text ")).toBe("text");
    expect(toOptional("   ")).toBeUndefined();
    expect(toNumber("2025")).toBe(2025);
    expect(toNumber("not-a-number")).toBeUndefined();
  });

  it("returns latest source update date from rows", () => {
    const latest = latestDateFromRows([
      { last_updated: "2025-10-02" },
      { last_updated: "2026-01-15" },
      { last_updated: "" },
    ]);
    expect(latest).toBe("2026-01-15");
  });
});
