type DetailSectionNavItem = {
  id: string;
  label: string;
  count?: number;
};

export function DetailSectionNav({
  items,
  minItems = 3,
}: {
  items: DetailSectionNavItem[];
  minItems?: number;
}) {
  const visibleItems = items.filter((item) => item.id.trim().length > 0 && item.label.trim().length > 0);

  if (visibleItems.length < minItems) {
    return null;
  }

  return (
    <nav aria-label="Page sections" className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">On This Page</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {item.label}
              {typeof item.count === "number" ? ` (${item.count})` : ""}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
