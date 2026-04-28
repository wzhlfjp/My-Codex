import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DetailSectionNav } from "@/components/ui/detail-section-nav";
import { MetadataList } from "@/components/ui/metadata-list";
import { PageHeader } from "@/components/ui/page-header";
import { RelatedEntitiesPanel } from "@/components/ui/related-entities-panel";
import { getDiseaseAreaDetailById } from "@/lib/data/processed-data";
import {
  formatCountValue,
  formatDateForDisplay,
  formatRelatedSummary,
  hasDisplayValue,
} from "@/lib/detail-format";
import { buildRouteMetadata } from "@/lib/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getDiseaseAreaDetailById(id);

  if (!detail) {
    return buildRouteMetadata({
      title: "Disease Area Not Found",
      description: "The requested disease-area record was not found in the current processed seed data.",
      path: "/disease-areas",
    });
  }

  return buildRouteMetadata({
    title: detail.diseaseArea.diseaseAreaName,
    description: detail.diseaseArea.summary ?? "Disease-area profile in the MD Anderson Cancer Data Portal.",
    path: `/disease-areas/${encodeURIComponent(id)}`,
  });
}

export default async function DiseaseAreaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getDiseaseAreaDetailById(id);

  if (!detail) {
    notFound();
  }

  const { diseaseArea, researchers, datasets, technologies, projects } = detail;
  const metadataItems = [
    { label: "Disease Group", value: diseaseArea.diseaseGroup },
    { label: "Last Updated", value: formatDateForDisplay(diseaseArea.lastUpdated) },
    { label: "Related Researchers", value: formatCountValue(researchers.length, "researcher") },
    { label: "Related Datasets", value: formatCountValue(datasets.length, "dataset") },
    { label: "Related Technologies", value: formatCountValue(technologies.length, "technology") },
    { label: "Related Projects", value: formatCountValue(projects.length, "project") },
  ];
  const hasMetadataSection = metadataItems.some((item) => hasDisplayValue(item.value));
  const detailExportPayload = {
    entityType: "disease-area",
    diseaseArea: {
      id: diseaseArea.id,
      diseaseAreaName: diseaseArea.diseaseAreaName,
      diseaseGroup: diseaseArea.diseaseGroup,
      summary: diseaseArea.summary,
      lastUpdated: diseaseArea.lastUpdated,
    },
    related: {
      researchers: researchers.map((item) => ({ id: item.id, name: item.fullName })),
      datasets: datasets.map((item) => ({ id: item.id, name: item.datasetName })),
      technologies: technologies.map((item) => ({ id: item.id, name: item.technologyName })),
      projects: projects.map((item) => ({ id: item.id, name: item.projectName })),
    },
  };

  const quickNavItems = [
    { id: "overview", label: "Overview" },
    hasMetadataSection ? { id: "metadata", label: "Metadata" } : null,
    researchers.length > 0 ? { id: "related-researchers", label: "Researchers", count: researchers.length } : null,
    datasets.length > 0 ? { id: "related-datasets", label: "Datasets", count: datasets.length } : null,
    technologies.length > 0 ? { id: "related-technologies", label: "Technologies", count: technologies.length } : null,
    projects.length > 0 ? { id: "related-projects", label: "Projects", count: projects.length } : null,
  ].filter((item): item is { id: string; label: string; count?: number } => Boolean(item));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Disease Areas", href: "/disease-areas" },
          { label: diseaseArea.diseaseAreaName },
        ]}
      />

      <DetailSectionNav items={quickNavItems} />

      <section id="overview" className="scroll-mt-24">
        <PageHeader
          title={diseaseArea.diseaseAreaName}
          description={diseaseArea.summary ?? "Disease-area profile in the MD Anderson Cancer Data Portal."}
          actions={
            <div className="flex flex-col gap-1 md:items-end">
              <ShareExportActions
                fileStem={`disease-area-${diseaseArea.id}`}
                showCsv={false}
                jsonData={detailExportPayload}
                className="md:items-end"
              />
            </div>
          }
        />
      </section>

      <MetadataList
        id="metadata"
        title="Structured Metadata"
        description="Disease-area grouping, freshness, and relationship counts."
        items={metadataItems}
      />

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <section className="grid gap-4 md:grid-cols-2">
            <RelatedEntitiesPanel
              id="related-researchers"
              title="Researchers"
              description="People currently linked to this disease area."
              summaryLine={`${formatRelatedSummary(researchers.length, "researcher")} Represents currently mapped investigator activity.`}
              browseHref={`/researchers?disease=${diseaseArea.id}`}
              browseLabel="Browse all related researchers"
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
              description="Available data resources relevant to this disease area."
              summaryLine={`${formatRelatedSummary(datasets.length, "dataset")} Supports disease-specific data discovery.`}
              browseHref={`/datasets?disease=${diseaseArea.id}`}
              browseLabel="Browse all related datasets"
              emptyLabel="No datasets linked in current seed data."
              items={datasets.map((item) => ({
                id: item.id,
                label: item.datasetName,
                href: `/datasets/${item.id}`,
                description: item.datasetType,
              }))}
            />
            <RelatedEntitiesPanel
              id="related-technologies"
              title="Technologies"
              description="Measurement approaches associated with this disease area."
              summaryLine={`${formatRelatedSummary(technologies.length, "technology")} Captures method coverage for this disease area.`}
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
            {projects.length > 0 ? (
              <RelatedEntitiesPanel
                id="related-projects"
                title="Projects"
                description="Programs connected to this disease area."
                summaryLine={`${formatRelatedSummary(projects.length, "project")} Adds program-level context.`}
                browseHref={`/projects?disease=${diseaseArea.id}`}
                browseLabel="Browse all related projects"
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

        <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Disease Snapshot</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disease Group</dt>
                <dd className="mt-1 text-slate-800">{diseaseArea.diseaseGroup ?? "Not specified"}</dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Linked Portfolio</dt>
                <dd className="mt-1 text-slate-800">
                  {researchers.length} researchers - {datasets.length} datasets - {technologies.length} technologies
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Browse Disease Areas</dt>
                <dd className="mt-1">
                  <Link href="/disease-areas" className="font-medium text-blue-800 underline hover:text-blue-700">
                    View all disease areas
                  </Link>
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </section>
    </div>
  );
}
