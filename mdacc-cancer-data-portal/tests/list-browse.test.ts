import { describe, expect, it } from "vitest";
import { compareUpdatedDesc, matchesQueryTokens, tokenizeQuery } from "@/lib/list-browse";

describe("list browse helpers", () => {
  it("tokenizes keyword queries predictably", () => {
    expect(tokenizeQuery("  breast   cancer MRI ")).toEqual(["breast", "cancer", "mri"]);
  });

  it("matches all tokens across combined fields", () => {
    const tokens = tokenizeQuery("breast single-cell");
    expect(matchesQueryTokens(tokens, ["Breast Atlas", "single-cell profiling"])).toBe(true);
    expect(matchesQueryTokens(tokens, ["Breast Atlas", "imaging only"])).toBe(false);
  });

  it("supports acronym and synonym keyword variants", () => {
    const tokens = tokenizeQuery("mri proteomics");
    expect(matchesQueryTokens(tokens, ["Magnetic resonance imaging atlas", "Mass spectrometry protein measurement"])).toBe(
      true,
    );
  });

  it("sorts newer updates first", () => {
    expect(compareUpdatedDesc("2026-04-10", "2026-01-01")).toBeLessThan(0);
    expect(compareUpdatedDesc(undefined, "2026-01-01")).toBeGreaterThan(0);
  });
});
