import { describe, expect, it } from "vitest";
import { renderCsvHeader } from "../scripts/generate_csv_templates";

describe("csv template helpers", () => {
  it("renders a single-line CSV header", () => {
    expect(renderCsvHeader(["id", "name", "active"])).toBe("id,name,active\n");
  });
});
