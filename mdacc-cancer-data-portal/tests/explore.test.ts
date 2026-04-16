import { describe, expect, it } from "vitest";
import { prepareExploreData } from "@/lib/explore";
import type { PortalData, RelationshipMaps } from "@/types/domain";

const EMPTY_RELATIONSHIPS: RelationshipMaps = {
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

function createPortalFixture(): PortalData {
  return {
    researchers: [
      {
        id: "R1",
        fullName: "Alice Carter",
        title: "Professor",
        department: "Oncology",
        shortBio: "Studies breast cancer biology using single-cell data.",
        active: true,
      },
    ],
    projects: [
      {
        id: "P1",
        projectName: "Breast Atlas Program",
        projectType: "program",
        summary: "Cross-team breast cancer collaboration initiative.",
      },
    ],
    datasets: [
      {
        id: "D1",
        datasetName: "Breast Atlas Cohort",
        datasetType: "single-cell",
        summary: "Single-cell tumor atlas for breast cancer cohorts.",
        active: true,
      },
    ],
    technologies: [
      {
        id: "T1",
        technologyName: "Mass Spectrometry",
        technologyCategory: "mass spectrometry",
        summary: "Protein measurement platform.",
        active: true,
      },
    ],
    diseaseAreas: [
      { id: "C1", diseaseAreaName: "Breast Cancer", active: true },
      { id: "C2", diseaseAreaName: "Leukemia", active: true },
    ],
    relationships: {
      ...EMPTY_RELATIONSHIPS,
      researcherToDiseaseAreas: { R1: ["C1"] },
      researcherToTechnologies: { R1: ["T1"] },
      researcherToDatasets: { R1: ["D1"] },
      projectToResearchers: { P1: ["R1"] },
      projectToDatasets: { P1: ["D1"] },
      projectToDiseaseAreas: { P1: ["C1"] },
      datasetToDiseaseAreas: { D1: ["C1"] },
      datasetToTechnologies: { D1: ["T1"] },
      diseaseAreaToResearchers: { C1: ["R1"] },
      diseaseAreaToDatasets: { C1: ["D1"] },
      diseaseAreaToTechnologies: { C1: ["T1"] },
      technologyToDatasets: { T1: ["D1"] },
      technologyToResearchers: { T1: ["R1"] },
      technologyToDiseaseAreas: { T1: ["C1"] },
    },
  };
}

describe("prepareExploreData", () => {
  it("matches keywords case-insensitively across searchable fields", () => {
    const data = prepareExploreData({ q: "BREAST" }, createPortalFixture());
    expect(data.results.map((item) => item.id)).toEqual(["D1", "P1", "C1", "R1", "T1"]);
  });

  it("supports multi-token matching with AND semantics", () => {
    const data = prepareExploreData({ q: "single-cell breast" }, createPortalFixture());
    expect(data.results.map((item) => item.id)).toEqual(["D1", "R1"]);
  });

  it("applies entity-type filtering", () => {
    const data = prepareExploreData({ type: "technology" }, createPortalFixture());
    expect(data.results).toHaveLength(1);
    expect(data.results[0].id).toBe("T1");
    expect(data.results[0].type).toBe("technology");
  });

  it("includes projects in entity-type filtering", () => {
    const data = prepareExploreData({ type: "project" }, createPortalFixture());
    expect(data.results).toHaveLength(1);
    expect(data.results[0].id).toBe("P1");
    expect(data.results[0].type).toBe("project");
  });

  it("applies disease-area filtering across mixed entities", () => {
    const data = prepareExploreData({ disease: "C2" }, createPortalFixture());
    expect(data.results.map((item) => item.id)).toEqual(["C2"]);
  });

  it("keeps higher-score results first for matching queries", () => {
    const data = prepareExploreData({ q: "breast cancer" }, createPortalFixture());
    expect(data.results[0].id).toBe("C1");
    expect(data.results[0].score).toBeGreaterThanOrEqual(data.results[1].score);
  });

  it("supports synonym-aware matches for explore keywords", () => {
    const data = prepareExploreData({ q: "proteomics" }, createPortalFixture());
    expect(data.results[0].id).toBe("T1");
    expect(data.results.some((item) => item.id === "T1")).toBe(true);
  });
});
