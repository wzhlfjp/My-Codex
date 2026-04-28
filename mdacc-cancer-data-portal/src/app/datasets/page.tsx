import type { Metadata } from "next";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { formatUpdatedMetadata } from "@/lib/entity-metadata";
import { shapeDatasetExportRows } from "@/lib/export-shape";
import { compareUpdatedDesc, matchesQueryTokens, tokenizeQuery } from "@/lib/list-browse";
import { getPortalData, getPortalSnapshot } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";

type ListQuery = {
  q?: string;
  sort?: string;
  disease?: string;
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Datasets",
  description: "Browse datasets and data resources with compact filters for disease context, type, and recency.",
  path: "/datasets",
  keywords: ["datasets", "data resources", "disease filters", "technology-linked data"],
});

export default async function DatasetsPage({ searchParams }: { searchParams: Promise<ListQuery> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort?.trim() || "name_asc";
  const selectedDisease = params.disease?.trim() ?? "";

  const [portalData, snapshot] = await Promise.all([getPortalData(), getPortalSnapshot()]);
  const { datasets, diseaseAreas, technologies, relationships } = portalData;
  const tokens = tokenizeQuery(q);
  const diseaseOptions = diseaseAreas
    .map((area) => ({ value: area.id, label: area.diseaseAreaName }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((area) => [area.id, area.diseaseAreaName]));
  const technologyNameById = Object.fromEntries(technologies.map((technology) => [technology.id, technology.technologyName]));

  const filteredDatasets = datasets
    .filter((dataset) => {
      if (!selectedDisease) {
        return true;
      }
      return (relationships.datasetToDiseaseAreas[dataset.id] ?? []).includes(selectedDisease);
    })
    .filter((dataset) => {
      const diseaseNames = (relationships.datasetToDiseaseAreas[dataset.id] ?? [])
        .map((id) => diseaseNameById[id])
        .filter(Boolean);
      return matchesQueryTokens(tokens, [
        dataset.datasetName,
        dataset.datasetType,
        dataset.summary,
        dataset.dataModality,
        dataset.sampleScope,
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
      if (sort === "type_asc") {
        const byType = a.datasetType.localeCompare(b.datasetType);
        if (byType !== 0) {
          return byType;
        }
      }
      return a.datasetName.localeCompare(b.datasetName);
    });

  const activeTokens = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    selectedDisease ? { key: "disease", label: `Disease: ${diseaseNameById[selectedDisease] ?? selectedDisease}` } : null,
    sort !== "name_asc"
      ? {
          key: "sort",
          label:
            sort === "updated_desc" ? "Sort: Recently updated" : sort === "type_asc" ? "Sort: Data type (A-Z)" : `Sort: ${sort}`,
        }
      : null,
  ].filter((token): token is { key: string; label: string } => Boolean(token));

  const exportRows = shapeDatasetExportRows({
    ...portalData,
    datasets: filteredDatasets,
  });
  const exportPayload = {
    route: "/datasets",
    query: { q, sort, disease: selectedDisease },
    resultCount: filteredDatasets.length,
    rows: exportRows,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Datasets"
        description="Browse datasets with lightweight filtering and sorting by disease context, type, and update recency."
        actions={
          <ShareExportActions
            fileStem="datasets-results"
            csvRows={exportRows}
            jsonData={exportRows.length > 0 ? exportPayload : undefined}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        variant="compact"
        contextLine="Available entries are a starting sample and may not represent complete institutional coverage."
        snapshot={snapshot}
      />

      <BrowseToolbar
        action="/datasets"
        query={q}
        queryPlaceholder="Search by dataset, type, modality, or disease"
        sort={sort}
        sortOptions={[
          { value: "name_asc", label: "Name (A-Z)" },
          { value: "updated_desc", label: "Recently Updated" },
          { value: "type_asc", label: "Data Type (A-Z)" },
        ]}
        filterName="disease"
        filterLabel="Disease Area"
        filterValue={selectedDisease}
        filterOptions={[{ value: "", label: "All Disease Areas" }, ...diseaseOptions]}
        resultCount={filteredDatasets.length}
        activeTokens={activeTokens}
        clearHref="/datasets"
      />

      {filteredDatasets.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="hidden grid-cols-[2fr_1.6fr_1.2fr] gap-3 border-b border-slate-200 bg-[var(--surface-muted)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
            <p>Dataset</p>
            <p>Context</p>
            <p>Stewardship</p>
          </div>

          <ul className="divide-y divide-slate-100">
            {filteredDatasets.map((dataset) => {
              const diseaseChips = (relationships.datasetToDiseaseAreas[dataset.id] ?? [])
                .map((id) => diseaseNameById[id])
                .filter(Boolean)
                .slice(0, 2);
              const technologyChips = (relationships.datasetToTechnologies[dataset.id] ?? [])
                .map((id) => technologyNameById[id])
                .filter(Boolean)
                .slice(0, 2);

              return (
                <li key={dataset.id} className="px-4 py-4">
                  <div className="grid gap-3 md:grid-cols-[2fr_1.6fr_1.2fr] md:items-center">
                    <div className="min-w-0">
                      <Link href={`/datasets/${dataset.id}`} className="text-base font-semibold text-[#1f3f70] hover:underline">
                        {dataset.datasetName}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{dataset.summary}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disease and Technology</p>
                      <MetadataChips items={[dataset.datasetType, ...diseaseChips, ...technologyChips]} max={5} className="mt-1" />
                    </div>

                    <div className="text-sm text-slate-600">
                      <p>{formatUpdatedMetadata(dataset.lastUpdated)}</p>
                      <p className="mt-1 text-xs">
                        Access: {dataset.accessLevel ?? "Not specified"}
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
          title="No matching datasets"
          description="Try removing a filter, changing sort, or broadening the keyword query."
          actionHref="/datasets"
          actionLabel="Reset browse controls"
        />
      )}
    </div>
  );
}
