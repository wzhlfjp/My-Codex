import type { Metadata } from "next";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import { getPortalSnapshot } from "@/lib/data/processed-data";
import { getHealthStatusPresentation } from "@/lib/data-health";
import { getDashboardData } from "@/lib/dashboard";
import { buildRouteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildRouteMetadata({
  title: "Dashboard",
  description:
    "Portfolio-level coverage and relationship summary across researchers, datasets, technologies, disease areas, and projects.",
  path: "/dashboard",
  keywords: ["dashboard", "catalog coverage", "disease technology", "research discovery"],
});

const MAX_DISEASE_COVERAGE_ROWS = 8;
const MAX_HEATMAP_ROWS = 8;
const MAX_HEATMAP_COLUMNS = 8;
const MAX_COMBINATION_ROWS = 12;
const MAX_CONNECTED_RESEARCHERS = 10;
const MAX_MULTIMODAL_ROWS = 10;

function formatTimestamp(value?: string): string {
  if (!value) {
    return "Not available";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function percentOf(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, (value / max) * 100));
}

function getHeatCellClass(value: number, max: number): string {
  if (value <= 0 || max <= 0) {
    return "bg-slate-50 text-slate-400";
  }

  const ratio = value / max;
  if (ratio >= 0.8) {
    return "bg-blue-700 text-white";
  }
  if (ratio >= 0.55) {
    return "bg-blue-600 text-white";
  }
  if (ratio >= 0.35) {
    return "bg-blue-200 text-blue-900";
  }
  if (ratio >= 0.2) {
    return "bg-blue-100 text-blue-800";
  }
  return "bg-slate-100 text-slate-700";
}

export default async function DashboardPage() {
  const [dashboard, snapshot] = await Promise.all([getDashboardData(), getPortalSnapshot()]);
  const statusPresentation = getHealthStatusPresentation(dashboard.dataFreshness.validationStatus);
  const diseaseByResearchers = dashboard.diseaseAreasByResearcherLinks.slice(0, MAX_DISEASE_COVERAGE_ROWS);
  const diseaseByDatasets = dashboard.diseaseAreasByDatasetLinks.slice(0, MAX_DISEASE_COVERAGE_ROWS);
  const topDiseaseResearcherCount = diseaseByResearchers[0]?.count ?? 0;
  const topDiseaseDatasetCount = diseaseByDatasets[0]?.count ?? 0;
  const topTechnologyCategoryCount = dashboard.technologyCategoryDistribution[0]?.count ?? 0;
  const topTechnologyCategories = dashboard.technologyCategoryDistribution.slice(0, MAX_HEATMAP_COLUMNS);

  const heatmapRows = dashboard.diseaseTechnologyMatrix.rows.slice(0, MAX_HEATMAP_ROWS).map((row) => ({
    ...row,
    countsByCategory: Object.fromEntries(
      topTechnologyCategories.map((category) => [category.category, row.countsByCategory[category.category] ?? 0]),
    ) as Record<string, number>,
  }));
  const maxHeatValue = Math.max(
    0,
    ...heatmapRows.flatMap((row) => Object.values(row.countsByCategory)),
  );
  const matrixIsTrimmed =
    dashboard.diseaseTechnologyMatrix.rows.length > heatmapRows.length ||
    dashboard.technologyCategoryDistribution.length > topTechnologyCategories.length;

  const dashboardExportPayload = {
    route: "/dashboard",
    generatedAt: dashboard.dataFreshness.generatedAt,
    dashboard,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Portal-wide discovery and catalog-coverage dashboard built from local processed records and relationship maps."
        actions={
          <ShareExportActions
            fileStem="dashboard-summary"
            showCsv={false}
            jsonData={dashboardExportPayload}
            className="md:items-end"
          />
        }
      />

      <DataScopeCallout
        variant="compact"
        contextLine="This view reflects current portal seed records, coverage is still evolving, and displayed metrics are catalog/discovery summaries rather than clinical performance outcomes."
        snapshot={snapshot}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Portal Snapshot</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Researchers</p>
            <p className="mt-1 text-2xl font-semibold text-[#1f3f70]">{dashboard.coverage.researchers}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Datasets</p>
            <p className="mt-1 text-2xl font-semibold text-[#1f3f70]">{dashboard.coverage.datasets}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Technologies</p>
            <p className="mt-1 text-2xl font-semibold text-[#1f3f70]">{dashboard.coverage.technologies}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Disease Areas</p>
            <p className="mt-1 text-2xl font-semibold text-[#1f3f70]">{dashboard.coverage.diseaseAreas}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Projects</p>
            <p className="mt-1 text-2xl font-semibold text-[#1f3f70]">{dashboard.coverage.projects}</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Total Catalog Records</p>
            <p className="mt-1 text-2xl font-semibold text-blue-900">{dashboard.coverage.total}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Build and Validation</p>
            <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", statusPresentation.badgeClassName].join(" ")}>
              {statusPresentation.label}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-700">
            Build: {formatTimestamp(dashboard.dataFreshness.generatedAt)} | Warnings: {dashboard.dataFreshness.warningCount} | Source files: {dashboard.dataFreshness.sourceFileCount}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Disease Areas With Most Linked Researchers</h2>
          {diseaseByResearchers.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {diseaseByResearchers.map((item) => (
                <li key={`researchers-${item.diseaseAreaId}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/disease-areas/${item.diseaseAreaId}`} className="text-sm font-medium text-slate-900 underline-offset-2 hover:underline">
                      {item.diseaseAreaName}
                    </Link>
                    <span className="text-sm font-semibold text-[#1f3f70]">{item.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${percentOf(item.count, topDiseaseResearcherCount)}%` }}
                    />
                  </div>
                  <div className="mt-1">
                    <Link href={`/researchers?disease=${item.diseaseAreaId}`} className="text-xs font-medium text-blue-800 underline hover:text-blue-700">
                      Open linked researchers
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyStatePanel
              title="No disease linkage data"
              description="Disease-to-researcher links are not available in the current processed snapshot."
              actionHref="/status"
              actionLabel="View data status"
            />
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Disease Areas With Most Linked Datasets</h2>
          {diseaseByDatasets.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {diseaseByDatasets.map((item) => (
                <li key={`datasets-${item.diseaseAreaId}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={`/disease-areas/${item.diseaseAreaId}`} className="text-sm font-medium text-slate-900 underline-offset-2 hover:underline">
                      {item.diseaseAreaName}
                    </Link>
                    <span className="text-sm font-semibold text-[#1f3f70]">{item.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${percentOf(item.count, topDiseaseDatasetCount)}%` }}
                    />
                  </div>
                  <div className="mt-1">
                    <Link href={`/datasets?disease=${item.diseaseAreaId}`} className="text-xs font-medium text-blue-800 underline hover:text-blue-700">
                      Open linked datasets
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyStatePanel
              title="No dataset linkage data"
              description="Disease-to-dataset links are not available in the current processed snapshot."
              actionHref="/status"
              actionLabel="View data status"
            />
          )}
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1.5fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Most Represented Technology Categories</h2>
          {dashboard.technologyCategoryDistribution.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {dashboard.technologyCategoryDistribution.map((item) => (
                <li key={item.category} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-900">{item.category}</span>
                    <span className="text-sm font-semibold text-[#1f3f70]">{item.count}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${percentOf(item.count, topTechnologyCategoryCount)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyStatePanel
              title="No technology category data"
              description="Technology categories are not available in the current processed snapshot."
              actionHref="/technologies"
              actionLabel="Browse technologies"
            />
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Broadest Multimodal Disease Coverage</h2>
          <p className="mt-2 text-xs text-slate-600">
            Coverage score is a simple additive value: researchers + datasets + technologies + technology categories.
          </p>
          {dashboard.multimodalDiseaseCoverage.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Disease Area</th>
                    <th className="px-3 py-2 text-right">Researchers</th>
                    <th className="px-3 py-2 text-right">Datasets</th>
                    <th className="px-3 py-2 text-right">Technologies</th>
                    <th className="px-3 py-2 text-right">Categories</th>
                    <th className="px-3 py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard.multimodalDiseaseCoverage.slice(0, MAX_MULTIMODAL_ROWS).map((row) => (
                    <tr key={row.diseaseAreaId}>
                      <td className="px-3 py-2">
                        <Link href={`/disease-areas/${row.diseaseAreaId}`} className="font-medium text-slate-900 underline-offset-2 hover:underline">
                          {row.diseaseAreaName}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.researcherCount}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.datasetCount}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.technologyCount}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.technologyCategoryCount}</td>
                      <td className="px-3 py-2 text-right font-semibold text-[#1f3f70]">{row.coverageScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStatePanel
              title="No multimodal coverage rows"
              description="Coverage scoring needs at least one disease area with linked catalog entities."
              actionHref="/disease-areas"
              actionLabel="Browse disease areas"
            />
          )}
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Disease-Technology Heatmap</h2>
          <p className="mt-2 text-xs text-slate-600">
            Compact matrix of linked counts by disease area (rows) and technology category (columns).
          </p>
          {heatmapRows.length > 0 && topTechnologyCategories.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-[0.1em] text-slate-500">
                  <tr>
                    <th className="sticky left-0 bg-[var(--surface-muted)] px-2 py-2 text-left">Disease Area</th>
                    {topTechnologyCategories.map((category) => (
                      <th key={category.category} className="px-2 py-2 text-center">
                        {category.category}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {heatmapRows.map((row) => (
                    <tr key={row.diseaseAreaId}>
                      <td className="sticky left-0 bg-white px-2 py-2">
                        <Link href={`/disease-areas/${row.diseaseAreaId}`} className="font-medium text-slate-900 underline-offset-2 hover:underline">
                          {row.diseaseAreaName}
                        </Link>
                      </td>
                      {topTechnologyCategories.map((category) => {
                        const value = row.countsByCategory[category.category] ?? 0;
                        return (
                          <td key={`${row.diseaseAreaId}-${category.category}`} className="px-2 py-2">
                            <div className={["rounded px-1.5 py-1 text-center font-semibold", getHeatCellClass(value, maxHeatValue)].join(" ")}>
                              {value}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStatePanel
              title="No disease-technology matrix data"
              description="Disease-technology links are sparse in the current snapshot."
              actionHref="/explore?type=technology"
              actionLabel="Open technology exploration"
            />
          )}

          <div className="mt-3">
            {matrixIsTrimmed ? (
              <p className="text-xs text-slate-600">
                Display is compact: showing top {heatmapRows.length} disease areas and top {topTechnologyCategories.length} categories.
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Showing all currently available disease areas and technology categories.
              </p>
            )}
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Most Common Combination</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboard.diseaseTechnologyMatrix.combinations.slice(0, MAX_COMBINATION_ROWS).map((row) => (
                  <tr key={`${row.diseaseAreaId}-${row.technologyCategory}`}>
                    <td className="px-3 py-2 text-slate-900">{row.diseaseAreaName}</td>
                    <td className="px-3 py-2 text-slate-700">{row.technologyCategory}</td>
                    <td className="px-3 py-2 text-right font-semibold text-[#1f3f70]">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Most Connected Researchers</h2>
          {dashboard.connectedResearchers.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--surface-muted)] text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Researcher</th>
                    <th className="px-3 py-2 text-right">Disease</th>
                    <th className="px-3 py-2 text-right">Datasets</th>
                    <th className="px-3 py-2 text-right">Tech</th>
                    <th className="px-3 py-2 text-right">Projects</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard.connectedResearchers.slice(0, MAX_CONNECTED_RESEARCHERS).map((row) => (
                    <tr key={row.researcherId}>
                      <td className="px-3 py-2">
                        <Link href={`/researchers/${row.researcherId}`} className="font-medium text-slate-900 underline-offset-2 hover:underline">
                          {row.researcherName}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.diseaseAreaCount}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.datasetCount}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.technologyCount}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{row.projectCount}</td>
                      <td className="px-3 py-2 text-right font-semibold text-[#1f3f70]">{row.totalConnectionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStatePanel
              title="No connected-researcher rankings"
              description="Researcher relationship mappings are not available in the current processed snapshot."
              actionHref="/researchers"
              actionLabel="Browse researchers"
            />
          )}
        </section>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Data Freshness and Trust</h2>
          <Link href="/status" className="text-xs font-semibold text-blue-800 underline hover:text-blue-700">
            Open full portal status
          </Link>
        </div>
        <div className="mt-2">
          <MetadataChips
            className="mt-0"
            max={4}
            items={[
              `Validation: ${dashboard.dataFreshness.validationStatus}`,
              `Warnings: ${dashboard.dataFreshness.warningCount}`,
              `Source files: ${dashboard.dataFreshness.sourceFileCount}`,
            ]}
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Build Generated</p>
            <p className="mt-1 text-sm text-slate-800">{formatTimestamp(dashboard.dataFreshness.generatedAt)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Validation Generated</p>
            <p className="mt-1 text-sm text-slate-800">{formatTimestamp(dashboard.dataFreshness.validationGeneratedAt)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest Source Update</p>
            <p className="mt-1 text-sm text-slate-800">{dashboard.dataFreshness.latestSourceUpdateDate ?? "Not available"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Validation Status</p>
            <p className="mt-1 text-sm text-slate-800">{dashboard.dataFreshness.validationStatus}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Warning Count</p>
            <p className="mt-1 text-sm text-slate-800">{dashboard.dataFreshness.warningCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source Files Scanned</p>
            <p className="mt-1 text-sm text-slate-800">{dashboard.dataFreshness.sourceFileCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Validation Row Count</p>
            <p className="mt-1 text-sm text-slate-800">{dashboard.dataFreshness.rowCount ?? "Not available"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Normalization Substitutions</p>
            <p className="mt-1 text-sm text-slate-800">{dashboard.dataFreshness.normalizationSubstitutionCount ?? 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
