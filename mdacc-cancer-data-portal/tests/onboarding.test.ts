import { describe, expect, it } from "vitest";
import { buildOnboardingLinks, buildOnboardingQuestionLinks } from "@/lib/onboarding";
import type { PortalData } from "@/types/domain";

const EMPTY_RELATIONSHIPS: PortalData["relationships"] = {
  researcherToDiseaseAreas: {},
  researcherToTechnologies: {},
  researcherToDatasets: {},
  researcherToProjects: {},
  projectToResearchers: {},
  projectToDatasets: {},
  projectToDiseaseAreas: {},
  datasetToTechnologies: {},
  datasetToDiseaseAreas: {},
  datasetToResearchers: {},
  datasetToProjects: {},
  diseaseAreaToResearchers: {},
  diseaseAreaToDatasets: {},
  diseaseAreaToProjects: {},
  diseaseAreaToTechnologies: {},
  technologyToResearchers: {},
  technologyToDatasets: {},
  technologyToDiseaseAreas: {},
};

function createPortalData(overrides?: Partial<PortalData>): PortalData {
  return {
    researchers: [],
    projects: [],
    datasets: [],
    technologies: [],
    diseaseAreas: [],
    relationships: EMPTY_RELATIONSHIPS,
    ...overrides,
  };
}

describe("onboarding helpers", () => {
  it("builds disease-aware onboarding links when related data exists", () => {
    const portalData = createPortalData({
      diseaseAreas: [
        { id: "C001", diseaseAreaName: "Breast Cancer", active: true },
        { id: "C002", diseaseAreaName: "Lung Cancer", active: true },
      ],
      relationships: {
        ...EMPTY_RELATIONSHIPS,
        diseaseAreaToResearchers: { C001: ["R1", "R2"], C002: ["R3"] },
        diseaseAreaToDatasets: { C001: ["D1"], C002: [] },
        diseaseAreaToProjects: { C001: ["P1"], C002: [] },
        diseaseAreaToTechnologies: { C001: ["T1"], C002: [] },
      },
    });

    const links = buildOnboardingLinks(portalData);
    expect(links).toHaveLength(5);
    expect(links[0].href).toContain("disease=C001");
    expect(links.some((item) => item.key === "collaboration-first")).toBe(true);

    const questionLinks = buildOnboardingQuestionLinks(portalData);
    expect(questionLinks[0].href).toContain("/researchers?disease=C001");
  });

  it("falls back to safe generic routes when disease data is sparse", () => {
    const portalData = createPortalData();
    const links = buildOnboardingLinks(portalData);
    const questionLinks = buildOnboardingQuestionLinks(portalData);

    expect(links[0].href).toBe("/explore");
    expect(links[1].href).toContain("/datasets");
    expect(questionLinks[0].href).toBe("/researchers");
    expect(questionLinks[2].href).toBe("/explore?type=technology");
  });
});
