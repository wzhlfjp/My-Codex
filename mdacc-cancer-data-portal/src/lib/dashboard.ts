import { getBuildMetadata, getPortalData, getValidationReport } from "@/lib/data/processed-data";
import type { BuildMetadata, PortalData, ValidationReport, ValidationStatus } from "@/types/domain";

export type CatalogCoverage = {
  researchers: number;
  datasets: number;
  technologies: number;
  diseaseAreas: number;
  projects: number;
  total: number;
};

export type DiseaseAreaLinkRow = {
  diseaseAreaId: string;
  diseaseAreaName: string;
  count: number;
};

export type TechnologyCategoryRow = {
  category: string;
  count: number;
};

export type MultimodalCoverageRow = {
  diseaseAreaId: string;
  diseaseAreaName: string;
  researcherCount: number;
  datasetCount: number;
  technologyCount: number;
  technologyCategoryCount: number;
  projectCount: number;
  coverageScore: number;
};

export type DiseaseTechnologyMatrixRow = {
  diseaseAreaId: string;
  diseaseAreaName: string;
  countsByCategory: Record<string, number>;
  totalCount: number;
};

export type DiseaseTechnologyCombinationRow = {
  diseaseAreaId: string;
  diseaseAreaName: string;
  technologyCategory: string;
  count: number;
};

export type DiseaseTechnologyMatrix = {
  categories: string[];
  rows: DiseaseTechnologyMatrixRow[];
  combinations: DiseaseTechnologyCombinationRow[];
};

export type ConnectedResearcherRow = {
  researcherId: string;
  researcherName: string;
  diseaseAreaCount: number;
  datasetCount: number;
  technologyCount: number;
  projectCount: number;
  totalConnectionCount: number;
};

export type DataFreshnessSnapshot = {
  generatedAt?: string;
  validationGeneratedAt?: string;
  latestSourceUpdateDate?: string;
  validationStatus: ValidationStatus | "unknown";
  warningCount: number;
  sourceFileCount: number;
  rowCount?: number;
  normalizationSubstitutionCount?: number;
};

export type DashboardData = {
  coverage: CatalogCoverage;
  diseaseAreasByResearcherLinks: DiseaseAreaLinkRow[];
  diseaseAreasByDatasetLinks: DiseaseAreaLinkRow[];
  technologyCategoryDistribution: TechnologyCategoryRow[];
  multimodalDiseaseCoverage: MultimodalCoverageRow[];
  diseaseTechnologyMatrix: DiseaseTechnologyMatrix;
  connectedResearchers: ConnectedResearcherRow[];
  dataFreshness: DataFreshnessSnapshot;
};

function uniqueIds(ids: string[] | undefined): string[] {
  return [...new Set(ids ?? [])];
}

function compareCountThenName(a: { count: number; name: string }, b: { count: number; name: string }): number {
  if (b.count !== a.count) {
    return b.count - a.count;
  }
  return a.name.localeCompare(b.name);
}

function getTechnologyIdsForDiseaseArea(diseaseAreaId: string, portalData: PortalData): string[] {
  const { relationships } = portalData;
  const technologyIds = new Set<string>();

  uniqueIds(relationships.diseaseAreaToTechnologies[diseaseAreaId]).forEach((id) => technologyIds.add(id));

  uniqueIds(relationships.diseaseAreaToDatasets[diseaseAreaId]).forEach((datasetId) => {
    uniqueIds(relationships.datasetToTechnologies[datasetId]).forEach((technologyId) => technologyIds.add(technologyId));
  });

  uniqueIds(relationships.diseaseAreaToResearchers[diseaseAreaId]).forEach((researcherId) => {
    uniqueIds(relationships.researcherToTechnologies[researcherId]).forEach((technologyId) => technologyIds.add(technologyId));
  });

  return [...technologyIds];
}

function buildTechnologyCategoryCounts(portalData: PortalData): Record<string, number> {
  return portalData.technologies.reduce<Record<string, number>>((acc, technology) => {
    const category = technology.technologyCategory?.trim() || "unspecified";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});
}

