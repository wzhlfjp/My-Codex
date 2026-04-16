import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DetailSectionNav } from "@/components/ui/detail-section-nav";
import { MetadataList } from "@/components/ui/metadata-list";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationPanel } from "@/components/ui/recommendation-panel";
import { RelatedEntitiesPanel } from "@/components/ui/related-entities-panel";
import { getDatasetDetailById, getPortalData } from "@/lib/data/processed-data";
import {
  formatCountValue,
  formatDateForDisplay,
  formatRelatedSummary,
  hasDisplayValue,
} from "@/lib/detail-format";
import { getDatasetRecommendations } from "@/lib/recommendations";
import { buildRouteMetadata } from "@/lib/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getDatasetDetailById(id);

  if (!detail) {
    return buildRouteMetadata({
      title: "Dataset Not Found",
      description: "The requested dataset record was not found in the current processed seed data.",
      path: "/datasets",
    });
  }

  return buildRouteMetadata({
    title: detail.dataset.datasetName,
    description: detail.dataset.summary,
    path: `/datasets/${encodeURIComponent(id)}`,
  });
}

export default async function DatasetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, portalData] = await Promise.all([getDatasetDetailById(id), getPortalData()]);

  if (!detail) {
    notFound();
  }

  const { dataset, diseaseAreas, technologies, researchers, projects } = detail;
  const recommendations = getDatasetRecommendations(dataset.id, portalData);
  const primaryDiseaseArea = diseaseAreas[0];

  const metadataItems = [
    { label: "Dataset Type", value: dataset.datasetType },
    { label: "Access Level", value: dataset.accessLevel },
    { label: "Data Modality", value: dataset.dataModality },
    { label: "Sample Scope", value: dataset.sampleScope },
    { label: "Last Updated", value: formatDateForDisplay(dataset.lastUpdated) },
    { label: "Related Disease Areas", value: formatCountValue(diseaseAreas.length, "disease area") },
    { label: "Related Technologies", value: formatCountValue(technologies.length, "technology") },
    { label: "Related Researchers", value: formatCountValue(researchers.length, "researcher") },
    { label: "Related Projects", value: formatCountValue(projects.length, "project") },
  ];

  const hasMetadataSection = metadataItems.some((item) => hasDisplayValue(item.value));
  const detailExportPayload = {
    entityType: "dataset",
    dataset: {
      id: dataset.id,
      datasetName: dataset.datasetName,
      datasetType: dataset.datasetType,
      summary: dataset.summary,
      dataModality: dataset.dataModality,
      accessLevel: dataset.accessLevel,
      sampleScope: dataset.sampleScope,
      lastUpdated: dataset.lastUpdated,
    },
    related: {
      diseaseAreas: diseaseAreas.map((item) => ({ id: item.id, name: item.diseaseAreaName })),
      technologies: technologies.map((item) => ({ id: item.id, name: item.technologyName })),
      researchers: researchers.map((item) => ({ id: item.id, name: item.fullName })),
      projects: projects.map((item) => ({ id: item.id, name: item.projectName })),
    },
  };
  const quickNavItems = [
    { id: "overview", label: "Overview" },
    hasMetadataSection ? { id: "metadata", label: "Metadata" } : null,
    diseaseAreas.length > 0 ? { id: "related-disease-areas", label: "Disease Areas", count: diseaseAreas.length } : null,
    technologies.length > 0 ? { id: "related-technologies", label: "Technologies", count: technologies.length } : null,
    researchers.length > 0 ? { id: "related-researchers", label: "Researchers", count: researchers.length } : null,
    projects.length > 0 ? { id: "related-projects", label: "Projects", count: projects.length } : null,
    recommendations.items.length > 0
      ? { id: "recommended-datasets", label: "Suggested Datasets", count: recommendations.items.length }
      : null,
  ].filter((item): item is { id: string; label: string; count?: number } => Boolean(item));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Datasets", href: "/datasets" },
          { label: dataset.datasetName },
        ]}
      />

      <DetailSectionNav items={quickNavItems} />

      <section id="overview" className="scroll-mt-24">
        <PageHeader
          title={dataset.datasetName}
          description={dataset.summary}
          actions={
            <div className="flex flex-col gap-1 md:items-end">
              <ShareExportActions
                fileStem={`dataset-${dataset.id}`}
                showCsv={false}
                jsonData={detailExportPayload}
                className="md:items-end"
              />
              <CompareToggleButton type="dataset" id={dataset.id} label={dataset.datasetName} />
            </div>
          }
        />
      </section>

      <MetadataList
        id="metadata"
        title="Structured Metadata"
        description="Core data characteristics, stewardship context, and linked entity counts."
        items={metadataItems}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <RelatedEntitiesPanel
          id="related-disease-areas"
          title="Disease Areas"
          description="Cancer contexts where this dataset is relevant."
          summaryLine={`${formatRelatedSummary(diseaseAreas.length, "disease area")} Supports disease-first browsing.`}
          browseHref={primaryDiseaseArea ? `/datasets?disease=${primaryDiseaseArea.id}` : "/disease-areas"}
          browseLabel={
            primaryDiseaseArea
              ? `Browse datasets in ${primaryDiseaseArea.diseaseAreaName}`
              : "Browse all disease areas"
          }
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
          description="Measurement methods used to generate or analyze this dataset."
          summaryLine={`${formatRelatedSummary(technologies.length, "technology")} Indicates platform context for this resource.`}
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
        <RelatedEntitiesPanel
          id="related-researchers"
          title="Researchers"
          description="People currently connected to this dataset."
          summaryLine={`${formatRelatedSummary(researchers.length, "researcher")} Helps identify active collaborators.`}
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
        {projects.length > 0 ? (
          <RelatedEntitiesPanel
            id="related-projects"
            title="Projects"
            description="Programs or initiatives connected to this dataset."
            summaryLine={`${formatRelatedSummary(projects.length, "project")} Links this data to program activity.`}
            browseHref={primaryDiseaseArea ? `/projects?disease=${primaryDiseaseArea.id}` : "/projects"}
            browseLabel={
              primaryDiseaseArea ? `Browse projects in ${primaryDiseaseArea.diseaseAreaName}` : "Browse all projects"
            }
            emptyLabel="No projects linked in current seed data."
            items={projects.map((item) => ({
              id: item.id,
              label: item.projectName,
              href: `/projects/${item.id}`,
              description: item.projectType,
            }))}
          />
        ) : null}
      </section>

      <RecommendationPanel
        id="recommended-datasets"
        title="You May Also Want to Look At"
        description="Similar datasets based on shared disease areas, technologies, researchers, and project context."
        browseHref={recommendations.browseHref}
        browseLabel={recommendations.browseLabel}
        emptyLabel="No strong same-type recommendations are available yet for this dataset."
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
