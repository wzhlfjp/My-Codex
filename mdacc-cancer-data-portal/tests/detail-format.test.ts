import { describe, expect, it } from "vitest";
import {
  formatCountValue,
  formatDateForDisplay,
  formatRelatedSummary,
  hasDisplayValue,
  pluralizeWord,
} from "@/lib/detail-format";

describe("detail format helpers", () => {
  it("detects displayable values safely", () => {
    expect(hasDisplayValue("  ")).toBe(false);
    expect(hasDisplayValue("Researcher")).toBe(true);
    expect(hasDisplayValue(0)).toBe(true);
    expect(hasDisplayValue([])).toBe(false);
  });

  it("formats YYYY-MM-DD strings as readable dates", () => {
    expect(formatDateForDisplay("2026-04-13")).toBe("Apr 13, 2026");
    expect(formatDateForDisplay("")).toBeUndefined();
  });

  it("formats count and summary labels consistently", () => {
    expect(formatCountValue(0, "project")).toBeUndefined();
    expect(formatCountValue(2, "dataset")).toBe("2 datasets");
    expect(pluralizeWord(1, "technology")).toBe("technology");
    expect(pluralizeWord(3, "technology")).toBe("technologies");
    expect(formatRelatedSummary(3, "dataset")).toBe("3 related datasets.");
  });
});
