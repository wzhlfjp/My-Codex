import { describe, expect, it } from "vitest";
import { formatUpdatedMetadata, uniqueCompactMetadata } from "@/lib/entity-metadata";

describe("entity metadata helpers", () => {
  it("builds compact unique metadata chips", () => {
    expect(uniqueCompactMetadata(["Breast Cancer", "Breast Cancer", "Single-Cell", "", undefined, "Imaging"], 3)).toEqual([
      "Breast Cancer",
      "Single-Cell",
      "Imaging",
    ]);
  });

  it("formats updated metadata when a date exists", () => {
    expect(formatUpdatedMetadata("2026-04-15")).toBe("Updated 2026-04-15");
    expect(formatUpdatedMetadata("")).toBeUndefined();
    expect(formatUpdatedMetadata(undefined)).toBeUndefined();
  });
});
