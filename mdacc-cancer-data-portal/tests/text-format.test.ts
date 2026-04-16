import { describe, expect, it } from "vitest";
import { truncateWithEllipsis } from "@/lib/text-format";

describe("text format helpers", () => {
  it("keeps short strings unchanged", () => {
    expect(truncateWithEllipsis("Breast Cancer", 20)).toBe("Breast Cancer");
  });

  it("truncates long strings with an ellipsis", () => {
    expect(truncateWithEllipsis("very long metadata label for testing", 12)).toBe("very long m…");
  });
});
