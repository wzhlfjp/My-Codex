import type { PortalData } from "@/types/domain";

export type OnboardingLink = {
  key: string;
  title: string;
  description: string;
  href: string;
};

type DiseaseCandidate = {
  id: string;
  name: string;
  researcherCount: number;
  datasetCount: number;
  projectCount: number;
  technologyCount: number;
  score: number;
};

function buildDiseaseCandidates(portalData: PortalData): DiseaseCandidate[] {
  const { diseaseAreas, relationships } = portalData;

  return diseaseAreas.map((diseaseArea) => {
    const researcherCount = (relationships.diseaseAreaToResearchers[diseaseArea.id] ?? []).length;
    const datasetCount = (relationships.diseaseAreaToDatasets[diseaseArea.id] ?? []).length;
    const projectCount = (relationships.diseaseAreaToProjects[diseaseArea.id] ?? []).length;
    const technologyCount = (relationships.diseaseAreaToTechnologies[diseaseArea.id] ?? []).length;
    const score = researcherCount * 4 + datasetCount * 3 + projectCount * 2 + technologyCount;

    return {
      id: diseaseArea.id,
      name: diseaseArea.diseaseAreaName,
      researcherCount,
      datasetCount,
      projectCount,
      technologyCount,
      score,
    };
  });
}

function pickDemoDisease(portalData: PortalData): DiseaseCandidate | undefined {
  const candidates = buildDiseaseCandidates(portalData);

  return candidates
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .find((candidate) => candidate.score > 0)
    ?? [...candidates].sort((a, b) => a.name.localeCompare(b.name))[0];
}

function buildDiseaseQueryParam(diseaseId?: string): string {
  if (!diseaseId) {
    return "";
  }
  return `disease=${encodeURIComponent(diseaseId)}`;
}

function withQuery(path: string, query?: string): string {
  if (!query) {
    return path;
  }
  return `${path}?${query}`;
}

export function buildOnboardingLinks(portalData: PortalData): OnboardingLink[] {
  const demoDisease = pickDemoDisease(portalData);
  const diseaseQuery = buildDiseaseQueryParam(demoDisease?.id);
  const diseasePhrase = demoDisease ? `for ${demoDisease.name}` : "";

  return [
    {
      key: "disease-first",
      title: `Explore ${diseasePhrase || "a disease area"} across entities`.trim(),
      description: "Open mixed-entity Explore results and follow links into detail pages.",
      href: withQuery("/explore", diseaseQuery),
    },
    {
      key: "dataset-first",
      title: `Browse datasets ${diseasePhrase || "by disease context"}`.trim(),
      description: "Review data resources, modalities, and related technologies.",
      href: withQuery("/datasets", diseaseQuery ? `${diseaseQuery}&sort=updated_desc` : "sort=updated_desc"),
    },
    {
      key: "technology-first",
      title: "Browse technologies in use",
      description: "Scan measurement platforms and jump to linked datasets and researchers.",
      href: "/technologies?sort=category_asc",
    },
    {
      key: "researcher-first",
      title: `Browse researchers ${diseasePhrase || "by disease area"}`.trim(),
      description: "Start from investigator profiles and move into datasets, technologies, and projects.",
      href: withQuery("/researchers", diseaseQuery || "sort=updated_desc"),
    },
    {
      key: "collaboration-first",
      title: "Review portfolio coverage in Dashboard",
      description: "Use Dashboard for high-level catalog coverage, relationship patterns, and data freshness context.",
      href: "/dashboard",
    },
  ];
}

export function buildOnboardingQuestionLinks(portalData: PortalData): Array<{
  question: string;
  href: string;
}> {
  const demoDisease = pickDemoDisease(portalData);
  const diseaseQuery = buildDiseaseQueryParam(demoDisease?.id);

  return [
    {
      question: "Who is active in this disease area?",
      href: withQuery("/researchers", diseaseQuery),
    },
    {
      question: "What datasets are currently represented?",
      href: withQuery("/datasets", diseaseQuery ? `${diseaseQuery}&sort=updated_desc` : "sort=updated_desc"),
    },
    {
      question: "Which technologies appear in related work?",
      href: withQuery("/explore", diseaseQuery ? `${diseaseQuery}&type=technology` : "type=technology"),
    },
    {
      question: "Are there connected projects or programs?",
      href: withQuery("/projects", diseaseQuery),
    },
  ];
}
