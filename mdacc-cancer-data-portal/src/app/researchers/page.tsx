import type { Metadata } from "next";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { formatUpdatedMetadata } from "@/lib/entity-metadata";
import { shapeResearcherExportRows } from "@/lib/export-shape";
import { compareUpdatedDesc, matchesQueryTokens, tokenizeQuery } from "@/lib/list-browse";
import { getPortalData, getPortalSnapshot } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";

type ListQuery = {
  q?: string;
  sort?: string;
  disease?: string;
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Researchers",
  description: "Browse researcher profiles with compact keyword, disease-area, and sorting controls.",
  path: "/researchers",
  keywords: ["researchers", "investigators", "disease-area filter", "collaboration discovery"],
});

export default async function ResearchersPage({ searchParams }: { searchParams: Promise<ListQuery> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort?.trim() || "name_asc";
  const selectedDisease = params.disease?.trim() ?? "";

  const [portalData, snapshot] = await Promise.all([getPortalData(), getPortalSnapshot()]);
  const { researchers, diseaseAreas, technologies, relationships } = portalData;

  const diseaseOptions = diseaseAreas
    .map((area) => ({ value: area.id, label: area.diseaseAreaName }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((area) => [area.id, area.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((technology) => [technology.id, technology.technologyName]));
  const tokens = tokenizeQuery(q);

  const filteredResearchers = researchers
    .filter((researcher) => {
      if (!selectedDisease) {
        return true;
      }
      return (relationships.researcherToDiseaseAreas[researcher.id] ?? []).includes(selectedDisease);
    })
    .filter((researcher) => {
      const diseaseNames = (relationships.researcherToDiseaseAreas[researcher.id] ?? [])
        .map((id) => diseaseNameById[id])
        .filter(Boolean);
      return matchesQueryTokens(tokens, [
        researcher.fullName,
        researcher.title,
        researcher.department,
        researcher.centerProgram,
        researcher.shortBio,
        researcher.labName,
        ...diseaseNames,
      ]);
    })
    .sort((a, b) => {
      if (sort === "updated_desc") {
        const byUpdated = compareUpdatedDesc(a.lastUpdated, b.lastUpdated);
        if (byUpdated !== 0) {
          return byUpdated;
        }
      }
      return a.fullName.localeCompare(b.fullName);
    });

  const activeTokens = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    selectedDisease ? { key: "disease", label: `Disease: ${diseaseNameById[selectedDisease] ?? selectedDisease}` } : null,
    sort !== "name_asc"
      ? { key: "sort", label: sort === "updated_desc" ? "Sort: Recently updated" : `Sort: ${sort}` }
      : null,
  ].filter((token): token is { key: string; label: string } => Boolean(token));

  const exportRows = shapeResearcherExportRows({
    ...portalData,
    researchers: filteredResearchers,
  });
  const exportPayload = {
    route: "/researchers",
    query: { q, sort, disease: selectedDisease },
    resultCount: filteredResearchers.length,
    rows: exportRows,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Researchers"
        description="Browse researcher profiles with lightweight filtering and sorting, or jump to Explore for mixed-entity discovery."
        actions={
          <ShareExportActions
            fileStem="researchers-results"
            csvRows={exportRows}
            jsonData={exportRows.length > 0 ? exportPayload : undefined}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        variant="compact"
        contextLine="Directory coverage is evolving as additional investigator profiles and links are added."
        snapshot={snapshot}
      />

      <BrowseToolbar
        action="/researchers"
        query={q}
        queryPlaceholder="Search by name, unit, disease, or method"
        sort={sort}
        sortOptions={[
          { value: "name_asc", label: "Name (A-Z)" },
          { value: "updated_desc", label: "Recently Updated" },
        ]}
        filterName="disease"
        filterLabel="Disease Area"
        filterValue={selectedDisease}
        filterOptions={[{ value: "", label: "All Disease Areas" }, ...diseaseOptions]}
        resultCount={filteredResearchers.length}
        activeTokens={activeTokens}
        clearHref="/researchers"
      />

      {filteredResearchers.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="hidden grid-cols-[2fr_1.4fr_1.2fr] gap-3 border-b border-slate-200 bg-[var(--surface-muted)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
            <p>Researcher</p>
            <p>Focus</p>
            <p>Snapshot</p>
          </div>

          <ul className="divide-y divide-slate-100">
            {filteredResearchers.map((researcher) => {
              const subtitle = [researcher.title, researcher.department].filter(Boolean).join(" - ");
              const diseaseChips = (relationships.researcherToDiseaseAreas[researcher.id] ?? [])
                .map((id) => diseaseNameById[id])
                .filter(Boolean)
                .slice(0, 2);
              const technologyChips = (relationships.researcherToTechnologies[researcher.id] ?? [])
                .map((id) => technologyNameById[id])
                .filter(Boolean)
                .slice(0, 2);

              return (
                <li key={researcher.id} className="px-4 py-4">
                  <div className="grid gap-3 md:grid-cols-[2fr_1.4fr_1.2fr] md:items-center">
                    <div className="min-w-0">
                      <Link href={`/researchers/${researcher.id}`} className="text-base font-semibold text-[#1f3f70] hover:underline">
                        {researcher.fullName}
                      </Link>
                      <p className="mt-1 text-sm text-slate-600">{subtitle || "Researcher profile"}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disease and Technology</p>
                      <MetadataChips items={[...diseaseChips, ...technologyChips]} max={4} className="mt-1" />
                    </div>

                    <div className="text-sm text-slate-600">
                      <p>{formatUpdatedMetadata(researcher.lastUpdated)}</p>
                      <p className="mt-1 text-xs">
                        {(relationships.researcherToDatasets[researcher.id] ?? []).length} datasets
                        {" - "}
                        {(relationships.researcherToProjects[researcher.id] ?? []).length} projects
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <EmptyStatePanel
          title="No matching researchers"
          description="Try removing a filter, changing sort, or broadening the keyword query."
          actionHref="/researchers"
          actionLabel="Reset browse controls"
        />
      )}
    </div>
  );
}
