import { formatDateForDisplay } from "@/lib/detail-format";
import { formatProjectStatus, formatProjectType } from "@/lib/project-format";
import type { CompareEntityType, PortalData } from "@/types/domain";

export const COMPARE_ENTITY_TYPES: CompareEntityType[] = [
  "researcher",
  "dataset",
  "project",
  "technology",
  "disease-area",
];
export const COMPARE_MAX_ITEMS = 4;
export const COMPARE_MIN_ITEMS = 2;

export type CompareSelectionItem = {
  id: string;
  label: string;
};

export type CompareSelection = {
  type: CompareEntityType | null;
  items: CompareSelectionItem[];
};

export type CompareCard = {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  chips: string[];
  fields: Array<{ label: string; value: string }>;
};

function normalizeId(value: string): string {
  return value.trim();
}

export function isCompareEntityType(value: string): value is CompareEntityType {
  return COMPARE_ENTITY_TYPES.includes(value as CompareEntityType);
}

export function parseCompareEntityType(value: string | undefined): CompareEntityType | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return isCompareEntityType(normalized) ? normalized : null;
}

export function parseCompareIds(value: string | undefined, maxItems = COMPARE_MAX_ITEMS): string[] {
  if (!value?.trim()) {
    return [];
  }

  const seen = new Set<string>();
  const output: string[] = [];
  value.split(",").forEach((rawId) => {
    const id = normalizeId(rawId);
    if (!id || seen.has(id) || output.length >= maxItems) {
      return;
    }
    seen.add(id);
    output.push(id);
  });

  return output;
}

export function buildCompareUrl(type: CompareEntityType, ids: string[]): string {
  const validIds = ids.map(normalizeId).filter(Boolean).slice(0, COMPARE_MAX_ITEMS);
  const params = new URLSearchParams();
  params.set("type", type);
  params.set("ids", validIds.join(","));
  return `/compare?${params.toString()}`;
}

export function getCompareTypeLabel(type: CompareEntityType): string {
  if (type === "researcher") {
    return "Researchers";
  }
  if (type === "dataset") {
    return "Datasets";
  }
  if (type === "project") {
    return "Projects";
  }
  if (type === "technology") {
    return "Technologies";
  }
  return "Disease Areas";
}

function joinValues(values: Array<string | undefined>, limit = 3): string {
  const compact = values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)).slice(0, limit);
  return compact.length > 0 ? compact.join(", ") : "Not available";
}

function toCountLabel(count: number, noun: string): string {
  return `${count} ${count === 1 ? noun : `${noun}s`}`;
}

