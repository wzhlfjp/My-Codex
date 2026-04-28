import Link from "next/link";
import { getExploreTypeLabel } from "@/lib/explore";
import { MetadataChips } from "@/components/ui/metadata-chips";
import type { ExploreResult } from "@/types/domain";

function getTypeBadgeClass(type: ExploreResult["type"]): string {
  if (type === "researcher") {
    return "bg-blue-50 text-blue-800 border-blue-200";
  }
  if (type === "project") {
    return "bg-indigo-50 text-indigo-800 border-indigo-200";
  }
  if (type === "dataset") {
    return "bg-teal-50 text-teal-800 border-teal-200";
  }
  if (type === "technology") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  return "bg-cyan-50 text-cyan-800 border-cyan-200";
}

export function ExploreResultCard({ result }: { result: ExploreResult }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <Link
        href={result.href}
        className="block rounded-xl hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getTypeBadgeClass(result.type)}`}>
            {getExploreTypeLabel(result.type)}
          </span>
        </div>

        <h2 className="line-clamp-2 break-words text-base font-semibold text-[#1f3f70]">{result.title}</h2>
        <p className="mt-2 line-clamp-2 break-words text-sm text-slate-600">{result.summary ?? "No summary available."}</p>

        <MetadataChips items={result.chips} max={4} />
      </Link>
    </article>
  );
}
