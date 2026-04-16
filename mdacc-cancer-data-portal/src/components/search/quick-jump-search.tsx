import type { ExploreEntityType } from "@/types/domain";

const TYPE_OPTIONS: Array<{ value: ExploreEntityType; label: string }> = [
  { value: "all", label: "All Types" },
  { value: "researcher", label: "Researchers" },
  { value: "project", label: "Projects" },
  { value: "dataset", label: "Datasets" },
  { value: "technology", label: "Technologies" },
  { value: "disease-area", label: "Disease Areas" },
];

export function QuickJumpSearch({
  title,
  description,
  defaultQuery = "",
  defaultType = "all",
  showTypeSelector = true,
  submitLabel = "Search",
}: {
  title?: string;
  description?: string;
  defaultQuery?: string;
  defaultType?: ExploreEntityType;
  showTypeSelector?: boolean;
  submitLabel?: string;
}) {
  const queryInputId = "quick-jump-query";
  const typeSelectId = "quick-jump-type";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      {title ? <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h2> : null}
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}

      <form method="get" action="/explore" aria-label="Quick jump to explore" className="mt-4 grid gap-3 md:grid-cols-4 md:items-end">
        <label htmlFor={queryInputId} className="flex flex-col gap-2 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Search</span>
          <input
            id={queryInputId}
            type="search"
            name="q"
            defaultValue={defaultQuery}
            placeholder="Try breast cancer, MRI, project, or investigator name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
          />
        </label>

        {showTypeSelector ? (
          <label htmlFor={typeSelectId} className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">Entity Type</span>
            <select
              id={typeSelectId}
              name="type"
              defaultValue={defaultType}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-slate-300 focus:ring"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <input type="hidden" name="type" value={defaultType} />
        )}

        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
