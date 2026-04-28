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
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">{title}</h2>
      {description ? <p className="mt-1 text-xs text-slate-600">{description}</p> : null}
      <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <dt className="break-words text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</dt>
            <dd className="mt-1 break-words font-medium text-slate-800">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
