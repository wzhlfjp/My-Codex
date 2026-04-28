import Link from "next/link";

type Snapshot = {
  researcherCount: number;
  projectCount?: number;
  datasetCount: number;
  technologyCount: number;
  diseaseAreaCount: number;
  buildGeneratedAt?: string;
  latestSourceUpdateDate?: string;
  validationStatus?: "passed" | "passed_with_warnings";
  latestUpdate?: string;
};

export function DataScopeCallout({
  contextLine,
  snapshot,
  variant = "default",
}: {
  contextLine?: string;
  snapshot?: Snapshot;
  variant?: "default" | "compact";
}) {
  const isCompact = variant === "compact";

  return (
    <section className={isCompact ? "rounded-xl border border-blue-100 bg-blue-50/60 p-3" : "rounded-2xl border border-blue-100 bg-blue-50/60 p-4"}>
      <p className={isCompact ? "text-xs font-semibold uppercase tracking-wide text-blue-900" : "text-sm font-semibold uppercase tracking-wide text-blue-900"}>
        About This Data
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        This portal provides an evolving discovery view and should be used as a starting point for finding relevant people,
        projects, datasets, technologies, and disease areas.
      </p>
      {contextLine ? <p className="mt-2 text-sm text-slate-600">{contextLine}</p> : null}

      {snapshot ? (
        <p className="mt-2 text-xs text-slate-600">
          Snapshot: {snapshot.researcherCount} researchers
          {typeof snapshot.projectCount === "number" ? `, ${snapshot.projectCount} projects` : ""}
          , {snapshot.datasetCount} datasets, {snapshot.technologyCount} technologies,
          {" "}
          {snapshot.diseaseAreaCount} disease areas
          {snapshot.latestSourceUpdateDate ? ` (latest source update ${snapshot.latestSourceUpdateDate})` : ""}
          {snapshot.buildGeneratedAt ? `; built ${snapshot.buildGeneratedAt.slice(0, 10)}` : ""}
          {snapshot.validationStatus === "passed_with_warnings" ? "; validation passed with warnings" : ""}.
        </p>
      ) : null}

      <p className="mt-2 text-sm text-slate-700">
        For scope, stewardship, and limitations, see{" "}
        <Link href="/about" className="underline hover:text-slate-900">
          About
        </Link>
        .
      </p>
    </section>
  );
}
