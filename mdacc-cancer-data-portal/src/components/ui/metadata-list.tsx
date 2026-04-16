import type { ReactNode } from "react";
import { hasDisplayValue } from "@/lib/detail-format";

type MetadataItem = {
  label: string;
  value: ReactNode;
};

export function MetadataList({
  id,
  title,
  description,
  items,
}: {
  id?: string;
  title: string;
  description?: string;
  items: MetadataItem[];
}) {
  const visibleItems = items.filter((item) => hasDisplayValue(item.value));

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section id={id} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h2>
      {description ? <p className="mt-1 text-xs text-slate-600">{description}</p> : null}
      <dl className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        {visibleItems.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="break-words font-medium text-slate-900">{item.label}</dt>
            <dd className="break-words">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
