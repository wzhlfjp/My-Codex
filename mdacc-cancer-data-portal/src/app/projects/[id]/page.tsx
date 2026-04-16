import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DetailSectionNav } from "@/components/ui/detail-section-nav";
import { MetadataList } from "@/components/ui/metadata-list";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationPanel } from "@/components/ui/recommendation-panel";
import { RelatedEntitiesPanel } from "@/components/ui/related-entities-panel";
import { getPortalData, getProjectDetailById } from "@/lib/data/processed-data";
import {
  formatCountValue,
  formatDateForDisplay,
  formatRelatedSummary,
  hasDisplayValue,
} from "@/lib/detail-format";
import { formatProjectStatus, formatProjectTimeline, formatProjectType } from "@/lib/project-format";
import { getProjectRecommendations } from "@/lib/recommendations";
import { buildRouteMetadata } from "@/lib/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getProjectDetailById(id);

  if (!detail) {
    return buildRouteMetadata({
      title: "Project Not Found",
      description: "The requested project record was not found in the current processed seed data.",
      path: "/projects",
    });
  }

  return buildRouteMetadata({
    title: detail.project.projectName,
    description: detail.project.summary,
    path: `/projects/${encodeURIComponent(id)}`,
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, portalData] = await Promise.all([getProjectDetailById(id), getPortalData()]);

  if (!detail) {
    notFound();
  }

  const { project, diseaseAreas, researchers, datasets, technologies } = detail;
  const recommendations = getProjectRecommendations(project.id, portalData);
  const primaryDiseaseArea = diseaseAreas[0];

  const metadataItems = [
    { label: "Project Type", value: formatProjectType(project.projectType) },
    { label: "Status", value: formatProjectStatus(project.status) },
    { label: "Department Owner", value: project.departmentOwner },
    { label: "Timeline", value: formatProjectTimeline(project.startYear, project.endYear) },
    { label: "Last Updated", value: formatDateForDisplay(project.lastUpdated) },
    {
      label: "Project URL",
      value: project.projectUrl ? (
        <Link href={project.projectUrl} className="underline hover:text-slate-900">
          Open project link
        </Link>
      ) : undefined,
    },
    { label: "Related Researchers", value: formatCountValue(researchers.length, "researcher") },
    { label: "Related Datasets", value: formatCountValue(datasets.length, "dataset") },
    { label: "Related Disease Areas", value: formatCountValue(diseaseAreas.length, "disease area") },
    { label: "Related Technologies", value: formatCountValue(technologies.length, "technology") },
  ];
  const hasMetadataSection = metadataItems.some((item) => hasDisplayValue(item.value));
  const detailExportPayload = {
    entityType: "project",
    project: {
      id: project.id,
      projectName: project.projectName,
      projectType: formatProjectType(project.projectType),
      status: formatProjectStatus(project.status),
      summary: project.summary,
      departmentOwner: project.departmentOwner,
      startYear: project.startYear,
      endYear: project.endYear,
      lastUpdated: project.lastUpdated,
    },
    related: {
      researchers: researchers.map((item) => ({ id: item.id, name: item.fullName })),
      datasets: datasets.map((item) => ({ id: item.id, name: item.datasetName })),
      diseaseAreas: diseaseAreas.map((item) => ({ id: item.id, name: item.diseaseAreaName })),
      technologies: technologies.map((item) => ({ id: item.id, name: item.technologyName })),
    },
  };

  const quickNavItems = [
    { id: "overview", label: "Overview" },
    hasMetadataSection ? { id: "metadata", label: "Metadata" } : null,
    researchers.length > 0 ? { id: "related-researchers", label: "Researchers", count: researchers.length } : null,
    datasets.length > 0 ? { id: "related-datasets", label: "Datasets", count: datasets.length } : null,
    diseaseAreas.length > 0 ? { id: "related-disease-areas", label: "Disease Areas", count: diseaseAreas.length } : null,
    technologies.length > 0 ? { id: "related-technologies", label: "Technologies", count: technologies.length } : null,
    recommendations.items.length > 0
      ? { id: "recommended-projects", label: "Suggested Projects", count: recommendations.items.length }
      : null,
  ].filter((item): item is { id: string; label: string; count?: number } => Boolean(item));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.projectName },
        ]}
      />

      <DetailSectionNav items={quickNavItems} />

      <section id="overview" className="scroll-mt-24">
        <PageHeader
          title={project.projectName}
          description={project.summary}
          actions={
            <div className="flex flex-col gap-1 md:items-end">
              <ShareExportActions
                fileStem={`project-${project.id}`}
                showCsv={false}
                jsonData={detailExportPayload}
                className="md:items-end"
              />
              <CompareToggleButton type="project" id={project.id} label={project.projectName} />
            </div>
          }
        />
      </section>

      <MetadataList
        id="metadata"
        title="Structured Metadata"
        description="Program identity, stewardship context, and relationship coverage."
        items={metadataItems}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <RelatedEntitiesPanel
          id="related-researchers"
          title="Researchers"
          description="People linked to this project or program."
          summaryLine={`${formatRelatedSummary(researchers.length, "researcher")} Highlights participating investigators.`}
          browseHref={primaryDiseaseArea ? `/researchers?disease=${primaryDiseaseArea.id}` : "/researchers"}
          browseLabel={
            primaryDiseaseArea
              ? `Browse researchers in ${primaryDiseaseArea.diseaseAreaName}`
              : "Browse all researchers"
          }
          emptyLabel="No researchers linked in current seed data."
          items={researchers.map((item) => ({
            id: item.id,
            label: item.fullName,
            href: `/researchers/${item.id}`,
            description: item.department,
          }))}
        />
        <RelatedEntitiesPanel
          id="related-datasets"
          title="Datasets"
          description="Data resources connected to this project."
          summaryLine={`${formatRelatedSummary(datasets.length, "dataset")} Shows currently linked data assets.`}
          browseHref={primaryDiseaseArea ? `/datasets?disease=${primaryDiseaseArea.id}` : "/datasets"}
          browseLabel={
            primaryDiseaseArea ? `Browse datasets in ${primaryDiseaseArea.diseaseAreaName}` : "Browse all datasets"
          }
          emptyLabel="No datasets linked in current seed data."
          items={datasets.map((item) => ({
            id: item.id,
            label: item.datasetName,
            href: `/datasets/${item.id}`,
            description: item.datasetType,
          }))}
        />
        <RelatedEntitiesPanel
          id="related-disease-areas"
          title="Disease Areas"
          description="Disease contexts represented in this project."
          summaryLine={`${formatRelatedSummary(diseaseAreas.length, "disease area")} Provides context for where this project is active.`}
          browseHref="/disease-areas"
          browseLabel="Browse all disease areas"
          emptyLabel="No disease areas linked in current seed data."
          items={diseaseAreas.map((item) => ({
            id: item.id,
            label: item.diseaseAreaName,
            href: `/disease-areas/${item.id}`,
            description: item.diseaseGroup,
          }))}
        />
        <RelatedEntitiesPanel
          id="related-technologies"
          title="Technologies"
          description="Technologies connected through linked datasets."
          summaryLine={`${formatRelatedSummary(technologies.length, "technology")} Captures method context when available.`}
          browseHref="/technologies"
          browseLabel="Browse all technologies"
          emptyLabel="No technologies linked in current seed data."
          items={technologies.map((item) => ({
            id: item.id,
            label: item.technologyName,
            href: `/technologies/${item.id}`,
            description: item.technologyCategory,
          }))}
        />
      </section>

      <RecommendationPanel
        id="recommended-projects"
        title="You May Also Want to Look At"
        description="Similar projects based on shared disease areas, linked datasets, researchers, and project type."
        browseHref={recommendations.browseHref}
        browseLabel={recommendations.browseLabel}
        emptyLabel="No strong same-type recommendations are available yet for this project."
        items={recommendations.items.map((item) => ({
          id: item.id,
          label: item.title,
          href: item.href,
          subtitle: item.subtitle,
          reason: item.reason,
          chips: item.chips,
        }))}
      />
    </div>
  );
}
