import type { ExploreResult, PortalData, Project, RelationshipMaps } from "@/types/domain";
import type { ExportRow } from "@/lib/export";
import { serializeList } from "@/lib/export";
import { formatProjectStatus, formatProjectType } from "@/lib/project-format";

function baseUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function shapeExploreExportRows(results: ExploreResult[]): ExportRow[] {
  return results.map((result) => ({
    id: result.id,
    entityType: result.type,
    title: result.title,
    summary: result.summary ?? "",
    diseaseAreas: serializeList(result.diseaseAreaNames, 5),
    technologies: serializeList(result.technologyNames, 5),
    score: result.score,
    url: baseUrl(result.href),
  }));
}

export function shapeResearcherExportRows(data: PortalData): ExportRow[] {
  const { researchers, diseaseAreas, technologies, relationships } = data;
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((item) => [item.id, item.technologyName]));

  return researchers.map((researcher) => ({
    id: researcher.id,
    name: researcher.fullName,
    title: researcher.title ?? "",
    department: researcher.department ?? "",
    centerProgram: researcher.centerProgram ?? "",
    diseaseAreas: serializeList((relationships.researcherToDiseaseAreas[researcher.id] ?? []).map((id) => diseaseNameById[id]), 5),
    technologies: serializeList(
      (relationships.researcherToTechnologies[researcher.id] ?? []).map((id) => technologyNameById[id]),
      5,
    ),
    updated: researcher.lastUpdated ?? "",
    url: `/researchers/${researcher.id}`,
  }));
}

export function shapeDatasetExportRows(data: PortalData): ExportRow[] {
  const { datasets, diseaseAreas, technologies, relationships } = data;
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((item) => [item.id, item.technologyName]));

  return datasets.map((dataset) => ({
    id: dataset.id,
    name: dataset.datasetName,
    datasetType: dataset.datasetType,
    summary: dataset.summary,
    diseaseAreas: serializeList((relationships.datasetToDiseaseAreas[dataset.id] ?? []).map((id) => diseaseNameById[id]), 5),
    technologies: serializeList((relationships.datasetToTechnologies[dataset.id] ?? []).map((id) => technologyNameById[id]), 5),
    updated: dataset.lastUpdated ?? "",
    url: `/datasets/${dataset.id}`,
  }));
}

export function shapeTechnologyExportRows(data: PortalData): ExportRow[] {
  const { technologies, diseaseAreas, relationships } = data;
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));

  return technologies.map((technology) => ({
    id: technology.id,
    name: technology.technologyName,
    category: technology.technologyCategory,
    summary: technology.summary,
    diseaseAreas: serializeList(
      (relationships.technologyToDiseaseAreas[technology.id] ?? []).map((id) => diseaseNameById[id]),
      5,
    ),
    datasetCount: (relationships.technologyToDatasets[technology.id] ?? []).length,
    researcherCount: (relationships.technologyToResearchers[technology.id] ?? []).length,
    updated: technology.lastUpdated ?? "",
    url: `/technologies/${technology.id}`,
  }));
}

export function shapeDiseaseAreaExportRows(data: PortalData): ExportRow[] {
  const { diseaseAreas, relationships } = data;

  return diseaseAreas.map((diseaseArea) => ({
    id: diseaseArea.id,
    name: diseaseArea.diseaseAreaName,
    diseaseGroup: diseaseArea.diseaseGroup ?? "",
    summary: diseaseArea.summary ?? "",
    researcherCount: (relationships.diseaseAreaToResearchers[diseaseArea.id] ?? []).length,
    datasetCount: (relationships.diseaseAreaToDatasets[diseaseArea.id] ?? []).length,
    technologyCount: (relationships.diseaseAreaToTechnologies[diseaseArea.id] ?? []).length,
    projectCount: (relationships.diseaseAreaToProjects[diseaseArea.id] ?? []).length,
    updated: diseaseArea.lastUpdated ?? "",
    url: `/disease-areas/${diseaseArea.id}`,
  }));
}

function shapeProjectExportRow(project: Project, relationships: RelationshipMaps, diseaseNameById: Record<string, string>): ExportRow {
  return {
    id: project.id,
    name: project.projectName,
    projectType: formatProjectType(project.projectType) ?? project.projectType,
    status: formatProjectStatus(project.status) ?? "",
    summary: project.summary,
    diseaseAreas: serializeList((relationships.projectToDiseaseAreas[project.id] ?? []).map((id) => diseaseNameById[id]), 5),
    researcherCount: (relationships.projectToResearchers[project.id] ?? []).length,
    datasetCount: (relationships.projectToDatasets[project.id] ?? []).length,
    updated: project.lastUpdated ?? "",
    url: `/projects/${project.id}`,
  };
}

export function shapeProjectExportRows(data: PortalData): ExportRow[] {
  const { projects, diseaseAreas, relationships } = data;
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  return projects.map((project) => shapeProjectExportRow(project, relationships, diseaseNameById));
}
