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
    <nav aria-label="Page sections" className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Sections</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-900 hover:border-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
