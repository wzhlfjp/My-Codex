import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DetailSectionNav } from "@/components/ui/detail-section-nav";
import { MetadataList } from "@/components/ui/metadata-list";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationPanel } from "@/components/ui/recommendation-panel";
import { RelatedEntitiesPanel } from "@/components/ui/related-entities-panel";
import { getPortalData, getResearcherDetailById } from "@/lib/data/processed-data";
import {
  formatCountValue,
  formatDateForDisplay,
  formatRelatedSummary,
  hasDisplayValue,
} from "@/lib/detail-format";
import { getResearcherRecommendations } from "@/lib/recommendations";
import { buildRouteMetadata } from "@/lib/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getResearcherDetailById(id);

  if (!detail) {
    return buildRouteMetadata({
      title: "Researcher Not Found",
      description: "The requested researcher record was not found in the current processed seed data.",
      path: "/researchers",
    });
  }

  return buildRouteMetadata({
    title: detail.researcher.fullName,
    description: detail.researcher.shortBio ?? "Researcher profile in the MD Anderson Cancer Data Portal.",
    path: `/researchers/${encodeURIComponent(id)}`,
  });
}

export default async function ResearcherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, portalData] = await Promise.all([getResearcherDetailById(id), getPortalData()]);

  if (!detail) {
    notFound();
  }

  const { researcher, datasets, technologies, diseaseAreas, projects } = detail;
  const recommendations = getResearcherRecommendations(researcher.id, portalData);
  const primaryDiseaseArea = diseaseAreas[0];

  const metadataItems = [
    { label: "Title", value: researcher.title },
    { label: "Department", value: researcher.department },
    { label: "Center / Program", value: researcher.centerProgram },
    { label: "Lab Name", value: researcher.labName },
    { label: "Last Updated", value: formatDateForDisplay(researcher.lastUpdated) },
    { label: "Related Disease Areas", value: formatCountValue(diseaseAreas.length, "disease area") },
    { label: "Related Technologies", value: formatCountValue(technologies.length, "technology") },
    { label: "Related Datasets", value: formatCountValue(datasets.length, "dataset") },
    { label: "Related Projects", value: formatCountValue(projects.length, "project") },
  ];
  const hasMetadataSection = metadataItems.some((item) => hasDisplayValue(item.value));
  const detailExportPayload = {
    entityType: "researcher",
    researcher: {
      id: researcher.id,
      fullName: researcher.fullName,
      title: researcher.title,
      department: researcher.department,
      centerProgram: researcher.centerProgram,
      shortBio: researcher.shortBio,
      lastUpdated: researcher.lastUpdated,
    },
    related: {
      diseaseAreas: diseaseAreas.map((item) => ({ id: item.id, name: item.diseaseAreaName })),
      datasets: datasets.map((item) => ({ id: item.id, name: item.datasetName })),
      technologies: technologies.map((item) => ({ id: item.id, name: item.technologyName })),
      projects: projects.map((item) => ({ id: item.id, name: item.projectName })),
    },
  };

  const quickNavItems = [
    { id: "overview", label: "Overview" },
    hasMetadataSection ? { id: "metadata", label: "Metadata" } : null,
    diseaseAreas.length > 0 ? { id: "related-disease-areas", label: "Disease Areas", count: diseaseAreas.length } : null,
    datasets.length > 0 ? { id: "related-datasets", label: "Datasets", count: datasets.length } : null,
    technologies.length > 0 ? { id: "related-technologies", label: "Technologies", count: technologies.length } : null,
    projects.length > 0 ? { id: "related-projects", label: "Projects", count: projects.length } : null,
    recommendations.items.length > 0
      ? { id: "recommended-researchers", label: "Suggested Researchers", count: recommendations.items.length }
      : null,
  ].filter((item): item is { id: string; label: string; count?: number } => Boolean(item));

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Researchers", href: "/researchers" },
          { label: researcher.fullName },
        ]}
      />

      <DetailSectionNav items={quickNavItems} />

      <section id="overview" className="scroll-mt-24">
        <PageHeader
          title={researcher.fullName}
          description={researcher.shortBio ?? "Researcher profile in the MD Anderson Cancer Data Portal."}
          actions={
            <div className="flex flex-col gap-1 md:items-end">
              <ShareExportActions
                fileStem={`researcher-${researcher.id}`}
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
        description="Core affiliation and relationship context for this researcher."
        items={metadataItems}
      />

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <section className="grid gap-4 md:grid-cols-2">
            <RelatedEntitiesPanel
              id="related-disease-areas"
              title="Disease Areas"
              description="Cancer contexts connected to this researcher."
              summaryLine={`${formatRelatedSummary(diseaseAreas.length, "disease area")} Used to frame this profile's domain focus.`}
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
              description="Data resources associated with this researcher."
              summaryLine={`${formatRelatedSummary(datasets.length, "dataset")} Connected through current relationship mappings.`}
              browseHref={primaryDiseaseArea ? `/datasets?disease=${primaryDiseaseArea.id}` : "/datasets"}
              browseLabel={
                primaryDiseaseArea
                  ? `Browse datasets in ${primaryDiseaseArea.diseaseAreaName}`
                  : "Browse all datasets"
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
              id="related-technologies"
              title="Technologies"
              description="Methods and platforms used across related work."
              summaryLine={`${formatRelatedSummary(technologies.length, "technology")} Captures methods linked to this profile.`}
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
                description="Programs or initiatives linked to this researcher."
                summaryLine={`${formatRelatedSummary(projects.length, "project")} Highlights program-level involvement.`}
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
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Profile Snapshot</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Disease Context</dt>
                <dd className="mt-1 text-slate-800">{primaryDiseaseArea?.diseaseAreaName ?? "Not available"}</dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Connected Records</dt>
                <dd className="mt-1 text-slate-800">
                  {datasets.length} datasets, {technologies.length} technologies, {projects.length} projects
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Browse Profile Type</dt>
                <dd className="mt-1">
                  <Link href="/researchers" className="font-medium text-blue-800 underline hover:text-blue-700">
                    View all researchers
                  </Link>
                </dd>
              </div>
            </dl>
          </section>

          <RecommendationPanel
            id="recommended-researchers"
            title="You May Also Want to Look At"
            description="Similar researcher profiles based on shared disease areas, technologies, projects, or datasets."
            browseHref={recommendations.browseHref}
            browseLabel={recommendations.browseLabel}
            emptyLabel="No strong same-type recommendations are available yet for this profile."
            items={recommendations.items.map((item) => ({
              id: item.id,
              label: item.title,
              href: item.href,
              subtitle: item.subtitle,
              reason: item.reason,
              chips: item.chips,
            }))}
          />
        </aside>
      </section>
    </div>
  );
}
