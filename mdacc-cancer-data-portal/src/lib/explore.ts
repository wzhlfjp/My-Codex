import { getPortalData } from "@/lib/data/processed-data";
import { formatProjectStatus, formatProjectType } from "@/lib/project-format";
import { buildTokenGroups, scoreTokenGroups, tokenizeSearchInput } from "@/lib/search";
import type { ExploreEntityType, ExploreQuery, ExploreResult } from "@/types/domain";

const ENTITY_TYPE_LABELS: Record<Exclude<ExploreEntityType, "all">, string> = {
  researcher: "Researcher",
  project: "Project",
  dataset: "Dataset",
  technology: "Technology",
  "disease-area": "Disease Area",
};

type PreparedExploreData = {
  diseaseFilterOptions: Array<{ id: string; name: string }>;
  results: ExploreResult[];
  normalizedQuery: Required<ExploreQuery>;
};

function normalizeType(type: string | undefined): ExploreEntityType {
  if (!type) {
    return "all";
  }

  const normalized = type.toLowerCase();
  if (
    normalized === "all" ||
    normalized === "researcher" ||
    normalized === "project" ||
    normalized === "dataset" ||
    normalized === "technology" ||
    normalized === "disease-area"
  ) {
    return normalized;
  }

  return "all";
}

export function normalizeQuery(query: ExploreQuery): Required<ExploreQuery> {
  return {
    q: query.q?.trim() ?? "",
    type: normalizeType(query.type),
    disease: query.disease?.trim() ?? "",
  };
}

export function buildTokens(input: string): string[] {
  return tokenizeSearchInput(input);
}

export function scoreMatch(tokens: string[], title: string, body: string): number {
  return scoreTokenGroups(buildTokenGroups(tokens), title, body);
}

