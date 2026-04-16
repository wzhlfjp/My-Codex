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

type CompareQuery = {
  type?: string | string[];
  ids?: string | string[];
};

export const metadata: Metadata = buildRouteMetadata({
  title: "Compare",
  description: "Temporarily shortlist and compare researchers, datasets, or projects side by side.",
  path: "/compare",
  keywords: ["compare", "shortlist", "researchers", "datasets", "projects"],
});

function normalizeSingleValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
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
          description="Compare supports researchers, datasets, and projects. Add items from list pages, Explore, or detail pages."
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
          actionHref={type === "researcher" ? "/researchers" : type === "dataset" ? "/datasets" : "/projects"}
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
          actionHref={type === "researcher" ? "/researchers" : type === "dataset" ? "/datasets" : "/projects"}
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
        actions={
          <ShareExportActions
            fileStem={`compare-${type}`}
            showCsv={false}
            jsonData={compareExportPayload}
            className="md:items-end"
          />
        }
      />

      {missingIds.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {missingIds.length} item(s) from the URL were not found in current data and were skipped.
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
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
  );
}
