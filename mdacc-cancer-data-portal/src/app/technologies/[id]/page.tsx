import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DetailSectionNav } from "@/components/ui/detail-section-nav";
import { MetadataList } from "@/components/ui/metadata-list";
import { PageHeader } from "@/components/ui/page-header";
import { RelatedEntitiesPanel } from "@/components/ui/related-entities-panel";
import { getTechnologyDetailById } from "@/lib/data/processed-data";
import {
  formatCountValue,
  formatDateForDisplay,
  formatRelatedSummary,
  hasDisplayValue,
} from "@/lib/detail-format";
import { buildRouteMetadata } from "@/lib/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getTechnologyDetailById(id);

  if (!detail) {
    return buildRouteMetadata({
      title: "Technology Not Found",
      description: "The requested technology record was not found in the current processed seed data.",
      path: "/technologies",
    });
  }

  return buildRouteMetadata({
    title: detail.technology.technologyName,
    description: detail.technology.summary,
    path: `/technologies/${encodeURIComponent(id)}`,
  });
}

export default async function TechnologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getTechnologyDetailById(id);

  if (!detail) {
    notFound();
  }

  const { technology, diseaseAreas, datasets, researchers, projects } = detail;
  const encodedTechnologyName = encodeURIComponent(technology.technologyName);

  const metadataItems = [
    { label: "Category", value: technology.technologyCategory },
    { label: "Measurement Focus", value: technology.measurementFocus },
    { label: "Vendor / Platform", value: technology.vendorPlatform },
    { label: "Last Updated", value: formatDateForDisplay(technology.lastUpdated) },
    { label: "Related Disease Areas", value: formatCountValue(diseaseAreas.length, "disease area") },
    { label: "Related Datasets", value: formatCountValue(datasets.length, "dataset") },
    { label: "Related Researchers", value: formatCountValue(researchers.length, "researcher") },
    { label: "Related Projects", value: formatCountValue(projects.length, "project") },
  ];

  const hasMetadataSection = metadataItems.some((item) => hasDisplayValue(item.value));
  const detailExportPayload = {
    entityType: "technology",
    technology: {
      id: technology.id,
      technologyName: technology.technologyName,
      technologyCategory: technology.technologyCategory,
      summary: technology.summary,
      measurementFocus: technology.measurementFocus,
      vendorPlatform: technology.vendorPlatform,
      lastUpdated: technology.lastUpdated,
    },
    related: {
      diseaseAreas: diseaseAreas.map((item) => ({ id: item.id, name: item.diseaseAreaName })),
      datasets: datasets.map((item) => ({ id: item.id, name: item.datasetName })),
      researchers: researchers.map((item) => ({ id: item.id, name: item.fullName })),
      projects: projects.map((item) => ({ id: item.id, name: item.projectName })),
    },
  };
  const quickNavItems = [
    { id: "overview", label: "Overview" },
    hasMetadataSection ? { id: "metadata", label: "Metadata" } : null,
    diseaseAreas.length > 0 ? { id: "related-disease-areas", label: "Disease Areas", count: diseaseAreas.length } : null,
    datasets.length > 0 ? { id: "related-datasets", label: "Datasets", count: datasets.length } : null,
    researchers.length > 0 ? { id: "related-researchers", label: "Researchers", count: researchers.length } : null,
    projects.length > 0 ? { id: "related-projects", label: "Projects", count: projects.length } : null,
  ].filter((item): item is { id: string; label: string; count?: number } => Boolean(item));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Technologies", href: "/technologies" },
          { label: technology.technologyName },
        ]}
      />

      <DetailSectionNav items={quickNavItems} />

      <section id="overview" className="scroll-mt-24">
        <PageHeader
          title={technology.technologyName}
          description={technology.summary}
          actions={
            <div className="flex flex-col gap-1 md:items-end">
              <ShareExportActions
                fileStem={`technology-${technology.id}`}
                showCsv={false}
                jsonData={detailExportPayload}
                className="md:items-end"
              />
              <CompareToggleButton type="technology" id={technology.id} label={technology.technologyName} />
            </div>
          }
        />
      </section>

      <MetadataList
        id="metadata"
        title="Structured Metadata"
        description="Core method details with linked entity counts for navigation context."
        items={metadataItems}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <RelatedEntitiesPanel
          id="related-disease-areas"
          title="Disease Areas"
          description="Cancer contexts where this technology appears in linked data."
          summaryLine={`${formatRelatedSummary(diseaseAreas.length, "disease area")} Shows where this method is currently represented.`}
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
          id="related-datasets"
          title="Datasets"
          description="Datasets using this technology."
          summaryLine={`${formatRelatedSummary(datasets.length, "dataset")} Indicates connected data resources.`}
          browseHref={`/datasets?q=${encodedTechnologyName}`}
          browseLabel="Browse matching datasets"
          emptyLabel="No datasets linked in current seed data."
          items={datasets.map((item) => ({
            id: item.id,
            label: item.datasetName,
            href: `/datasets/${item.id}`,
            description: item.datasetType,
          }))}
        />
        <RelatedEntitiesPanel
          id="related-researchers"
          title="Researchers"
          description="Researchers associated with this technology."
          summaryLine={`${formatRelatedSummary(researchers.length, "researcher")} Highlights likely collaborators using this method.`}
          browseHref={`/researchers?q=${encodedTechnologyName}`}
          browseLabel="Browse matching researchers"
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
            description="Programs connected via linked datasets."
            summaryLine={`${formatRelatedSummary(projects.length, "project")} Reflects program activity tied to this method.`}
            browseHref="/projects"
            browseLabel="Browse all projects"
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
    </div>
  );
}
