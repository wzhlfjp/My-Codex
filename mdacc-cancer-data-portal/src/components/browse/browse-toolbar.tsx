import Link from "next/link";
import { MetadataChips } from "@/components/ui/metadata-chips";

type SelectOption = {
  value: string;
  label: string;
};

type ActiveToken = {
  key: string;
  label: string;
};

export function BrowseToolbar({
  action,
  query,
  queryPlaceholder,
  sort,
  sortOptions,
  filterName,
  filterLabel,
  filterValue,
  filterOptions,
  resultCount,
  activeTokens,
  clearHref,
}: {
  action: string;
  query: string;
  queryPlaceholder: string;
  sort: string;
  sortOptions: SelectOption[];
  filterName?: string;
  filterLabel?: string;
  filterValue?: string;
  filterOptions?: SelectOption[];
  resultCount: number;
  activeTokens: ActiveToken[];
  clearHref: string;
}) {
  const hasFilter = Boolean(filterName && filterLabel && filterOptions && filterOptions.length > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <form method="get" action={action} className="grid gap-3 md:grid-cols-4 md:items-end">
        <label className="md:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-600">Keyword</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={queryPlaceholder}
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:border-blue-200 focus:bg-white focus:ring"
          />
        </label>

        <label>
          <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-600">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:border-blue-200 focus:bg-white focus:ring"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasFilter ? (
          <label>
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-600">{filterLabel}</span>
            <select
              name={filterName}
              defaultValue={filterValue ?? ""}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:border-blue-200 focus:bg-white focus:ring"
            >
              {filterOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:col-span-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
          >
            Apply
          </button>
          <Link
            href={clearHref}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-700">
          Showing <span className="font-semibold text-[#1f3f70]">{resultCount}</span> records
        </p>
        {activeTokens.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <MetadataChips items={activeTokens.map((token) => token.label)} className="mt-0" max={6} />
            <Link href={clearHref} className="text-xs font-semibold text-blue-800 underline hover:text-blue-700">
              Clear all
            </Link>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No active filters</p>
        )}
      </div>
    </section>
  );
}
