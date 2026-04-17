import type { Metadata } from "next";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { PageHeader } from "@/components/ui/page-header";
import { EntityListCard } from "@/components/ui/entity-list-card";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { formatUpdatedMetadata, uniqueCompactMetadata } from "@/lib/entity-metadata";
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
        <section className="grid gap-4 md:grid-cols-2">
          {filteredDiseaseAreas.map((diseaseArea) => (
            <div key={diseaseArea.id} className="space-y-1">
              <EntityListCard
                title={diseaseArea.diseaseAreaName}
                subtitle={diseaseArea.summary ?? "Disease area summary not provided."}
                metadata={uniqueCompactMetadata([
                  diseaseArea.diseaseGroup,
                  `${(relationships.diseaseAreaToResearchers[diseaseArea.id] ?? []).length} researchers`,
                  `${(relationships.diseaseAreaToDatasets[diseaseArea.id] ?? []).length} datasets`,
                  `${(relationships.diseaseAreaToTechnologies[diseaseArea.id] ?? []).length} technologies`,
                ])}
                metaLine={formatUpdatedMetadata(diseaseArea.lastUpdated)}
                href={`/disease-areas/${diseaseArea.id}`}
              />
              <CompareToggleButton type="disease-area" id={diseaseArea.id} label={diseaseArea.diseaseAreaName} />
            </div>
          ))}
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
