import Link from "next/link";
import { MetadataChips } from "@/components/ui/metadata-chips";

export function EntityListCard({
  title,
  subtitle,
  href,
  metadata = [],
  metaLine,
}: {
  title: string;
  subtitle: string;
  href?: string;
  metadata?: string[];
  metaLine?: string;
}) {
  const content = (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors group-hover:border-blue-200 group-hover:bg-blue-50/20">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <h3 className="min-w-0 flex-1 break-words text-base font-semibold text-[#1f3f70]">{title}</h3>
        {metaLine ? (
          <p className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-left text-[11px] text-slate-600 sm:whitespace-nowrap sm:text-right" title={metaLine}>
            {metaLine}
          </p>
        ) : null}
      </div>

      <p className="mt-2 line-clamp-2 break-words text-sm text-slate-600">{subtitle}</p>
      <MetadataChips items={metadata} max={4} />
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      {content}
    </Link>
  );
}
