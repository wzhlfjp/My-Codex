import type { Metadata } from "next";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { PageHeader } from "@/components/ui/page-header";
import { EntityListCard } from "@/components/ui/entity-list-card";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { formatUpdatedMetadata, uniqueCompactMetadata } from "@/lib/entity-metadata";
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
        <section className="grid gap-4 md:grid-cols-2">
          {filteredTechnologies.map((technology) => (
            <div key={technology.id} className="space-y-1">
              <EntityListCard
                title={technology.technologyName}
                subtitle={technology.summary}
                metadata={uniqueCompactMetadata([
                  technology.technologyCategory,
                  `${(relationships.technologyToDatasets[technology.id] ?? []).length} datasets`,
                  `${(relationships.technologyToResearchers[technology.id] ?? []).length} researchers`,
                ])}
                metaLine={formatUpdatedMetadata(technology.lastUpdated)}
                href={`/technologies/${technology.id}`}
              />
              <CompareToggleButton type="technology" id={technology.id} label={technology.technologyName} />
            </div>
          ))}
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
