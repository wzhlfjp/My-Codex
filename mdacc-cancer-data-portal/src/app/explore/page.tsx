import type { Metadata } from "next";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { PageHeader } from "@/components/ui/page-header";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { ExploreFilters } from "@/components/explore/explore-filters";
import { ExploreResultCard } from "@/components/explore/explore-result-card";
import { getExploreData, getExploreTypeLabel } from "@/lib/explore";
import { shapeExploreExportRows } from "@/lib/export-shape";
import { getPortalSnapshot } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";
import type { ExploreQuery } from "@/types/domain";

export const metadata: Metadata = buildRouteMetadata({
  title: "Explore",
  description: "Search across researchers, projects, datasets, technologies, and disease areas with simple, URL-shareable filters.",
  path: "/explore",
  keywords: ["explore", "search", "filters", "researchers", "datasets", "technologies", "projects", "disease areas"],
});

export default async function ExplorePage({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  const params = await searchParams;
  const [{ diseaseFilterOptions, results, normalizedQuery }, snapshot] = await Promise.all([
    getExploreData(params),
    getPortalSnapshot(),
  ]);
  const exportRows = shapeExploreExportRows(results);
  const exportPayload = {
    route: "/explore",
    query: normalizedQuery,
    resultCount: results.length,
    rows: exportRows,
  };

  const activeFilters = [
    normalizedQuery.q ? `Keyword: ${normalizedQuery.q}` : "",
    normalizedQuery.type !== "all" ? `Type: ${getExploreTypeLabel(normalizedQuery.type)}` : "",
    normalizedQuery.disease
      ? `Disease: ${diseaseFilterOptions.find((option) => option.id === normalizedQuery.disease)?.name ?? normalizedQuery.disease}`
      : "",
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Explore" }]} />

      <PageHeader
        title="Explore"
        description="Search across researchers, projects, datasets, technologies, and disease areas. Use simple filters to narrow the discovery space."
        actions={
          <ShareExportActions
            fileStem="explore-results"
            csvRows={exportRows}
            jsonData={exportRows.length > 0 ? exportPayload : undefined}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        contextLine="Result coverage is improving over time as additional records and relationships are curated."
        snapshot={snapshot}
      />

      <ExploreFilters
        query={normalizedQuery.q}
        selectedType={normalizedQuery.type}
        selectedDisease={normalizedQuery.disease}
        diseaseOptions={diseaseFilterOptions}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{results.length}</span> results
          </p>
          {activeFilters.length > 0 ? (
            <MetadataChips items={activeFilters} className="mt-0" max={6} />
          ) : (
            <p className="text-xs text-slate-500">No active filters</p>
          )}
        </div>
      </section>

      {results.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {results.map((result) => (
            <ExploreResultCard key={`${result.type}-${result.id}`} result={result} />
          ))}
        </section>
      ) : (
        <EmptyStatePanel
          title="No matching results"
          description="Try removing a filter or broadening your keyword to explore more records."
          actionHref="/explore"
          actionLabel="Clear filters"
        />
      )}
    </div>
  );
}
