import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  BuildMetadata,
  Dataset,
  DatasetDetailData,
  DiseaseArea,
  DiseaseAreaDetailData,
  PortalData,
  Project,
  ProjectDetailData,
  RelationshipMaps,
  Researcher,
  ResearcherDetailData,
  Technology,
  TechnologyDetailData,
  ValidationReport,
} from "@/types/domain";

const PROCESSED_DATA_DIR = path.join(process.cwd(), "data", "processed");

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

let portalDataPromise: Promise<PortalData> | null = null;
let buildMetadataPromise: Promise<BuildMetadata | null> | null = null;
let validationReportPromise: Promise<ValidationReport | null> | null = null;

async function readProcessedJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(PROCESSED_DATA_DIR, fileName);
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function indexById<T extends { id: string }>(records: T[]): Record<string, T> {
  return Object.fromEntries(records.map((record) => [record.id, record]));
}

function pickByIds<T extends { id: string }>(ids: string[] | undefined, map: Record<string, T>): T[] {
  if (!ids || ids.length === 0) {
    return [];
  }
  return ids.map((id) => map[id]).filter((item): item is T => Boolean(item));
}

export async function getPortalData(): Promise<PortalData> {
  if (!portalDataPromise) {
    portalDataPromise = (async () => {
      const [researchers, projects, datasets, technologies, diseaseAreas, relationships] = await Promise.all([
        readProcessedJson<Researcher[]>("researchers.json", []),
        readProcessedJson<Project[]>("projects.json", []),
        readProcessedJson<Dataset[]>("datasets.json", []),
        readProcessedJson<Technology[]>("technologies.json", []),
        readProcessedJson<DiseaseArea[]>("disease_areas.json", []),
        readProcessedJson<RelationshipMaps>("relationships.json", EMPTY_RELATIONSHIPS),
      ]);

      return {
        researchers,
        projects,
        datasets,
        technologies,
        diseaseAreas,
        relationships,
      };
    })();
  }

  return portalDataPromise;
}

export async function getResearchers(): Promise<Researcher[]> {
  const { researchers } = await getPortalData();
  return researchers;
}

export async function getDatasets(): Promise<Dataset[]> {
  const { datasets } = await getPortalData();
  return datasets;
}

export async function getTechnologies(): Promise<Technology[]> {
  const { technologies } = await getPortalData();
  return technologies;
}

export async function getDiseaseAreas(): Promise<DiseaseArea[]> {
  const { diseaseAreas } = await getPortalData();
  return diseaseAreas;
}

export async function getProjects(): Promise<Project[]> {
  const { projects } = await getPortalData();
  return projects;
}

export async function getBuildMetadata(): Promise<BuildMetadata | null> {
  if (!buildMetadataPromise) {
    buildMetadataPromise = readProcessedJson<BuildMetadata | null>("build_metadata.json", null);
  }
  return buildMetadataPromise;
}

export async function getValidationReport(): Promise<ValidationReport | null> {
  if (!validationReportPromise) {
    validationReportPromise = readProcessedJson<ValidationReport | null>("validation_report.json", null);
  }
  return validationReportPromise;
}

export async function getPortalSnapshot(): Promise<{
  researcherCount: number;
  projectCount: number;
  datasetCount: number;
  technologyCount: number;
  diseaseAreaCount: number;
  buildGeneratedAt?: string;
  latestSourceUpdateDate?: string;
  validationStatus?: BuildMetadata["validationStatus"];
  latestUpdate?: string;
}> {
  const { researchers, projects, datasets, technologies, diseaseAreas } = await getPortalData();
  const buildMetadata = await getBuildMetadata();

  const allDates = [...researchers, ...projects, ...datasets, ...technologies, ...diseaseAreas]
    .map((record) => record.lastUpdated)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => b.localeCompare(a));

  return {
    researcherCount: buildMetadata?.processedEntityCounts.researchers ?? researchers.length,
    projectCount: buildMetadata?.processedEntityCounts.projects ?? projects.length,
    datasetCount: buildMetadata?.processedEntityCounts.datasets ?? datasets.length,
    technologyCount: buildMetadata?.processedEntityCounts.technologies ?? technologies.length,
    diseaseAreaCount: buildMetadata?.processedEntityCounts.diseaseAreas ?? diseaseAreas.length,
    buildGeneratedAt: buildMetadata?.generatedAt,
    latestSourceUpdateDate: buildMetadata?.latestSourceUpdateDate,
    validationStatus: buildMetadata?.validationStatus,
    latestUpdate: allDates[0],
  };
}

