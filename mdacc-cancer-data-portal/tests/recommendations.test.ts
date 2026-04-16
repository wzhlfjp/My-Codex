import { describe, expect, it } from "vitest";
import {
  getDatasetRecommendations,
  getProjectRecommendations,
  getResearcherRecommendations,
} from "@/lib/recommendations";
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

function createPortalData(): PortalData {
  return {
    researchers: [
      { id: "R1", fullName: "Researcher One", department: "Oncology", active: true },
      { id: "R2", fullName: "Researcher Two", department: "Oncology", active: true },
      { id: "R3", fullName: "Researcher Three", department: "Pathology", active: true },
      { id: "R4", fullName: "Researcher Four", department: "Imaging", active: true },
      { id: "R5", fullName: "Researcher Five", department: "Oncology", active: false },
    ],
    datasets: [
      { id: "D1", datasetName: "Dataset One", datasetType: "clinical", summary: "Summary 1", active: true },
      { id: "D2", datasetName: "Dataset Two", datasetType: "genomics", summary: "Summary 2", active: true },
      { id: "D3", datasetName: "Dataset Three", datasetType: "imaging", summary: "Summary 3", active: true },
      { id: "D4", datasetName: "Dataset Four", datasetType: "clinical", summary: "Summary 4", active: false },
    ],
    projects: [
      { id: "P1", projectName: "Project One", projectType: "project", summary: "Summary 1" },
      { id: "P2", projectName: "Project Two", projectType: "project", summary: "Summary 2" },
      { id: "P3", projectName: "Project Three", projectType: "project", summary: "Summary 3" },
      { id: "P4", projectName: "Project Four", projectType: "initiative", summary: "Summary 4" },
      { id: "P5", projectName: "Project Five", projectType: "project", summary: "Summary 5" },
    ],
    technologies: [
      { id: "T1", technologyName: "Technology One", technologyCategory: "sequencing", summary: "Tech 1", active: true },
      { id: "T2", technologyName: "Technology Two", technologyCategory: "imaging", summary: "Tech 2", active: true },
    ],
    diseaseAreas: [
      { id: "C1", diseaseAreaName: "Breast Cancer", active: true },
      { id: "C2", diseaseAreaName: "Lung Cancer", active: true },
    ],
    relationships: {
      ...EMPTY_RELATIONSHIPS,
      researcherToDiseaseAreas: {
        R1: ["C1"],
        R2: ["C1"],
        R3: ["C1"],
        R4: ["C2"],
        R5: ["C1"],
      },
      researcherToTechnologies: {
        R1: ["T1"],
        R2: ["T1"],
        R3: ["T2"],
        R4: ["T2"],
        R5: ["T1"],
      },
      researcherToDatasets: {
        R1: ["D1"],
        R2: ["D1"],
        R3: ["D2"],
        R4: ["D1"],
        R5: ["D1"],
      },
      researcherToProjects: {
        R1: ["P1"],
        R2: ["P1"],
        R3: ["P2"],
        R4: ["P3"],
        R5: ["P1"],
      },
      datasetToDiseaseAreas: {
        D1: ["C1"],
        D2: ["C1"],
        D3: ["C2"],
        D4: ["C1"],
      },
      datasetToTechnologies: {
        D1: ["T1"],
        D2: ["T1"],
        D3: ["T2"],
        D4: ["T1"],
      },
      datasetToProjects: {
        D1: ["P1"],
        D2: ["P1"],
        D3: ["P2"],
        D4: ["P1"],
      },
      datasetToResearchers: {
        D1: ["R1", "R2"],
        D2: ["R1"],
        D3: ["R1"],
        D4: ["R1"],
      },
      projectToDiseaseAreas: {
        P1: ["C1"],
        P2: ["C1"],
        P3: ["C2"],
        P4: ["C2"],
        P5: [],
      },
      projectToDatasets: {
        P1: ["D1"],
        P2: ["D1"],
        P3: ["D3"],
        P4: ["D1"],
        P5: ["D1"],
      },
      projectToResearchers: {
        P1: ["R1"],
        P2: ["R1"],
        P3: ["R4"],
        P4: ["R2"],
        P5: [],
      },
    },
  };
}

describe("recommendation helpers", () => {
  it("returns ranked researcher recommendations with explainable reasons", () => {
    const result = getResearcherRecommendations("R1", createPortalData());

    expect(result.browseHref).toBe("/researchers?disease=C1");
    expect(result.browseLabel).toContain("Breast Cancer");
    expect(result.items.map((item) => item.id)).toEqual(["R2", "R3"]);
    expect(result.items[0].reason).toContain("Shares 1 disease area");
    expect(result.items[0].reason).toContain("Uses 1 overlapping technology");
    expect(result.items.find((item) => item.id === "R4")).toBeUndefined();
    expect(result.items.find((item) => item.id === "R5")).toBeUndefined();
  });

  it("returns ranked dataset recommendations and skips weak matches", () => {
    const result = getDatasetRecommendations("D1", createPortalData());

    expect(result.browseHref).toBe("/datasets?disease=C1");
    expect(result.items.map((item) => item.id)).toEqual(["D2"]);
    expect(result.items[0].reason).toContain("Shares 1 disease area");
    expect(result.items.find((item) => item.id === "D3")).toBeUndefined();
    expect(result.items.find((item) => item.id === "D4")).toBeUndefined();
  });

  it("returns project recommendations with same-type context where relevant", () => {
    const result = getProjectRecommendations("P1", createPortalData());

    expect(result.browseHref).toBe("/projects?disease=C1");
    expect(result.items.map((item) => item.id)).toEqual(["P2", "P5", "P4"]);
    expect(result.items.find((item) => item.id === "P5")?.reason).toContain("Same project type");
    expect(result.items.find((item) => item.id === "P3")).toBeUndefined();
  });

  it("handles unknown current ids gracefully", () => {
    expect(getResearcherRecommendations("missing", createPortalData())).toMatchObject({
      items: [],
      browseHref: "/researchers",
    });
    expect(getDatasetRecommendations("missing", createPortalData())).toMatchObject({
      items: [],
      browseHref: "/datasets",
    });
    expect(getProjectRecommendations("missing", createPortalData())).toMatchObject({
      items: [],
      browseHref: "/projects",
    });
  });
});
