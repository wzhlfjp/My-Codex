import Link from "next/link";

export function PlaceholderCard({ title, subtitle, href }: { title: string; subtitle: string; href?: string }) {
  const content = (
    <article className="rounded-lg border border-slate-200 bg-white p-4 transition-colors group-hover:border-slate-300">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      {content}
    </Link>
  );
}