export async function getResearcherDetailById(id: string): Promise<ResearcherDetailData | null> {
  const { researchers, datasets, technologies, diseaseAreas, projects, relationships } = await getPortalData();
  const researcher = researchers.find((item) => item.id === id);
  if (!researcher) {
    return null;
  }

  const datasetMap = indexById(datasets);
  const technologyMap = indexById(technologies);
  const diseaseAreaMap = indexById(diseaseAreas);
  const projectMap = indexById(projects);

  return {
    researcher,
    datasets: pickByIds(relationships.researcherToDatasets[id], datasetMap),
    technologies: pickByIds(relationships.researcherToTechnologies[id], technologyMap),
    diseaseAreas: pickByIds(relationships.researcherToDiseaseAreas[id], diseaseAreaMap),
    projects: pickByIds(relationships.researcherToProjects[id], projectMap),
  };
}

export async function getDatasetDetailById(id: string): Promise<DatasetDetailData | null> {
  const { datasets, researchers, technologies, diseaseAreas, projects, relationships } = await getPortalData();
  const dataset = datasets.find((item) => item.id === id);
  if (!dataset) {
    return null;
  }

  const researcherMap = indexById(researchers);
  const technologyMap = indexById(technologies);
  const diseaseAreaMap = indexById(diseaseAreas);
  const projectMap = indexById(projects);

  return {
    dataset,
    researchers: pickByIds(relationships.datasetToResearchers[id], researcherMap),
    technologies: pickByIds(relationships.datasetToTechnologies[id], technologyMap),
    diseaseAreas: pickByIds(relationships.datasetToDiseaseAreas[id], diseaseAreaMap),
    projects: pickByIds(relationships.datasetToProjects[id], projectMap),
  };
}

export async function getTechnologyDetailById(id: string): Promise<TechnologyDetailData | null> {
  const { technologies, researchers, datasets, diseaseAreas, projects, relationships } = await getPortalData();
  const technology = technologies.find((item) => item.id === id);
  if (!technology) {
    return null;
  }

  const researcherMap = indexById(researchers);
  const datasetMap = indexById(datasets);
  const diseaseAreaMap = indexById(diseaseAreas);
  const projectMap = indexById(projects);
  const datasetIds = relationships.technologyToDatasets[id] ?? [];
  const projectIds = new Set<string>();
  datasetIds.forEach((datasetId) => {
    (relationships.datasetToProjects[datasetId] ?? []).forEach((projectId) => projectIds.add(projectId));
  });

  return {
    technology,
    researchers: pickByIds(relationships.technologyToResearchers[id], researcherMap),
    datasets: pickByIds(datasetIds, datasetMap),
    diseaseAreas: pickByIds(relationships.technologyToDiseaseAreas[id], diseaseAreaMap),
    projects: pickByIds([...projectIds], projectMap),
  };
}

export async function getDiseaseAreaDetailById(id: string): Promise<DiseaseAreaDetailData | null> {
  const { diseaseAreas, researchers, datasets, technologies, projects, relationships } = await getPortalData();
  const diseaseArea = diseaseAreas.find((item) => item.id === id);
  if (!diseaseArea) {
    return null;
  }

  const researcherMap = indexById(researchers);
  const datasetMap = indexById(datasets);
  const technologyMap = indexById(technologies);
  const projectMap = indexById(projects);

  return {
    diseaseArea,
    researchers: pickByIds(relationships.diseaseAreaToResearchers[id], researcherMap),
    datasets: pickByIds(relationships.diseaseAreaToDatasets[id], datasetMap),
    technologies: pickByIds(relationships.diseaseAreaToTechnologies[id], technologyMap),
    projects: pickByIds(relationships.diseaseAreaToProjects[id], projectMap),
  };
}

export async function getProjectDetailById(id: string): Promise<ProjectDetailData | null> {
  const { projects, researchers, datasets, diseaseAreas, technologies, relationships } = await getPortalData();
  const project = projects.find((item) => item.id === id);
  if (!project) {
    return null;
  }

  const researcherMap = indexById(researchers);
  const datasetMap = indexById(datasets);
  const diseaseAreaMap = indexById(diseaseAreas);
  const technologyMap = indexById(technologies);

  const projectDatasetIds = relationships.projectToDatasets[id] ?? [];
  const technologyIds = new Set<string>();
  projectDatasetIds.forEach((datasetId) => {
    (relationships.datasetToTechnologies[datasetId] ?? []).forEach((technologyId) => technologyIds.add(technologyId));
  });

  return {
    project,
    researchers: pickByIds(relationships.projectToResearchers[id], researcherMap),
    datasets: pickByIds(projectDatasetIds, datasetMap),
    diseaseAreas: pickByIds(relationships.projectToDiseaseAreas[id], diseaseAreaMap),
    technologies: pickByIds([...technologyIds], technologyMap),
  };
}
