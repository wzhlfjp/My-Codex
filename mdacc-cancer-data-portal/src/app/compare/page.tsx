import type { Metadata } from "next";
import Link from "next/link";
import { ShareExportActions } from "@/components/actions/share-export-actions";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import {
  buildCompareCards,
  COMPARE_MAX_ITEMS,
  COMPARE_MIN_ITEMS,
  getCompareTypeLabel,
  parseCompareEntityType,
  parseCompareIds,
} from "@/lib/compare";
import { getPortalData } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";
import type { CompareEntityType } from "@/types/domain";

type CompareQuery = {
  type?: string | string[];
  ids?: string | string[];
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Compare",
  description:
    "Temporarily shortlist and compare researchers, datasets, projects, technologies, or disease areas side by side.",
  path: "/compare",
  keywords: ["compare", "shortlist", "researchers", "datasets", "projects", "technologies", "disease areas"],
});

function normalizeSingleValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

function getBrowseHrefForCompareType(type: CompareEntityType): string {
  if (type === "researcher") {
    return "/researchers";
  }
  if (type === "dataset") {
    return "/datasets";
  }
  if (type === "project") {
    return "/projects";
  }
  if (type === "technology") {
    return "/technologies";
  }
  return "/disease-areas";
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<CompareQuery> }) {
  const params = await searchParams;
  const rawType = normalizeSingleValue(params.type);
  const rawIds = normalizeSingleValue(params.ids);
  const type = parseCompareEntityType(rawType);
  const ids = parseCompareIds(rawIds, COMPARE_MAX_ITEMS);

  if (!type) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
        <EmptyStatePanel
          title="Choose an entity type to compare"
          description="Compare supports all core entity types. Add items from list pages, Explore, or detail pages."
          actionHref="/explore"
          actionLabel="Go to Explore"
        />
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
        <EmptyStatePanel
          title={`No ${getCompareTypeLabel(type).toLowerCase()} selected`}
          description="Add at least two items to compare from list pages, Explore, or detail pages."
          actionHref={getBrowseHrefForCompareType(type)}
          actionLabel={`Browse ${getCompareTypeLabel(type)}`}
        />
      </div>
    );
  }

  const portalData = await getPortalData();
  const { cards, missingIds } = buildCompareCards(type, ids, portalData);

  if (cards.length < COMPARE_MIN_ITEMS) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
        <EmptyStatePanel
          title="Select at least two valid records"
          description="Some compared IDs may be missing or unavailable in current seed data. Add more items to continue."
          actionHref={getBrowseHrefForCompareType(type)}
          actionLabel={`Browse ${getCompareTypeLabel(type)}`}
        />
      </div>
    );
  }

  const compareExportPayload = {
    entityType: type,
    comparedIds: cards.map((card) => card.id),
    comparedRecords: cards.map((card) => ({
      id: card.id,
      title: card.title,
      href: card.href,
      subtitle: card.subtitle,
      chips: card.chips,
      fields: card.fields,
    })),
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />

      <PageHeader
        title={`Compare ${getCompareTypeLabel(type)}`}
        description={`Side-by-side comparison for ${cards.length} selected ${getCompareTypeLabel(type).toLowerCase()}.`}
      />

      {missingIds.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {missingIds.length} item(s) from the URL were not found in current data and were skipped.
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Compare Summary</p>
                <p className="mt-1 text-sm text-slate-700">
                  {cards.length} {getCompareTypeLabel(type).toLowerCase()} selected for side-by-side review.
                </p>
              </div>
              <ShareExportActions
                fileStem={`compare-${type}`}
                showCsv={false}
                jsonData={compareExportPayload}
                className="md:items-end"
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article key={card.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-[#1f3f70]">
                    <Link href={card.href} className="underline-offset-2 hover:underline">
                      {card.title}
                    </Link>
                  </h2>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{card.subtitle ?? "No summary available."}</p>
                <MetadataChips items={card.chips} max={4} />

                <dl className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
                  {card.fields.map((field) => (
                    <div key={`${card.id}-${field.label}`}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{field.label}</dt>
                      <dd className="mt-0.5 text-slate-700">{field.value}</dd>
                    </div>
                  ))}
                </dl>

                <CompareToggleButton
                  type={type}
                  id={card.id}
                  label={card.title}
                  className="mt-3"
                />
              </article>
            ))}
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">How To Use Compare</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                Keep selected records within one entity type for a clean side-by-side review.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                Use row links to open full detail pages when deeper context is needed.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                Export JSON to share shortlists with collaborators.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Quick Browse</h2>
            <div className="mt-3 grid gap-2">
              <Link href="/researchers" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-blue-200">
                Researchers
              </Link>
              <Link href="/datasets" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-blue-200">
                Datasets
              </Link>
              <Link href="/projects" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-blue-200">
                Projects
              </Link>
              <Link href="/technologies" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-blue-200">
                Technologies
              </Link>
              <Link href="/disease-areas" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-blue-200">
                Disease Areas
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
