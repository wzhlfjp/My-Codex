import { pluralizeWord } from "@/lib/detail-format";
import { formatProjectStatus, formatProjectType } from "@/lib/project-format";
import type { PortalData } from "@/types/domain";

const DEFAULT_RECOMMENDATION_LIMIT = 4;
const MIN_RECOMMENDATION_SCORE = 2;

type RecommendationReason = {
  text: string;
  priority: number;
};

type RecommendationCandidate = {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  chips: string[];
  score: number;
  reasons: RecommendationReason[];
};

export type RecommendationItem = {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  chips: string[];
  reason: string;
  score: number;
};

export type RecommendationSet = {
  items: RecommendationItem[];
  browseHref: string;
  browseLabel: string;
};

function getArray(values: string[] | undefined): string[] {
  return values?.filter(Boolean) ?? [];
}

function getSharedCount(current: string[] | undefined, candidate: string[] | undefined): number {
  const currentIds = getArray(current);
  const candidateIds = getArray(candidate);

  if (currentIds.length === 0 || candidateIds.length === 0) {
    return 0;
  }

  const currentSet = new Set(currentIds);
  return candidateIds.filter((id) => currentSet.has(id)).length;
}

function formatSharesReason(
  prefix: string,
  count: number,
  singular: string,
  plural?: string,
  priorityWeight = 1,
): RecommendationReason {
  return {
    text: `${prefix} ${count} ${pluralizeWord(count, singular, plural)}`,
    priority: count * priorityWeight,
  };
}

function toRecommendationItem(candidate: RecommendationCandidate): RecommendationItem {
  const topReasons = candidate.reasons
    .sort((a, b) => b.priority - a.priority || a.text.localeCompare(b.text))
    .slice(0, 2)
    .map((item) => item.text);

  return {
    id: candidate.id,
    title: candidate.title,
    href: candidate.href,
    subtitle: candidate.subtitle,
    chips: candidate.chips,
    reason: topReasons.join("; "),
    score: candidate.score,
  };
}