export function summarizeCatalogCoverage(portalData: PortalData, buildMetadata: BuildMetadata | null): CatalogCoverage {
  const researchers = buildMetadata?.processedEntityCounts.researchers ?? portalData.researchers.length;
  const datasets = buildMetadata?.processedEntityCounts.datasets ?? portalData.datasets.length;
  const technologies = buildMetadata?.processedEntityCounts.technologies ?? portalData.technologies.length;
  const diseaseAreas = buildMetadata?.processedEntityCounts.diseaseAreas ?? portalData.diseaseAreas.length;
  const projects = buildMetadata?.processedEntityCounts.projects ?? portalData.projects.length;

  return {
    researchers,
    datasets,
    technologies,
    diseaseAreas,
    projects,
    total: researchers + datasets + technologies + diseaseAreas + projects,
  };
}

export function rankDiseaseAreasByLinkedResearchers(portalData: PortalData): DiseaseAreaLinkRow[] {
  const { diseaseAreas, relationships } = portalData;
  return diseaseAreas
    .map((diseaseArea) => ({
      diseaseAreaId: diseaseArea.id,
      diseaseAreaName: diseaseArea.diseaseAreaName,
      count: uniqueIds(relationships.diseaseAreaToResearchers[diseaseArea.id]).length,
    }))
    .sort((a, b) => compareCountThenName({ count: a.count, name: a.diseaseAreaName }, { count: b.count, name: b.diseaseAreaName }));
}

export function rankDiseaseAreasByLinkedDatasets(portalData: PortalData): DiseaseAreaLinkRow[] {
  const { diseaseAreas, relationships } = portalData;
  return diseaseAreas
    .map((diseaseArea) => ({
      diseaseAreaId: diseaseArea.id,
      diseaseAreaName: diseaseArea.diseaseAreaName,
      count: uniqueIds(relationships.diseaseAreaToDatasets[diseaseArea.id]).length,
    }))
    .sort((a, b) => compareCountThenName({ count: a.count, name: a.diseaseAreaName }, { count: b.count, name: b.diseaseAreaName }));
}

export function summarizeTechnologyCategoryDistribution(portalData: PortalData): TechnologyCategoryRow[] {
  return Object.entries(buildTechnologyCategoryCounts(portalData))
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => compareCountThenName({ count: a.count, name: a.category }, { count: b.count, name: b.category }));
}

export function rankMultimodalDiseaseCoverage(portalData: PortalData): MultimodalCoverageRow[] {
  const { diseaseAreas, technologies, relationships } = portalData;
  const categoryByTechnologyId = Object.fromEntries(
    technologies.map((technology) => [technology.id, technology.technologyCategory?.trim() || "unspecified"]),
  );

  return diseaseAreas
    .map((diseaseArea) => {
      const researcherCount = uniqueIds(relationships.diseaseAreaToResearchers[diseaseArea.id]).length;
      const datasetCount = uniqueIds(relationships.diseaseAreaToDatasets[diseaseArea.id]).length;
      const projectCount = uniqueIds(relationships.diseaseAreaToProjects[diseaseArea.id]).length;
      const technologyIds = getTechnologyIdsForDiseaseArea(diseaseArea.id, portalData);
      const categories = [...new Set(technologyIds.map((technologyId) => categoryByTechnologyId[technologyId]).filter(Boolean))];
      const technologyCount = technologyIds.length;
      const technologyCategoryCount = categories.length;
      const coverageScore = researcherCount + datasetCount + technologyCount + technologyCategoryCount;

      return {
        diseaseAreaId: diseaseArea.id,
        diseaseAreaName: diseaseArea.diseaseAreaName,
        researcherCount,
        datasetCount,
        technologyCount,
        technologyCategoryCount,
        projectCount,
        coverageScore,
      };
    })
    .sort((a, b) => {
      if (b.coverageScore !== a.coverageScore) {
        return b.coverageScore - a.coverageScore;
      }
      return a.diseaseAreaName.localeCompare(b.diseaseAreaName);
    });
}

