import Link from "next/link";
import { MetadataChips } from "@/components/ui/metadata-chips";

type RelatedItem = {
  id: string;
  label: string;
  href?: string;
  description?: string;
};

export function RelatedEntitiesPanel({
  id,
  title,
  description,
  summaryLine,
  browseHref,
  browseLabel,
  emptyLabel,
  items,
}: {
  id?: string;
  title: string;
  description?: string;
  summaryLine?: string;
  browseHref?: string;
  browseLabel?: string;
  emptyLabel: string;
  items: RelatedItem[];
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">{title}</h2>
          {description ? <p className="mt-1 text-xs text-slate-600">{description}</p> : null}
        </div>
        <span className="rounded-full border border-blue-100 bg-blue-50/70 px-2.5 py-1 text-xs font-medium text-blue-900">{items.length}</span>
      </div>
      {summaryLine || (browseHref && items.length > 0) ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {summaryLine ? <p className="text-xs text-slate-600">{summaryLine}</p> : null}
          {browseHref && items.length > 0 ? (
            <Link href={browseHref} className="text-xs font-medium text-slate-700 underline hover:text-slate-900">
              {browseLabel ?? "Browse all related"}
            </Link>
          ) : null}
        </div>
      ) : null}
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={`${item.id}-${item.label}`}>
              {item.href ? (
                <Link href={item.href} className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:border-blue-200 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                  <p className="line-clamp-2 break-words text-sm font-medium text-slate-900">{item.label}</p>
                  {item.description ? <MetadataChips items={[item.description]} max={1} className="mt-1" /> : null}
                </Link>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="line-clamp-2 break-words text-sm font-medium text-slate-900">{item.label}</p>
                  {item.description ? <MetadataChips items={[item.description]} max={1} className="mt-1" /> : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
