import type { Metadata } from "next";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { formatUpdatedMetadata } from "@/lib/entity-metadata";
import { shapeDiseaseAreaExportRows } from "@/lib/export-shape";
import { compareUpdatedDesc, matchesQueryTokens, tokenizeQuery } from "@/lib/list-browse";
import { getDiseaseAreas, getPortalData, getPortalSnapshot } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";

type ListQuery = {
  q?: string;
  sort?: string;
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Disease Areas",
  description: "Browse disease areas with compact keyword and sorting controls for disease-first discovery.",
  path: "/disease-areas",
  keywords: ["disease areas", "cancer types", "disease-first discovery"],
});

export default async function DiseaseAreasPage({ searchParams }: { searchParams: Promise<ListQuery> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort?.trim() || "name_asc";

  const [diseaseAreas, portalData, snapshot] = await Promise.all([
    getDiseaseAreas(),
    getPortalData(),
    getPortalSnapshot(),
  ]);
  const { relationships } = portalData;
  const tokens = tokenizeQuery(q);

  const filteredDiseaseAreas = diseaseAreas
    .filter((diseaseArea) => matchesQueryTokens(tokens, [diseaseArea.diseaseAreaName, diseaseArea.diseaseGroup, diseaseArea.summary]))
    .sort((a, b) => {
      if (sort === "updated_desc") {
        const byUpdated = compareUpdatedDesc(a.lastUpdated, b.lastUpdated);
        if (byUpdated !== 0) {
          return byUpdated;
        }
      }

      if (sort === "researchers_desc") {
        const aCount = (relationships.diseaseAreaToResearchers[a.id] ?? []).length;
        const bCount = (relationships.diseaseAreaToResearchers[b.id] ?? []).length;
        if (bCount !== aCount) {
          return bCount - aCount;
        }
      }

      return a.diseaseAreaName.localeCompare(b.diseaseAreaName);
    });

  const activeTokens = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    sort !== "name_asc"
      ? {
          key: "sort",
          label:
            sort === "updated_desc"
              ? "Sort: Recently updated"
              : sort === "researchers_desc"
                ? "Sort: Most linked researchers"
                : `Sort: ${sort}`,
        }
      : null,
  ].filter((token): token is { key: string; label: string } => Boolean(token));

  const exportRows = shapeDiseaseAreaExportRows({
    ...portalData,
    diseaseAreas: filteredDiseaseAreas,
  });
  const exportPayload = {
    route: "/disease-areas",
    query: { q, sort },
    resultCount: filteredDiseaseAreas.length,
    rows: exportRows,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Disease Areas"
        description="Browse disease areas with compact keyword and sorting controls for disease-first discovery."
        actions={
          <ShareExportActions
            fileStem="disease-areas-results"
            csvRows={exportRows}
            jsonData={exportRows.length > 0 ? exportPayload : undefined}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        variant="compact"
        contextLine="Disease-area associations may expand as additional entity relationships are curated."
        snapshot={snapshot}
      />

      <BrowseToolbar
        action="/disease-areas"
        query={q}
        queryPlaceholder="Search by disease area name, group, or summary"
        sort={sort}
        sortOptions={[
          { value: "name_asc", label: "Name (A-Z)" },
          { value: "updated_desc", label: "Recently Updated" },
          { value: "researchers_desc", label: "Most Linked Researchers" },
        ]}
        resultCount={filteredDiseaseAreas.length}
        activeTokens={activeTokens}
        clearHref="/disease-areas"
      />

      {filteredDiseaseAreas.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="hidden grid-cols-[2fr_1.6fr_1.2fr] gap-3 border-b border-slate-200 bg-[var(--surface-muted)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
            <p>Disease Area</p>
            <p>Context</p>
            <p>Activity Snapshot</p>
          </div>

          <ul className="divide-y divide-slate-100">
            {filteredDiseaseAreas.map((diseaseArea) => {
              const researcherCount = (relationships.diseaseAreaToResearchers[diseaseArea.id] ?? []).length;
              const datasetCount = (relationships.diseaseAreaToDatasets[diseaseArea.id] ?? []).length;
              const technologyCount = (relationships.diseaseAreaToTechnologies[diseaseArea.id] ?? []).length;
              const projectCount = (relationships.diseaseAreaToProjects[diseaseArea.id] ?? []).length;

              return (
                <li key={diseaseArea.id} className="px-4 py-4">
                  <div className="grid gap-3 md:grid-cols-[2fr_1.6fr_1.2fr] md:items-center">
                    <div className="min-w-0">
                      <Link href={`/disease-areas/${diseaseArea.id}`} className="text-base font-semibold text-[#1f3f70] hover:underline">
                        {diseaseArea.diseaseAreaName}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {diseaseArea.summary ?? "Disease area summary not provided."}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Group and Coverage</p>
                      <MetadataChips
                        items={[
                          diseaseArea.diseaseGroup ?? "Disease group not specified",
                          `${researcherCount} researchers`,
                          `${datasetCount} datasets`,
                          `${technologyCount} technologies`,
                        ]}
                        max={4}
                        className="mt-1"
                      />
                    </div>

                    <div className="text-sm text-slate-600">
                      <p>{projectCount} linked projects</p>
                      <p className="mt-1 text-xs">{formatUpdatedMetadata(diseaseArea.lastUpdated)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <EmptyStatePanel
          title="No matching disease areas"
          description="Try removing a filter, changing sort, or broadening the keyword query."
          actionHref="/disease-areas"
          actionLabel="Reset browse controls"
        />
      )}
    </div>
  );
}
