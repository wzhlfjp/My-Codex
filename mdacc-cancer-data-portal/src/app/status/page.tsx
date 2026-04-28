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

      <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-4">
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
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Next Actions</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-700">
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                Use{" "}
                <code className="rounded bg-white px-1 py-0.5 text-xs text-slate-800">
                  npm run data:preflight
                </code>{" "}
                for a quick local validation summary before PR review.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                Use{" "}
                <code className="rounded bg-white px-1 py-0.5 text-xs text-slate-800">
                  npm run verify
                </code>{" "}
                before release or deployment checks.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                For scope and interpretation guidance, see{" "}
                <Link href="/about" className="font-medium text-blue-800 underline hover:text-blue-700">
                  About
                </Link>
                .
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Release Checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>1. Refresh source CSV files and rebuild processed artifacts.</li>
              <li>2. Confirm validation status is not failed.</li>
              <li>3. Run test, lint, and build checks.</li>
              <li>4. Spot-check Explore, dashboard, list/detail, and status routes.</li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
