import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { EmptyStatePanel } from "@/components/ui/empty-state-panel";
import { PageHeader } from "@/components/ui/page-header";
import { ValidationSummary } from "@/components/ui/validation-summary";
import { getBuildMetadata, getPortalSnapshot, getValidationReport } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildRouteMetadata({
  title: "Portal Status",
  description:
    "Operational build and validation summary for local processed portal data, including file-level warning/error counts.",
  path: "/status",
  keywords: ["portal status", "data health", "validation", "build metadata", "md anderson cancer data portal"],
});

export default async function StatusPage() {
  const [snapshot, buildMetadata, validationReport] = await Promise.all([
    getPortalSnapshot(),
    getBuildMetadata(),
    getValidationReport(),
  ]);

  const hasArtifacts = Boolean(buildMetadata || validationReport);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Portal Status" }]} />

      <PageHeader
        title="Portal Status"
        description="A lightweight operational snapshot of the current local data build and validation state."
      />

      <DataScopeCallout
        contextLine="This page summarizes local build and validation artifacts to support contributor review and transparent stewardship."
        snapshot={snapshot}
      />

      {hasArtifacts ? (
        <ValidationSummary
          buildMetadata={buildMetadata}
          validationReport={validationReport}
          variant="full"
          showIssueDetails={true}
          maxFiles={10}
        />
      ) : (
        <EmptyStatePanel
          title="No status artifacts available yet"
          description="Build metadata and validation report files were not found. Run data validation or data build commands to generate them."
          actionHref="/about"
          actionLabel="Read data stewardship notes"
        />
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Next Actions</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>
            Use{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-800">
              npm run data:preflight
            </code>{" "}
            for a quick local validation summary before PR review.
          </li>
          <li>
            Use{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-800">
              npm run verify
            </code>{" "}
            before release or deployment checks.
          </li>
          <li>
            For scope and interpretation guidance, see{" "}
            <Link href="/about" className="underline hover:text-slate-900">
              About
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
