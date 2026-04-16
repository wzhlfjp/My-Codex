import { describe, expect, it } from "vitest";
import { shapeExploreExportRows, shapeProjectExportRows } from "@/lib/export-shape";
import type { ExploreResult, PortalData, RelationshipMaps } from "@/types/domain";

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

describe("export shape helpers", () => {
  it("flattens mixed explore rows with entity type", () => {
    const rows = shapeExploreExportRows([
      {
        id: "D1",
        type: "dataset",
        title: "Breast Atlas",
        href: "/datasets/D1",
        summary: "Atlas summary",
        diseaseAreaIds: ["C1"],
        diseaseAreaNames: ["Breast Cancer"],
        technologyNames: ["Single-cell RNA-seq"],
        chips: [],
        searchTitle: "",
        searchBody: "",
        score: 8,
      } satisfies ExploreResult,
    ]);

    expect(rows[0]).toMatchObject({
      id: "D1",
      entityType: "dataset",
      diseaseAreas: "Breast Cancer",
      technologies: "Single-cell RNA-seq",
      url: "/datasets/D1",
    });
  });

  it("normalizes project type/status in project export rows", () => {
    const portalData: PortalData = {
      researchers: [],
      datasets: [],
      technologies: [],
      diseaseAreas: [{ id: "C1", diseaseAreaName: "Breast Cancer", active: true }],
      projects: [
        {
          id: "P1",
          projectName: "Atlas Program",
          projectType: "core_resource",
          status: "in_progress",
          summary: "A program summary",
        },
      ],
      relationships: {
        ...EMPTY_RELATIONSHIPS,
        projectToDiseaseAreas: { P1: ["C1"] },
        projectToResearchers: { P1: ["R1"] },
      },
    };

    const rows = shapeProjectExportRows(portalData);
    expect(rows[0]).toMatchObject({
      projectType: "Core Resource",
      status: "In Progress",
      diseaseAreas: "Breast Cancer",
      researcherCount: 1,
    });
  });
});
