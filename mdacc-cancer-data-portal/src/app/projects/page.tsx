import type { Metadata } from "next";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { BrowseToolbar } from "@/components/browse/browse-toolbar";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { EntityListCard } from "@/components/ui/entity-list-card";
import { PageHeader } from "@/components/ui/page-header";
import { formatUpdatedMetadata, uniqueCompactMetadata } from "@/lib/entity-metadata";
import { getPortalData, getPortalSnapshot } from "@/lib/data/processed-data";
import { shapeProjectExportRows } from "@/lib/export-shape";
import { compareUpdatedDesc, matchesQueryTokens, tokenizeQuery } from "@/lib/list-browse";
import { formatProjectStatus, formatProjectType } from "@/lib/project-format";
import { buildRouteMetadata } from "@/lib/site-metadata";

type ListQuery = {
  q?: string;
  sort?: string;
  disease?: string;
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Projects",
  description: "Browse projects and programs with compact filters for disease context and update recency.",
  path: "/projects",
  keywords: ["projects", "programs", "initiatives", "disease-area filter"],
});

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<ListQuery> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const sort = params.sort?.trim() || "name_asc";
  const selectedDisease = params.disease?.trim() ?? "";

  const [portalData, snapshot] = await Promise.all([getPortalData(), getPortalSnapshot()]);
  const { projects, diseaseAreas, relationships } = portalData;
  const tokens = tokenizeQuery(q);
  const diseaseNameById = Object.fromEntries(diseaseAreas.map((item) => [item.id, item.diseaseAreaName]));
  const diseaseOptions = diseaseAreas
    .map((item) => ({ value: item.id, label: item.diseaseAreaName }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const filteredProjects = projects
    .filter((project) => {
      if (!selectedDisease) {
        return true;
      }
      return (relationships.projectToDiseaseAreas[project.id] ?? []).includes(selectedDisease);
    })
    .filter((project) => {
      const diseaseNames = (relationships.projectToDiseaseAreas[project.id] ?? [])
        .map((id) => diseaseNameById[id])
        .filter(Boolean);
      return matchesQueryTokens(tokens, [
        project.projectName,
        project.projectType,
        formatProjectType(project.projectType),
        project.summary,
        project.status,
        formatProjectStatus(project.status),
        project.departmentOwner,
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
        const byType = a.projectType.localeCompare(b.projectType);
        if (byType !== 0) {
          return byType;
        }
      }
      return a.projectName.localeCompare(b.projectName);
    });

  const activeTokens = [
    q ? { key: "q", label: `Keyword: ${q}` } : null,
    selectedDisease
      ? { key: "disease", label: `Disease: ${diseaseNameById[selectedDisease] ?? selectedDisease}` }
      : null,
    sort !== "name_asc"
      ? {
          key: "sort",
          label:
            sort === "updated_desc"
              ? "Sort: Recently updated"
              : sort === "type_asc"
                ? "Sort: Project type (A-Z)"
                : `Sort: ${sort}`,
        }
      : null,
  ].filter((token): token is { key: string; label: string } => Boolean(token));

  const exportRows = shapeProjectExportRows({
    ...portalData,
    projects: filteredProjects,
  });
  const exportPayload = {
    route: "/projects",
    query: { q, sort, disease: selectedDisease },
    resultCount: filteredProjects.length,
    rows: exportRows,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Browse projects and programs linked to researchers, datasets, and disease areas."
        actions={
          <ShareExportActions
            fileStem="projects-results"
            csvRows={exportRows}
            jsonData={exportRows.length > 0 ? exportPayload : undefined}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        variant="compact"
        contextLine="Project coverage is currently limited and will expand as additional program records are curated."
        snapshot={snapshot}
      />

      <BrowseToolbar
        action="/projects"
        query={q}
        queryPlaceholder="Search by project name, type, status, or department"
        sort={sort}
        sortOptions={[
          { value: "name_asc", label: "Name (A-Z)" },
          { value: "updated_desc", label: "Recently Updated" },
          { value: "type_asc", label: "Project Type (A-Z)" },
        ]}
        filterName="disease"
        filterLabel="Disease Area"
        filterValue={selectedDisease}
        filterOptions={[{ value: "", label: "All Disease Areas" }, ...diseaseOptions]}
        resultCount={filteredProjects.length}
        activeTokens={activeTokens}
        clearHref="/projects"
      />

      {filteredProjects.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <div key={project.id} className="space-y-1">
              <EntityListCard
                title={project.projectName}
                subtitle={project.summary}
                metadata={uniqueCompactMetadata([
                  formatProjectType(project.projectType),
                  formatProjectStatus(project.status),
                  ...(relationships.projectToDiseaseAreas[project.id] ?? [])
                    .map((id) => diseaseNameById[id])
                    .slice(0, 2),
                ])}
                metaLine={formatUpdatedMetadata(project.lastUpdated)}
                href={`/projects/${project.id}`}
              />
              <CompareToggleButton type="project" id={project.id} label={project.projectName} />
            </div>
          ))}
        </section>
      ) : (
        <EmptyStatePanel
          title="No matching projects"
          description="Project coverage is currently sparse. Try clearing filters or broadening your keyword query."
          actionHref="/projects"
          actionLabel="Reset browse controls"
        />
      )}
    </div>
  );
}
