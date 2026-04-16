import Link from "next/link";
import { CompareToggleButton } from "@/components/compare/compare-toggle-button";
import { getExploreTypeLabel } from "@/lib/explore";
import { MetadataChips } from "@/components/ui/metadata-chips";
import type { ExploreResult } from "@/types/domain";

function getTypeBadgeClass(type: ExploreResult["type"]): string {
  if (type === "researcher") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (type === "project") {
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  }
  if (type === "dataset") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (type === "technology") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  return "bg-violet-50 text-violet-700 border-violet-200";
}

export function ExploreResultCard({ result }: { result: ExploreResult }) {
  const compareType =
    result.type === "researcher" || result.type === "dataset" || result.type === "project" ? result.type : null;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <Link
        href={result.href}
        className="block rounded-md hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getTypeBadgeClass(result.type)}`}>
            {getExploreTypeLabel(result.type)}
          </span>
        </div>

        <h2 className="line-clamp-2 break-words text-base font-semibold text-slate-900">{result.title}</h2>
        <p className="mt-2 line-clamp-2 break-words text-sm text-slate-600">{result.summary ?? "No summary available."}</p>

        <MetadataChips items={result.chips} max={4} />
      </Link>
      {compareType ? (
        <CompareToggleButton type={compareType} id={result.id} label={result.title} className="mt-2" />
      ) : null}
    </article>
  );
}