export function prepareExploreData(
  query: ExploreQuery,
  data: Awaited<ReturnType<typeof getPortalData>>,
): PreparedExploreData {
  const normalizedQuery = normalizeQuery(query);
  const tokens = buildTokens(normalizedQuery.q);
  const tokenGroups = buildTokenGroups(tokens);

  const { researchers, projects, datasets, technologies, diseaseAreas, relationships } = data;

  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((item) => [item.id, item.technologyName]));
  const datasetNameById = Object.fromEntries(datasets.map((item) => [item.id, item.datasetName]));

  const researcherResults: ExploreResult[] = researchers.map((researcher) => {
    const diseaseAreaIds = relationships.researcherToDiseaseAreas[researcher.id] ?? [];
    const technologyIds = relationships.researcherToTechnologies[researcher.id] ?? [];
    const diseaseAreaNames = diseaseAreaIds.map((id) => diseaseNameById[id]).filter(Boolean);
    const technologyNames = technologyIds.map((id) => technologyNameById[id]).filter(Boolean);

    const summary = [researcher.title, researcher.department].filter(Boolean).join(" - ") || researcher.shortBio;

    return {
      id: researcher.id,
      type: "researcher",
      title: researcher.fullName,
      href: `/researchers/${researcher.id}`,
      summary,
      diseaseAreaIds,
      diseaseAreaNames,
      technologyNames,
      chips: [...diseaseAreaNames.slice(0, 2), ...technologyNames.slice(0, 2)],
      searchTitle: researcher.fullName,
      searchBody: [
        researcher.shortBio,
        researcher.title,
        researcher.department,
        researcher.centerProgram,
        ...diseaseAreaNames,
        ...technologyNames,
      ]
        .filter(Boolean)
        .join(" "),
      score: 0,
    };
  });

  const datasetResults: ExploreResult[] = datasets.map((dataset) => {
    const diseaseAreaIds = relationships.datasetToDiseaseAreas[dataset.id] ?? [];
    const technologyIds = relationships.datasetToTechnologies[dataset.id] ?? [];
    const diseaseAreaNames = diseaseAreaIds.map((id) => diseaseNameById[id]).filter(Boolean);
    const technologyNames = technologyIds.map((id) => technologyNameById[id]).filter(Boolean);

    return {
      id: dataset.id,
      type: "dataset",
      title: dataset.datasetName,
      href: `/datasets/${dataset.id}`,
      summary: dataset.summary,
      diseaseAreaIds,
      diseaseAreaNames,
      technologyNames,
      chips: [dataset.datasetType, ...diseaseAreaNames.slice(0, 2), ...technologyNames.slice(0, 1)].filter(Boolean),
      searchTitle: dataset.datasetName,
      searchBody: [
        dataset.summary,
        dataset.datasetType,
        dataset.dataModality,
        dataset.accessLevel,
        dataset.sampleScope,
        ...diseaseAreaNames,
        ...technologyNames,
      ]
        .filter(Boolean)
        .join(" "),
      score: 0,
    };
  });

  const projectResults: ExploreResult[] = projects.map((project) => {
    const diseaseAreaIds = relationships.projectToDiseaseAreas[project.id] ?? [];
    const diseaseAreaNames = diseaseAreaIds.map((id) => diseaseNameById[id]).filter(Boolean);
    const projectDatasetIds = relationships.projectToDatasets[project.id] ?? [];
    const projectResearcherCount = (relationships.projectToResearchers[project.id] ?? []).length;
    const projectTechnologyIds = new Set<string>();

    projectDatasetIds.forEach((datasetId) => {
      (relationships.datasetToTechnologies[datasetId] ?? []).forEach((technologyId) => projectTechnologyIds.add(technologyId));
    });

    const technologyNames = [...projectTechnologyIds].map((id) => technologyNameById[id]).filter(Boolean);
    const datasetNames = projectDatasetIds.map((id) => datasetNameById[id]).filter(Boolean);

    const formattedProjectType = formatProjectType(project.projectType);
    const formattedProjectStatus = formatProjectStatus(project.status);

    return {
      id: project.id,
      type: "project",
      title: project.projectName,
      href: `/projects/${project.id}`,
      summary: project.summary,
      diseaseAreaIds,
      diseaseAreaNames,
      technologyNames,
      chips: [
        formattedProjectType,
        formattedProjectStatus,
        ...diseaseAreaNames.slice(0, 1),
        `${projectResearcherCount} researchers`,
        `${projectDatasetIds.length} datasets`,
      ].filter((value): value is string => Boolean(value)),
      searchTitle: project.projectName,
      searchBody: [
        project.summary,
        project.projectType,
        formattedProjectType,
        project.status,
        formattedProjectStatus,
        project.departmentOwner,
        ...diseaseAreaNames,
        ...datasetNames,
        ...technologyNames,
      ]
        .filter(Boolean)
        .join(" "),
      score: 0,
    };
  });

  const technologyResults: ExploreResult[] = technologies.map((technology) => {
    const diseaseAreaIds = relationships.technologyToDiseaseAreas[technology.id] ?? [];
    const diseaseAreaNames = diseaseAreaIds.map((id) => diseaseNameById[id]).filter(Boolean);
    const datasetCount = (relationships.technologyToDatasets[technology.id] ?? []).length;

    return {
      id: technology.id,
      type: "technology",
      title: technology.technologyName,
      href: `/technologies/${technology.id}`,
      summary: technology.summary,
      diseaseAreaIds,
      diseaseAreaNames,
      technologyNames: [technology.technologyName],
      chips: [technology.technologyCategory, ...diseaseAreaNames.slice(0, 2), `${datasetCount} datasets`],
      searchTitle: technology.technologyName,
      searchBody: [technology.summary, technology.technologyCategory, technology.measurementFocus, ...diseaseAreaNames]
        .filter(Boolean)
        .join(" "),
      score: 0,
    };
  });

  const diseaseAreaResults: ExploreResult[] = diseaseAreas.map((diseaseArea) => {
    const diseaseAreaIds = [diseaseArea.id];
    const diseaseAreaNames = [diseaseArea.diseaseAreaName];
    const researcherCount = (relationships.diseaseAreaToResearchers[diseaseArea.id] ?? []).length;
    const datasetCount = (relationships.diseaseAreaToDatasets[diseaseArea.id] ?? []).length;
    const technologyCount = (relationships.diseaseAreaToTechnologies[diseaseArea.id] ?? []).length;

    return {
      id: diseaseArea.id,
      type: "disease-area",
      title: diseaseArea.diseaseAreaName,
      href: `/disease-areas/${diseaseArea.id}`,
      summary: diseaseArea.summary,
      diseaseAreaIds,
      diseaseAreaNames,
      technologyNames: [],
      chips: [`${researcherCount} researchers`, `${datasetCount} datasets`, `${technologyCount} technologies`],
      searchTitle: diseaseArea.diseaseAreaName,
      searchBody: [diseaseArea.summary, diseaseArea.diseaseGroup].filter(Boolean).join(" "),
      score: 0,
    };
  });

  const allResults = [...researcherResults, ...projectResults, ...datasetResults, ...technologyResults, ...diseaseAreaResults];

  const filtered = allResults
    .filter((result) => (normalizedQuery.type === "all" ? true : result.type === normalizedQuery.type))
    .filter((result) => {
      if (!normalizedQuery.disease) {
        return true;
      }
      return result.diseaseAreaIds.includes(normalizedQuery.disease);
    })
    .map((result) => {
      const score = scoreTokenGroups(tokenGroups, result.searchTitle, result.searchBody);
      return { ...result, score };
    })
    .filter((result) => (tokens.length > 0 ? result.score >= 0 : true))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.type !== b.type) {
        return ENTITY_TYPE_LABELS[a.type].localeCompare(ENTITY_TYPE_LABELS[b.type]);
      }
      return a.title.localeCompare(b.title);
    });

  return {
    diseaseFilterOptions: diseaseAreas
      .map((item) => ({ id: item.id, name: item.diseaseAreaName }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    results: filtered,
    normalizedQuery,
  };
}

export async function getExploreData(query: ExploreQuery): Promise<PreparedExploreData> {
  const data = await getPortalData();
  return prepareExploreData(query, data);
}

export function getExploreTypeLabel(type: Exclude<ExploreEntityType, "all">): string {
  return ENTITY_TYPE_LABELS[type];
}
