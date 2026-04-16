import Link from "next/link";
import type { ExploreEntityType } from "@/types/domain";

const TYPE_OPTIONS: Array<{ value: ExploreEntityType; label: string }> = [
  { value: "all", label: "All Types" },
  { value: "researcher", label: "Researchers" },
  { value: "project", label: "Projects" },
  { value: "dataset", label: "Datasets" },
  { value: "technology", label: "Technologies" },
  { value: "disease-area", label: "Disease Areas" },
];

export function ExploreFilters({
  query,
  selectedType,
  selectedDisease,
  diseaseOptions,
}: {
  query: string;
  selectedType: ExploreEntityType;
  selectedDisease: string;
  diseaseOptions: Array<{ id: string; name: string }>;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <form method="get" action="/explore" className="grid gap-4 md:grid-cols-4 md:items-end">
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Keyword</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search people, projects, datasets, technologies, or disease areas"
            autoComplete="off"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Entity Type</span>
          <select
            name="type"
            defaultValue={selectedType}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Disease Area</span>
          <select
            name="disease"
            defaultValue={selectedDisease}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
          >
            <option value="">All Disease Areas</option>
            {diseaseOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:col-span-4">
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
          >
            Apply
          </button>
          <Link
            href="/explore"
            className="w-full rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
          >
            Reset
          </Link>
        </div>
      </form>
    </section>
  );
}
