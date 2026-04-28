import type { Metadata } from "next";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { formatUpdatedMetadata } from "@/lib/entity-metadata";
import { shapeTechnologyExportRows } from "@/lib/export-shape";
import { compareUpdatedDesc, matchesQueryTokens, tokenizeQuery } from "@/lib/list-browse";
import { getPortalData, getPortalSnapshot } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";

type ListQuery = {
  q?: string;
  sort?: string;
  category?: string;
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Technologies",
  description: "Browse technologies and measurement platforms with compact keyword, category, and sorting controls.",
  path: "/technologies",
  keywords: ["technologies", "measurement platforms", "methods", "category filter"],
});

export default async function TechnologiesPage({ searchParams }: { searchParams: Promise<ListQuery> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort?.trim() || "name_asc";
  const selectedCategory = params.category?.trim() ?? "";

  const [portalData, snapshot] = await Promise.all([getPortalData(), getPortalSnapshot()]);
  const { technologies, relationships } = portalData;
  const tokens = tokenizeQuery(q);
  const categoryOptions = [...new Set(technologies.map((technology) => technology.technologyCategory))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({ value: category, label: category }));

  const filteredTechnologies = technologies
    .filter((technology) => (selectedCategory ? technology.technologyCategory === selectedCategory : true))
    .filter((technology) =>
      matchesQueryTokens(tokens, [
        technology.technologyName,
        technology.technologyCategory,
        technology.summary,
        technology.measurementFocus,
        technology.vendorPlatform,
      ]),
    )
    .sort((a, b) => {
      if (sort === "updated_desc") {
        const byUpdated = compareUpdatedDesc(a.lastUpdated, b.lastUpdated);
        if (byUpdated !== 0) {
          return byUpdated;
        }
      }
      if (sort === "category_asc") {
        const byCategory = a.technologyCategory.localeCompare(b.technologyCategory);
        if (byCategory !== 0) {
          return byCategory;
        }
      }
      return a.technologyName.localeCompare(b.technologyName);
    });

  const activeTokens = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    selectedCategory ? { key: "category", label: `Category: ${selectedCategory}` } : null,
    sort !== "name_asc"
      ? {
          key: "sort",
          label:
            sort === "updated_desc"
              ? "Sort: Recently updated"
              : sort === "category_asc"
                ? "Sort: Category (A-Z)"
                : `Sort: ${sort}`,
        }
      : null,
  ].filter((token): token is { key: string; label: string } => Boolean(token));

  const exportRows = shapeTechnologyExportRows({
    ...portalData,
    technologies: filteredTechnologies,
  });
  const exportPayload = {
    route: "/technologies",
    query: { q, sort, category: selectedCategory },
    resultCount: filteredTechnologies.length,
    rows: exportRows,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technologies"
        description="Browse technologies with lightweight keyword, category, and sorting controls."
        actions={
          <ShareExportActions
            fileStem="technologies-results"
            csvRows={exportRows}
            jsonData={exportRows.length > 0 ? exportPayload : undefined}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        variant="compact"
        contextLine="Technology categories and labels are being standardized and refined over time."
        snapshot={snapshot}
      />

      <BrowseToolbar
        action="/technologies"
        query={q}
        queryPlaceholder="Search by technology, category, or measurement focus"
        sort={sort}
        sortOptions={[
          { value: "name_asc", label: "Name (A-Z)" },
          { value: "updated_desc", label: "Recently Updated" },
          { value: "category_asc", label: "Category (A-Z)" },
        ]}
        filterName="category"
        filterLabel="Category"
        filterValue={selectedCategory}
        filterOptions={[{ value: "", label: "All Categories" }, ...categoryOptions]}
        resultCount={filteredTechnologies.length}
        activeTokens={activeTokens}
        clearHref="/technologies"
      />

      {filteredTechnologies.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="hidden grid-cols-[2fr_1.6fr_1.2fr] gap-3 border-b border-slate-200 bg-[var(--surface-muted)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 md:grid">
            <p>Technology</p>
            <p>Context</p>
            <p>Usage Snapshot</p>
          </div>

          <ul className="divide-y divide-slate-100">
            {filteredTechnologies.map((technology) => {
              const datasetCount = (relationships.technologyToDatasets[technology.id] ?? []).length;
              const researcherCount = (relationships.technologyToResearchers[technology.id] ?? []).length;
              const diseaseCount = (relationships.technologyToDiseaseAreas[technology.id] ?? []).length;

              return (
                <li key={technology.id} className="px-4 py-4">
                  <div className="grid gap-3 md:grid-cols-[2fr_1.6fr_1.2fr] md:items-center">
                    <div className="min-w-0">
                      <Link href={`/technologies/${technology.id}`} className="text-base font-semibold text-[#1f3f70] hover:underline">
                        {technology.technologyName}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{technology.summary}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category and Focus</p>
                      <MetadataChips
                        items={[technology.technologyCategory, technology.measurementFocus ?? "Measurement focus not specified"]}
                        max={2}
                        className="mt-1"
                      />
                    </div>

                    <div className="text-sm text-slate-600">
                      <p>{datasetCount} datasets - {researcherCount} researchers</p>
                      <p className="mt-1 text-xs">
                        {diseaseCount} disease areas - {formatUpdatedMetadata(technology.lastUpdated)}
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
          title="No matching technologies"
          description="Try removing a filter, changing sort, or broadening the keyword query."
          actionHref="/technologies"
          actionLabel="Reset browse controls"
        />
      )}
    </div>
  );
}