export function buildDiseaseTechnologyMatrix(portalData: PortalData): DiseaseTechnologyMatrix {
  const { diseaseAreas, technologies } = portalData;
  const technologyById = Object.fromEntries(technologies.map((technology) => [technology.id, technology]));
  const categories = [...new Set(technologies.map((technology) => technology.technologyCategory?.trim() || "unspecified"))]
    .sort((a, b) => a.localeCompare(b));

  const rows = diseaseAreas
    .map((diseaseArea) => {
      const countsByCategory = Object.fromEntries(categories.map((category) => [category, 0])) as Record<string, number>;
      const technologyIds = getTechnologyIdsForDiseaseArea(diseaseArea.id, portalData);

      technologyIds.forEach((technologyId) => {
        const category = technologyById[technologyId]?.technologyCategory?.trim() || "unspecified";
        countsByCategory[category] = (countsByCategory[category] ?? 0) + 1;
      });

      const totalCount = Object.values(countsByCategory).reduce((sum, count) => sum + count, 0);

      return {
        diseaseAreaId: diseaseArea.id,
        diseaseAreaName: diseaseArea.diseaseAreaName,
        countsByCategory,
        totalCount,
      };
    })
    .sort((a, b) => {
      if (b.totalCount !== a.totalCount) {
        return b.totalCount - a.totalCount;
      }
      return a.diseaseAreaName.localeCompare(b.diseaseAreaName);
    });

  const combinations = rows
    .flatMap((row) =>
      categories
        .map((category) => ({
          diseaseAreaId: row.diseaseAreaId,
          diseaseAreaName: row.diseaseAreaName,
          technologyCategory: category,
          count: row.countsByCategory[category] ?? 0,
        }))
        .filter((item) => item.count > 0),
    )
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      if (a.diseaseAreaName !== b.diseaseAreaName) {
        return a.diseaseAreaName.localeCompare(b.diseaseAreaName);
      }
      return a.technologyCategory.localeCompare(b.technologyCategory);
    });

  return {
    categories,
    rows,
    combinations,
  };
}

export function rankMostConnectedResearchers(portalData: PortalData): ConnectedResearcherRow[] {
  const { researchers, relationships } = portalData;

  return researchers
    .map((researcher) => {
      const diseaseAreaCount = uniqueIds(relationships.researcherToDiseaseAreas[researcher.id]).length;
      const datasetCount = uniqueIds(relationships.researcherToDatasets[researcher.id]).length;
      const technologyCount = uniqueIds(relationships.researcherToTechnologies[researcher.id]).length;
      const projectCount = uniqueIds(relationships.researcherToProjects[researcher.id]).length;
      const totalConnectionCount = diseaseAreaCount + datasetCount + technologyCount + projectCount;

      return {
        researcherId: researcher.id,
        researcherName: researcher.fullName,
        diseaseAreaCount,
        datasetCount,
        technologyCount,
        projectCount,
        totalConnectionCount,
      };
    })
    .sort((a, b) => {
      if (b.totalConnectionCount !== a.totalConnectionCount) {
        return b.totalConnectionCount - a.totalConnectionCount;
      }
      return a.researcherName.localeCompare(b.researcherName);
    });
}

export function summarizeDataFreshness(
  buildMetadata: BuildMetadata | null,
  validationReport: ValidationReport | null,
): DataFreshnessSnapshot {
  return {
    generatedAt: buildMetadata?.generatedAt,
    validationGeneratedAt: validationReport?.generatedAt,
    latestSourceUpdateDate: buildMetadata?.latestSourceUpdateDate,
    validationStatus: validationReport?.status ?? buildMetadata?.validationStatus ?? "unknown",
    warningCount: validationReport?.summary.issueCountBySeverity.warning ?? buildMetadata?.validationWarningsSummary.count ?? 0,
    sourceFileCount: validationReport?.summary.filesScanned ?? buildMetadata?.sourceFilesUsed.length ?? 0,
    rowCount: validationReport?.summary.rowCount,
    normalizationSubstitutionCount: validationReport?.summary.normalizationSubstitutionCount,
  };
}

export function buildDashboardData(
  portalData: PortalData,
  buildMetadata: BuildMetadata | null,
  validationReport: ValidationReport | null,
): DashboardData {
  return {
    coverage: summarizeCatalogCoverage(portalData, buildMetadata),
    diseaseAreasByResearcherLinks: rankDiseaseAreasByLinkedResearchers(portalData),
    diseaseAreasByDatasetLinks: rankDiseaseAreasByLinkedDatasets(portalData),
    technologyCategoryDistribution: summarizeTechnologyCategoryDistribution(portalData),
    multimodalDiseaseCoverage: rankMultimodalDiseaseCoverage(portalData),
    diseaseTechnologyMatrix: buildDiseaseTechnologyMatrix(portalData),
    connectedResearchers: rankMostConnectedResearchers(portalData),
    dataFreshness: summarizeDataFreshness(buildMetadata, validationReport),
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [portalData, buildMetadata, validationReport] = await Promise.all([
    getPortalData(),
    getBuildMetadata(),
    getValidationReport(),
  ]);

  return buildDashboardData(portalData, buildMetadata, validationReport);
}
