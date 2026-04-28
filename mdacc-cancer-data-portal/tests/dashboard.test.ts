import { describe, expect, it } from "vitest";
import {
  buildDashboardData,
  buildDiseaseTechnologyMatrix,
  rankMostConnectedResearchers,
  rankMultimodalDiseaseCoverage,
  summarizeCatalogCoverage,
  summarizeDataFreshness,
  summarizeTechnologyCategoryDistribution,
} from "@/lib/dashboard";
import type { BuildMetadata, PortalData, ValidationReport } from "@/types/domain";

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
      { id: "R001", fullName: "Dr Alpha", active: true },
      { id: "R002", fullName: "Dr Beta", active: true },
      { id: "R003", fullName: "Dr Gamma", active: true },
    ],
    projects: [{ id: "P001", projectName: "Program One", projectType: "program", summary: "Program summary" }],
    datasets: [
      { id: "D001", datasetName: "Dataset One", datasetType: "genomics", summary: "Summary", active: true },
      { id: "D002", datasetName: "Dataset Two", datasetType: "imaging", summary: "Summary", active: true },
      { id: "D003", datasetName: "Dataset Three", datasetType: "clinical", summary: "Summary", active: true },
    ],
    technologies: [
      { id: "T001", technologyName: "Tech Seq", technologyCategory: "sequencing", summary: "Summary", active: true },
      { id: "T002", technologyName: "Tech Img 1", technologyCategory: "imaging", summary: "Summary", active: true },
      { id: "T003", technologyName: "Tech Comp", technologyCategory: "computational", summary: "Summary", active: true },
      { id: "T004", technologyName: "Tech Img 2", technologyCategory: "imaging", summary: "Summary", active: true },
    ],
    diseaseAreas: [
      { id: "C001", diseaseAreaName: "Breast Cancer", active: true },
      { id: "C002", diseaseAreaName: "Lung Cancer", active: true },
    ],
    relationships: {
      ...EMPTY_RELATIONSHIPS,
      researcherToDiseaseAreas: {
        R001: ["C001"],
        R002: ["C001", "C002"],
      },
      researcherToTechnologies: {
        R001: ["T001", "T002"],
        R002: ["T003"],
      },
      researcherToDatasets: {
        R001: ["D001"],
        R002: ["D002", "D003"],
      },
      researcherToProjects: {
        R001: ["P001"],
      },
      projectToResearchers: {
        P001: ["R001"],
      },
      projectToDatasets: {
        P001: ["D001"],
      },
      projectToDiseaseAreas: {
        P001: ["C001"],
      },
      datasetToTechnologies: {
        D001: ["T001", "T002"],
        D002: ["T003"],
        D003: ["T002", "T004"],
      },
      datasetToDiseaseAreas: {
        D001: ["C001"],
        D002: ["C001"],
        D003: ["C002"],
      },
      diseaseAreaToResearchers: {
        C001: ["R001", "R002"],
        C002: ["R002"],
      },
      diseaseAreaToDatasets: {
        C001: ["D001", "D002"],
        C002: ["D003"],
      },
      diseaseAreaToProjects: {
        C001: ["P001"],
      },
      diseaseAreaToTechnologies: {
        C001: ["T001"],
      },
      technologyToResearchers: {
        T001: ["R001"],
        T002: ["R001"],
        T003: ["R002"],
      },
      technologyToDatasets: {
        T001: ["D001"],
        T002: ["D001", "D003"],
        T003: ["D002"],
        T004: ["D003"],
      },
      technologyToDiseaseAreas: {
        T001: ["C001"],
        T002: ["C001", "C002"],
        T003: ["C001", "C002"],
        T004: ["C002"],
      },
    },
  };
}

const BUILD_METADATA: BuildMetadata = {
  generatedAt: "2026-04-20T00:00:00.000Z",
  sourceFilesUsed: ["researchers.csv", "datasets.csv", "technologies.csv"],
  processedEntityCounts: {
    researchers: 9,
    projects: 2,
    datasets: 7,
    technologies: 6,
    diseaseAreas: 4,
  },
  latestSourceUpdateDate: "2026-04-18",
  validationStatus: "passed_with_warnings",
  validationWarningsSummary: {
    count: 3,
    warnings: ["[projects.csv] No rows found."],
  },
};

