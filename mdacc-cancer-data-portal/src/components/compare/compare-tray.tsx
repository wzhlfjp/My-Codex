"use client";

import Link from "next/link";
import { useCompare } from "@/components/compare/compare-context";
import { COMPARE_MIN_ITEMS, getCompareTypeLabel } from "@/lib/compare";

export function CompareTray() {
  const { selection, compareUrl, removeItem, clear, maxItems } = useCompare();

  if (!selection.type || selection.items.length === 0) {
    return null;
  }

  const typeLabel = getCompareTypeLabel(selection.type);
  const canCompare = selection.items.length >= COMPARE_MIN_ITEMS && Boolean(compareUrl);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 px-3 sm:bottom-4">
      <div className="pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Compare Tray</p>
            <p className="text-sm text-slate-700">
              {typeLabel}: {selection.items.length}/{maxItems} selected
              {selection.items.length < COMPARE_MIN_ITEMS ? ` (select at least ${COMPARE_MIN_ITEMS})` : ""}.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selection.items.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/60 px-2 py-0.5 text-xs text-blue-900"
                >
                  <span className="max-w-40 truncate" title={item.label}>
                    {item.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded px-1 text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    aria-label={`Remove ${item.label} from compare`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={clear}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Clear
            </button>
            {canCompare && compareUrl ? (
              <Link
                href={compareUrl}
                className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Compare
              </Link>
            ) : (
              <span className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                Compare
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
