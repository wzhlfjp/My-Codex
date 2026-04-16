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
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <form method="get" action={action} className="grid gap-3 md:grid-cols-4 md:items-end">
        <label className="md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Keyword</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={queryPlaceholder}
            autoComplete="off"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
          />
        </label>

        <label>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
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
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">{filterLabel}</span>
            <select
              name={filterName}
              defaultValue={filterValue ?? ""}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
            >
              {filterOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Apply
            </button>
          </div>
        )}

        {hasFilter ? (
          <div className="md:col-span-4">
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
            >
              Apply
            </button>
          </div>
        ) : null}
      </form>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-700">
          Showing <span className="font-semibold text-slate-900">{resultCount}</span> records
        </p>
        {activeTokens.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <MetadataChips items={activeTokens.map((token) => token.label)} className="mt-0" max={6} />
            <Link href={clearHref} className="text-xs font-medium text-slate-700 underline hover:text-slate-900">
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
