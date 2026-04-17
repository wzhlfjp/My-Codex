import { describe, expect, it } from "vitest";
import {
  buildCompareCards,
  buildCompareUrl,
  parseCompareEntityType,
  parseCompareIds,
} from "@/lib/compare";
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

function createPortalData(): PortalData {
  return {
    researchers: [
      { id: "R001", fullName: "Dr. A", department: "Oncology", active: true },
      { id: "R002", fullName: "Dr. B", department: "Pathology", active: true },
    ],
    projects: [{ id: "P001", projectName: "Proj 1", projectType: "project", summary: "Summary 1" }],
    datasets: [{ id: "D001", datasetName: "Dataset 1", datasetType: "clinical", summary: "Data summary", active: true }],
    technologies: [{ id: "T001", technologyName: "Tech 1", technologyCategory: "sequencing", summary: "Tech summary", active: true }],
    diseaseAreas: [{ id: "C001", diseaseAreaName: "Breast Cancer", active: true }],
    relationships: {
      ...EMPTY_RELATIONSHIPS,
      researcherToDiseaseAreas: { R001: ["C001"] },
      researcherToTechnologies: { R001: ["T001"] },
      researcherToDatasets: { R001: ["D001"] },
      researcherToProjects: { R001: ["P001"] },
      datasetToDiseaseAreas: { D001: ["C001"] },
      datasetToTechnologies: { D001: ["T001"] },
      datasetToProjects: { D001: ["P001"] },
      projectToDiseaseAreas: { P001: ["C001"] },
      projectToResearchers: { P001: ["R001"] },
      projectToDatasets: { P001: ["D001"] },
      technologyToDatasets: { T001: ["D001"] },
      technologyToResearchers: { T001: ["R001"] },
      technologyToDiseaseAreas: { T001: ["C001"] },
      diseaseAreaToResearchers: { C001: ["R001"] },
      diseaseAreaToDatasets: { C001: ["D001"] },
      diseaseAreaToTechnologies: { C001: ["T001"] },
      diseaseAreaToProjects: { C001: ["P001"] },
    },
  };
}

describe("compare helpers", () => {
  it("parses compare type and ids safely", () => {
    expect(parseCompareEntityType("researcher")).toBe("researcher");
    expect(parseCompareEntityType("technology")).toBe("technology");
    expect(parseCompareEntityType("disease-area")).toBe("disease-area");
    expect(parseCompareIds("R001,R001,R002,,R003,R004,R005")).toEqual(["R001", "R002", "R003", "R004"]);
  });

  it("builds shareable compare URLs", () => {
    expect(buildCompareUrl("dataset", ["D001", "D002"])).toBe("/compare?type=dataset&ids=D001%2CD002");
    expect(buildCompareUrl("disease-area", ["C001", "C002"])).toBe("/compare?type=disease-area&ids=C001%2CC002");
  });

  it("builds compare cards and reports missing ids", () => {
    const data = createPortalData();
    const result = buildCompareCards("researcher", ["R001", "R999"], data);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].title).toBe("Dr. A");
    expect(result.missingIds).toEqual(["R999"]);
  });

  it("builds technology compare cards", () => {
    const data = createPortalData();
    const result = buildCompareCards("technology", ["T001"], data);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].title).toBe("Tech 1");
    expect(result.cards[0].fields.find((field) => field.label === "Related Datasets")?.value).toBe("1 dataset");
  });

  it("builds disease-area compare cards", () => {
    const data = createPortalData();
    const result = buildCompareCards("disease-area", ["C001"], data);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].title).toBe("Breast Cancer");
    expect(result.cards[0].fields.find((field) => field.label === "Related Researchers")?.value).toBe("1 researcher");
  });
});
