import { describe, expect, it } from "vitest";
import { formatProjectStatus, formatProjectTimeline, formatProjectType } from "@/lib/project-format";

describe("project format helpers", () => {
  it("normalizes status labels for display", () => {
    expect(formatProjectStatus("in_progress")).toBe("In Progress");
    expect(formatProjectStatus("active")).toBe("Active");
    expect(formatProjectStatus(undefined)).toBeUndefined();
  });

  it("normalizes project type labels for display", () => {
    expect(formatProjectType("core_resource")).toBe("Core Resource");
    expect(formatProjectType("program")).toBe("Program");
  });

  it("builds project timeline labels", () => {
    expect(formatProjectTimeline(2023, 2026)).toBe("2023 to 2026");
    expect(formatProjectTimeline(2024)).toBe("Since 2024");
    expect(formatProjectTimeline(undefined, 2027)).toBe("Through 2027");
    expect(formatProjectTimeline()).toBeUndefined();
  });
});
