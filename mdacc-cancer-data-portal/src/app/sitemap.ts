import type { MetadataRoute } from "next";
import { getBuildMetadata, getPortalData } from "@/lib/data/processed-data";
import { getAbsoluteSiteUrl } from "@/lib/site-metadata";

function parseLastModified(value?: string): Date | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return parsed;
}

function createEntry({
  path,
  lastModified,
  changeFrequency,
  priority,
}: {
  path: string;
  lastModified?: Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
}): MetadataRoute.Sitemap[number] {
  return {
    url: getAbsoluteSiteUrl(path),
    ...(lastModified ? { lastModified } : {}),
    ...(changeFrequency ? { changeFrequency } : {}),
    ...(typeof priority === "number" ? { priority } : {}),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portalData, buildMetadata] = await Promise.all([getPortalData(), getBuildMetadata()]);
  const buildDate = parseLastModified(buildMetadata?.generatedAt);

  const staticRoutes: MetadataRoute.Sitemap = [
    createEntry({ path: "/", lastModified: buildDate, changeFrequency: "weekly", priority: 1 }),
    createEntry({ path: "/explore", lastModified: buildDate, changeFrequency: "daily", priority: 0.9 }),
    createEntry({ path: "/dashboard", lastModified: buildDate, changeFrequency: "weekly", priority: 0.85 }),
    createEntry({ path: "/researchers", lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 }),
    createEntry({ path: "/projects", lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 }),
    createEntry({ path: "/datasets", lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 }),
    createEntry({ path: "/technologies", lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 }),
    createEntry({ path: "/disease-areas", lastModified: buildDate, changeFrequency: "weekly", priority: 0.8 }),
    createEntry({ path: "/about", lastModified: buildDate, changeFrequency: "monthly", priority: 0.5 }),
    createEntry({ path: "/status", lastModified: buildDate, changeFrequency: "weekly", priority: 0.4 }),
  ];

  const researcherRoutes = portalData.researchers.filter((researcher) => researcher.active).map((researcher) =>
    createEntry({
      path: `/researchers/${encodeURIComponent(researcher.id)}`,
      lastModified: parseLastModified(researcher.lastUpdated) ?? buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const projectRoutes = portalData.projects.map((project) =>
    createEntry({
      path: `/projects/${encodeURIComponent(project.id)}`,
      lastModified: parseLastModified(project.lastUpdated) ?? buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const datasetRoutes = portalData.datasets.filter((dataset) => dataset.active).map((dataset) =>
    createEntry({
      path: `/datasets/${encodeURIComponent(dataset.id)}`,
      lastModified: parseLastModified(dataset.lastUpdated) ?? buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const technologyRoutes = portalData.technologies.filter((technology) => technology.active).map((technology) =>
    createEntry({
      path: `/technologies/${encodeURIComponent(technology.id)}`,
      lastModified: parseLastModified(technology.lastUpdated) ?? buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const diseaseAreaRoutes = portalData.diseaseAreas.filter((diseaseArea) => diseaseArea.active).map((diseaseArea) =>
    createEntry({
      path: `/disease-areas/${encodeURIComponent(diseaseArea.id)}`,
      lastModified: parseLastModified(diseaseArea.lastUpdated) ?? buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...researcherRoutes, ...projectRoutes, ...datasetRoutes, ...technologyRoutes, ...diseaseAreaRoutes];
}
