import Link from "next/link";
import { MetadataChips } from "@/components/ui/metadata-chips";

type RecommendationPanelItem = {
  id: string;
  label: string;
  href: string;
  reason: string;
  subtitle?: string;
  chips?: string[];
};

export function RecommendationPanel({
  id,
  title,
  description,
  items,
  browseHref,
  browseLabel,
  emptyLabel,
}: {
  id?: string;
  title: string;
  description?: string;
  items: RecommendationPanelItem[];
  browseHref?: string;
  browseLabel?: string;
  emptyLabel: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h2>
          {description ? <p className="mt-1 text-xs text-slate-600">{description}</p> : null}
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
          {items.length}
        </span>
      </div>

      {browseHref && browseLabel ? (
        <p className="mt-2 text-xs text-slate-600">
          <Link href={browseHref} className="font-medium text-slate-700 underline hover:text-slate-900">
            {browseLabel}
          </Link>
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block rounded-md border border-slate-200 px-3 py-2 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <p className="line-clamp-2 break-words text-sm font-medium text-slate-900">{item.label}</p>
                {item.subtitle ? <p className="mt-1 line-clamp-2 break-words text-xs text-slate-600">{item.subtitle}</p> : null}
                <p className="mt-1 text-xs text-slate-700">{item.reason}</p>
                {item.chips && item.chips.length > 0 ? <MetadataChips items={item.chips} max={2} className="mt-2" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