export function buildCompareCards(
  type: CompareEntityType,
  ids: string[],
  portalData: PortalData,
): {
  cards: CompareCard[];
  missingIds: string[];
} {
  const { researchers, datasets, projects, diseaseAreas, technologies, relationships } = portalData;
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((item) => [item.id, item.technologyName]));

  if (type === "researcher") {
    const researcherById = Object.fromEntries(researchers.map((item) => [item.id, item]));
    const cards: CompareCard[] = [];
    const missingIds: string[] = [];

    ids.forEach((id) => {
      const researcher = researcherById[id];
      if (!researcher) {
        missingIds.push(id);
        return;
      }

      const diseaseNames = (relationships.researcherToDiseaseAreas[id] ?? []).map((diseaseId) => diseaseNameById[diseaseId]);
      const technologyNames = (relationships.researcherToTechnologies[id] ?? []).map((techId) => technologyNameById[techId]);
      const datasetCount = (relationships.researcherToDatasets[id] ?? []).length;
      const projectCount = (relationships.researcherToProjects[id] ?? []).length;

      cards.push({
        id: researcher.id,
        title: researcher.fullName,
        href: `/researchers/${researcher.id}`,
        subtitle: researcher.shortBio ?? researcher.title,
        chips: [joinValues([researcher.department], 1), joinValues(diseaseNames, 2), joinValues(technologyNames, 1)].filter(
          (item) => item !== "Not available",
        ),
        fields: [
          { label: "Title", value: researcher.title?.trim() || "Not available" },
          { label: "Department", value: researcher.department?.trim() || "Not available" },
          { label: "Disease Areas", value: joinValues(diseaseNames, 4) },
          { label: "Technologies", value: joinValues(technologyNames, 4) },
          { label: "Related Datasets", value: toCountLabel(datasetCount, "dataset") },
          { label: "Related Projects", value: toCountLabel(projectCount, "project") },
          { label: "Updated", value: formatDateForDisplay(researcher.lastUpdated) ?? "Not available" },
        ],
      });
    });

    return { cards, missingIds };
  }

  if (type === "dataset") {
    const datasetById = Object.fromEntries(datasets.map((item) => [item.id, item]));
    const cards: CompareCard[] = [];
    const missingIds: string[] = [];

    ids.forEach((id) => {
      const dataset = datasetById[id];
      if (!dataset) {
        missingIds.push(id);
        return;
      }

      const diseaseNames = (relationships.datasetToDiseaseAreas[id] ?? []).map((diseaseId) => diseaseNameById[diseaseId]);
      const technologyNames = (relationships.datasetToTechnologies[id] ?? []).map((techId) => technologyNameById[techId]);
      const projectCount = (relationships.datasetToProjects[id] ?? []).length;

      cards.push({
        id: dataset.id,
        title: dataset.datasetName,
        href: `/datasets/${dataset.id}`,
        subtitle: dataset.summary,
        chips: [dataset.datasetType, joinValues(diseaseNames, 2), joinValues(technologyNames, 1)].filter(
          (item) => item && item !== "Not available",
        ) as string[],
        fields: [
          { label: "Dataset Type", value: dataset.datasetType?.trim() || "Not available" },
          { label: "Disease Areas", value: joinValues(diseaseNames, 4) },
          { label: "Technologies", value: joinValues(technologyNames, 4) },
          { label: "Related Projects", value: toCountLabel(projectCount, "project") },
          { label: "Access Level", value: dataset.accessLevel?.trim() || "Not available" },
          { label: "Updated", value: formatDateForDisplay(dataset.lastUpdated) ?? "Not available" },
        ],
      });
    });

    return { cards, missingIds };
  }

  if (type === "project") {
    const projectById = Object.fromEntries(projects.map((item) => [item.id, item]));
    const cards: CompareCard[] = [];
    const missingIds: string[] = [];

    ids.forEach((id) => {
      const project = projectById[id];
      if (!project) {
        missingIds.push(id);
        return;
      }

      const diseaseNames = (relationships.projectToDiseaseAreas[id] ?? []).map((diseaseId) => diseaseNameById[diseaseId]);
      const researcherCount = (relationships.projectToResearchers[id] ?? []).length;
      const datasetCount = (relationships.projectToDatasets[id] ?? []).length;

      cards.push({
        id: project.id,
        title: project.projectName,
        href: `/projects/${project.id}`,
        subtitle: project.summary,
        chips: [formatProjectType(project.projectType), formatProjectStatus(project.status), joinValues(diseaseNames, 2)].filter(
          (item): item is string => Boolean(item && item !== "Not available"),
        ),
        fields: [
          { label: "Project Type", value: formatProjectType(project.projectType) ?? "Not available" },
          { label: "Status", value: formatProjectStatus(project.status) ?? "Not available" },
          { label: "Disease Areas", value: joinValues(diseaseNames, 4) },
          { label: "Related Researchers", value: toCountLabel(researcherCount, "researcher") },
          { label: "Related Datasets", value: toCountLabel(datasetCount, "dataset") },
          { label: "Updated", value: formatDateForDisplay(project.lastUpdated) ?? "Not available" },
        ],
      });
    });

    return { cards, missingIds };
  }

  if (type === "technology") {
    const technologyById = Object.fromEntries(technologies.map((item) => [item.id, item]));
    const cards: CompareCard[] = [];
    const missingIds: string[] = [];

    ids.forEach((id) => {
      const technology = technologyById[id];
      if (!technology) {
        missingIds.push(id);
        return;
      }

      const diseaseNames = (relationships.technologyToDiseaseAreas[id] ?? []).map((diseaseId) => diseaseNameById[diseaseId]);
      const datasetIds = relationships.technologyToDatasets[id] ?? [];
      const researcherCount = (relationships.technologyToResearchers[id] ?? []).length;
      const relatedProjectIds = new Set<string>();
      datasetIds.forEach((datasetId) => {
        (relationships.datasetToProjects[datasetId] ?? []).forEach((projectId) => {
          relatedProjectIds.add(projectId);
        });
      });

      cards.push({
        id: technology.id,
        title: technology.technologyName,
        href: `/technologies/${technology.id}`,
        subtitle: technology.summary,
        chips: [technology.technologyCategory, joinValues(diseaseNames, 2)].filter(
          (item): item is string => Boolean(item && item !== "Not available"),
        ),
        fields: [
          { label: "Category", value: technology.technologyCategory?.trim() || "Not available" },
          { label: "Measurement Focus", value: technology.measurementFocus?.trim() || "Not available" },
          { label: "Vendor / Platform", value: technology.vendorPlatform?.trim() || "Not available" },
          { label: "Disease Areas", value: joinValues(diseaseNames, 4) },
          { label: "Related Datasets", value: toCountLabel(datasetIds.length, "dataset") },
          { label: "Related Researchers", value: toCountLabel(researcherCount, "researcher") },
          { label: "Related Projects", value: toCountLabel(relatedProjectIds.size, "project") },
          { label: "Updated", value: formatDateForDisplay(technology.lastUpdated) ?? "Not available" },
        ],
      });
    });

    return { cards, missingIds };
  }

  const diseaseAreaById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item]));
  const cards: CompareCard[] = [];
  const missingIds: string[] = [];

  ids.forEach((id) => {
    const diseaseArea = diseaseAreaById[id];
    if (!diseaseArea) {
      missingIds.push(id);
      return;
    }

    const researcherCount = (relationships.diseaseAreaToResearchers[id] ?? []).length;
    const datasetCount = (relationships.diseaseAreaToDatasets[id] ?? []).length;
    const technologyCount = (relationships.diseaseAreaToTechnologies[id] ?? []).length;
    const projectCount = (relationships.diseaseAreaToProjects[id] ?? []).length;

    cards.push({
      id: diseaseArea.id,
      title: diseaseArea.diseaseAreaName,
      href: `/disease-areas/${diseaseArea.id}`,
      subtitle: diseaseArea.summary,
      chips: [diseaseArea.diseaseGroup].filter((item): item is string => Boolean(item)),
      fields: [
        { label: "Disease Group", value: diseaseArea.diseaseGroup?.trim() || "Not available" },
        { label: "Related Researchers", value: toCountLabel(researcherCount, "researcher") },
        { label: "Related Datasets", value: toCountLabel(datasetCount, "dataset") },
        { label: "Related Technologies", value: toCountLabel(technologyCount, "technology") },
        { label: "Related Projects", value: toCountLabel(projectCount, "project") },
        { label: "Updated", value: formatDateForDisplay(diseaseArea.lastUpdated) ?? "Not available" },
      ],
    });
  });

  return { cards, missingIds };
}