const VALIDATION_REPORT: ValidationReport = {
  generatedAt: "2026-04-20T00:10:00.000Z",
  status: "passed_with_warnings",
  summary: {
    filesScanned: 13,
    tableCount: { core: 5, relationship: 8, total: 13 },
    rowCount: 123,
    issueCountBySeverity: { error: 0, warning: 4 },
    issueCountByType: {},
    normalizationSubstitutionCount: 5,
  },
  issuesByFile: {},
  normalizationSummary: {
    totalSubstitutions: 5,
    substitutions: [],
  },
};

describe("dashboard helpers", () => {
  it("summarizes catalog coverage with build-metadata overrides", () => {
    const coverage = summarizeCatalogCoverage(createPortalData(), BUILD_METADATA);
    expect(coverage).toEqual({
      researchers: 9,
      projects: 2,
      datasets: 7,
      technologies: 6,
      diseaseAreas: 4,
      total: 28,
    });
  });

  it("builds ranked technology category distribution", () => {
    const rows = summarizeTechnologyCategoryDistribution(createPortalData());
    expect(rows[0]).toEqual({ category: "imaging", count: 2 });
    expect(rows[1]).toEqual({ category: "computational", count: 1 });
    expect(rows[2]).toEqual({ category: "sequencing", count: 1 });
  });

  it("ranks multimodal disease coverage with an explainable additive score", () => {
    const rows = rankMultimodalDiseaseCoverage(createPortalData());
    expect(rows[0].diseaseAreaId).toBe("C001");
    expect(rows[0].researcherCount).toBe(2);
    expect(rows[0].datasetCount).toBe(2);
    expect(rows[0].technologyCount).toBe(3);
    expect(rows[0].technologyCategoryCount).toBe(3);
    expect(rows[0].coverageScore).toBe(10);
    expect(rows[1].coverageScore).toBe(7);
  });

  it("builds disease-technology matrix rows and combination rankings", () => {
    const matrix = buildDiseaseTechnologyMatrix(createPortalData());
    expect(matrix.categories).toEqual(["computational", "imaging", "sequencing"]);
    expect(matrix.rows).toHaveLength(2);
    expect(matrix.rows[0].diseaseAreaId).toBe("C001");
    expect(matrix.rows[0].countsByCategory.imaging).toBe(1);
    expect(matrix.rows[1].countsByCategory.imaging).toBe(2);
    expect(matrix.combinations[0]).toEqual({
      diseaseAreaId: "C002",
      diseaseAreaName: "Lung Cancer",
      technologyCategory: "imaging",
      count: 2,
    });
  });

  it("ranks most connected researchers using total connection counts", () => {
    const rows = rankMostConnectedResearchers(createPortalData());
    expect(rows[0].researcherName).toBe("Dr Alpha");
    expect(rows[0].totalConnectionCount).toBe(5);
    expect(rows[1].researcherName).toBe("Dr Beta");
    expect(rows[1].totalConnectionCount).toBe(5);
    expect(rows[2].totalConnectionCount).toBe(0);
  });

  it("handles sparse project data and missing freshness artifacts safely", () => {
    const portalData = { ...createPortalData(), projects: [] };
    const rows = rankMostConnectedResearchers(portalData);
    expect(rows[0].projectCount).toBe(1);

    const freshness = summarizeDataFreshness(null, null);
    expect(freshness.validationStatus).toBe("unknown");
    expect(freshness.warningCount).toBe(0);
    expect(freshness.sourceFileCount).toBe(0);
  });

  it("builds full dashboard data payload for page consumption", () => {
    const dashboard = buildDashboardData(createPortalData(), BUILD_METADATA, VALIDATION_REPORT);
    expect(dashboard.coverage.total).toBe(28);
    expect(dashboard.diseaseAreasByResearcherLinks[0].diseaseAreaId).toBe("C001");
    expect(dashboard.diseaseAreasByDatasetLinks[0].diseaseAreaId).toBe("C001");
    expect(dashboard.dataFreshness.warningCount).toBe(4);
    expect(dashboard.dataFreshness.sourceFileCount).toBe(13);
  });
});