function rankCandidates(candidates: RecommendationCandidate[], limit: number): RecommendationItem[] {
  return candidates
    .filter((candidate) => candidate.score >= MIN_RECOMMENDATION_SCORE && candidate.reasons.length > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map(toRecommendationItem);
}

function compactChips(items: Array<string | undefined>, max = 3): string[] {
  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .slice(0, max);
}

function toListHref(path: string, params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const trimmed = value?.trim();
    if (trimmed) {
      searchParams.set(key, trimmed);
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

function getPrimaryDiseaseArea(
  diseaseAreaIds: string[] | undefined,
  diseaseNameById: Record<string, string>,
): { id: string; name: string } | null {
  const ranked = getArray(diseaseAreaIds)
    .map((id) => ({ id, name: diseaseNameById[id] }))
    .filter((item): item is { id: string; name: string } => Boolean(item.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  return ranked[0] ?? null;
}

export function getResearcherRecommendations(
  researcherId: string,
  portalData: PortalData,
  limit = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationSet {
  const { researchers, relationships, diseaseAreas } = portalData;
  const current = researchers.find((item) => item.id === researcherId);
  if (!current) {
    return {
      items: [],
      browseHref: "/researchers",
      browseLabel: "Browse all researchers",
    };
  }

  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const currentDiseaseAreas = relationships.researcherToDiseaseAreas[researcherId];
  const primaryDiseaseArea = getPrimaryDiseaseArea(currentDiseaseAreas, diseaseNameById);

  const items = rankCandidates(
    researchers
      .filter((candidate) => candidate.id !== researcherId && candidate.active)
      .map((candidate) => {
        const sharedDiseaseAreas = getSharedCount(
          currentDiseaseAreas,
          relationships.researcherToDiseaseAreas[candidate.id],
        );
        const sharedTechnologies = getSharedCount(
          relationships.researcherToTechnologies[researcherId],
          relationships.researcherToTechnologies[candidate.id],
        );
        const sharedProjects = getSharedCount(
          relationships.researcherToProjects[researcherId],
          relationships.researcherToProjects[candidate.id],
        );
        const sharedDatasets = getSharedCount(
          relationships.researcherToDatasets[researcherId],
          relationships.researcherToDatasets[candidate.id],
        );

        const reasons: RecommendationReason[] = [];
        if (sharedDiseaseAreas > 0) {
          reasons.push(formatSharesReason("Shares", sharedDiseaseAreas, "disease area", undefined, 4));
        }
        if (sharedTechnologies > 0) {
          reasons.push(formatSharesReason("Uses", sharedTechnologies, "overlapping technology", undefined, 3));
        }
        if (sharedProjects > 0) {
          reasons.push(formatSharesReason("Linked through", sharedProjects, "shared project", undefined, 2));
        }
        if (sharedDatasets > 0) {
          reasons.push(formatSharesReason("Connected through", sharedDatasets, "shared dataset"));
        }

        return {
          id: candidate.id,
          title: candidate.fullName,
          href: `/researchers/${candidate.id}`,
          subtitle: candidate.department ?? candidate.title,
          chips: compactChips([candidate.department, candidate.centerProgram]),
          score: sharedDiseaseAreas * 4 + sharedTechnologies * 3 + sharedProjects * 2 + sharedDatasets,
          reasons,
        };
      }),
    limit,
  );

  if (primaryDiseaseArea) {
    return {
      items,
      browseHref: toListHref("/researchers", { disease: primaryDiseaseArea.id }),
      browseLabel: `Browse more researchers in ${primaryDiseaseArea.name}`,
    };
  }

  return {
    items,
    browseHref: "/researchers",
    browseLabel: "Browse all researchers",
  };
}

export function getDatasetRecommendations(
  datasetId: string,
  portalData: PortalData,
  limit = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationSet {
  const { datasets, technologies, diseaseAreas, relationships } = portalData;
  const current = datasets.find((item) => item.id === datasetId);
  if (!current) {
    return {
      items: [],
      browseHref: "/datasets",
      browseLabel: "Browse all datasets",
    };
  }

  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((item) => [item.id, item.technologyName]));
  const currentDiseaseAreas = relationships.datasetToDiseaseAreas[datasetId];
  const primaryDiseaseArea = getPrimaryDiseaseArea(currentDiseaseAreas, diseaseNameById);
  const primaryTechnologyId = getArray(relationships.datasetToTechnologies[datasetId])
    .sort((a, b) => (technologyNameById[a] ?? "").localeCompare(technologyNameById[b] ?? ""))[0];
  const primaryTechnologyName = primaryTechnologyId ? technologyNameById[primaryTechnologyId] : undefined;

  const items = rankCandidates(
    datasets
      .filter((candidate) => candidate.id !== datasetId && candidate.active)
      .map((candidate) => {
        const sharedDiseaseAreas = getSharedCount(
          currentDiseaseAreas,
          relationships.datasetToDiseaseAreas[candidate.id],
        );
        const sharedTechnologies = getSharedCount(
          relationships.datasetToTechnologies[datasetId],
          relationships.datasetToTechnologies[candidate.id],
        );
        const sharedProjects = getSharedCount(
          relationships.datasetToProjects[datasetId],
          relationships.datasetToProjects[candidate.id],
        );
        const sharedResearchers = getSharedCount(
          relationships.datasetToResearchers[datasetId],
          relationships.datasetToResearchers[candidate.id],
        );

        const reasons: RecommendationReason[] = [];
        if (sharedDiseaseAreas > 0) {
          reasons.push(formatSharesReason("Shares", sharedDiseaseAreas, "disease area", undefined, 4));
        }
        if (sharedTechnologies > 0) {
          reasons.push(formatSharesReason("Uses", sharedTechnologies, "overlapping technology", undefined, 3));
        }
        if (sharedProjects > 0) {
          reasons.push(formatSharesReason("Linked through", sharedProjects, "shared project", undefined, 2));
        }
        if (sharedResearchers > 0) {
          reasons.push(formatSharesReason("Connected through", sharedResearchers, "shared researcher"));
        }

        return {
          id: candidate.id,
          title: candidate.datasetName,
          href: `/datasets/${candidate.id}`,
          subtitle: candidate.summary,
          chips: compactChips([candidate.datasetType, candidate.dataModality]),
          score: sharedDiseaseAreas * 4 + sharedTechnologies * 3 + sharedProjects * 2 + sharedResearchers,
          reasons,
        };
      }),
    limit,
  );

  if (primaryDiseaseArea) {
    return {
      items,
      browseHref: toListHref("/datasets", { disease: primaryDiseaseArea.id }),
      browseLabel: `Browse more datasets in ${primaryDiseaseArea.name}`,
    };
  }

  if (primaryTechnologyName) {
    return {
      items,
      browseHref: toListHref("/datasets", { q: primaryTechnologyName }),
      browseLabel: `Browse datasets matching ${primaryTechnologyName}`,
    };
  }

  return {
    items,
    browseHref: "/datasets",
    browseLabel: "Browse all datasets",
  };
}

export function getProjectRecommendations(
  projectId: string,
  portalData: PortalData,
  limit = DEFAULT_RECOMMENDATION_LIMIT,
): RecommendationSet {
  const { projects, diseaseAreas, relationships } = portalData;
  const current = projects.find((item) => item.id === projectId);
  if (!current) {
    return {
      items: [],
      browseHref: "/projects",
      browseLabel: "Browse all projects",
    };
  }

  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const currentDiseaseAreas = relationships.projectToDiseaseAreas[projectId];
  const primaryDiseaseArea = getPrimaryDiseaseArea(currentDiseaseAreas, diseaseNameById);

  const items = rankCandidates(
    projects
      .filter((candidate) => candidate.id !== projectId)
      .map((candidate) => {
        const sharedDiseaseAreas = getSharedCount(
          currentDiseaseAreas,
          relationships.projectToDiseaseAreas[candidate.id],
        );
        const sharedDatasets = getSharedCount(
          relationships.projectToDatasets[projectId],
          relationships.projectToDatasets[candidate.id],
        );
        const sharedResearchers = getSharedCount(
          relationships.projectToResearchers[projectId],
          relationships.projectToResearchers[candidate.id],
        );
        const sameProjectType =
          current.projectType.trim().length > 0 &&
          candidate.projectType.trim().length > 0 &&
          current.projectType.toLowerCase() === candidate.projectType.toLowerCase();

        const reasons: RecommendationReason[] = [];
        if (sharedDiseaseAreas > 0) {
          reasons.push(formatSharesReason("Shares", sharedDiseaseAreas, "disease area", undefined, 4));
        }
        if (sharedDatasets > 0) {
          reasons.push(formatSharesReason("Linked through", sharedDatasets, "shared dataset", undefined, 3));
        }
        if (sharedResearchers > 0) {
          reasons.push(formatSharesReason("Involves", sharedResearchers, "shared researcher", undefined, 2));
        }
        if (sameProjectType) {
          reasons.push({ text: "Same project type", priority: 1 });
        }

        return {
          id: candidate.id,
          title: candidate.projectName,
          href: `/projects/${candidate.id}`,
          subtitle: candidate.summary,
          chips: compactChips([formatProjectType(candidate.projectType), formatProjectStatus(candidate.status)]),
          score: sharedDiseaseAreas * 4 + sharedDatasets * 3 + sharedResearchers * 2 + (sameProjectType ? 1 : 0),
          reasons,
        };
      }),
    limit,
  );

  if (primaryDiseaseArea) {
    return {
      items,
      browseHref: toListHref("/projects", { disease: primaryDiseaseArea.id }),
      browseLabel: `Browse more projects in ${primaryDiseaseArea.name}`,
    };
  }

  const projectTypeLabel = formatProjectType(current.projectType);
  if (projectTypeLabel) {
    return {
      items,
      browseHref: toListHref("/projects", { q: projectTypeLabel }),
      browseLabel: "Browse projects by similar type",
    };
  }

  return {
    items,
    browseHref: "/projects",
    browseLabel: "Browse all projects",
  };
}
