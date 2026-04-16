import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DataScopeCallout } from "@/components/ui/data-scope-callout";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ValidationSummary } from "@/components/ui/validation-summary";
import { ABOUT_PAGE_CONTENT } from "@/content/about";
import { getBuildMetadata, getPortalSnapshot, getValidationReport } from "@/lib/data/processed-data";
import { buildRouteMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildRouteMetadata({
  title: "About",
  description:
    "Learn the purpose, scope, stewardship model, and current build transparency for the MD Anderson Cancer Data Portal.",
  path: "/about",
  keywords: ["about", "scope", "stewardship", "build transparency", "md anderson cancer data portal"],
});

export default async function AboutPage() {
  const [snapshot, buildMetadata, validationReport] = await Promise.all([
    getPortalSnapshot(),
    getBuildMetadata(),
    getValidationReport(),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <PageHeader title={ABOUT_PAGE_CONTENT.title} description={ABOUT_PAGE_CONTENT.intro} />

      <DataScopeCallout
        contextLine="For this MVP, portal data is generated from local source files and refreshed through the CSV validation/build pipeline."
        snapshot={snapshot}
      />

      <ValidationSummary
        buildMetadata={buildMetadata}
        validationReport={validationReport}
        variant="compact"
        showStatusLink={true}
      />

      <p className="text-sm text-slate-700">
        For a detailed build and validation snapshot, visit{" "}
        <Link href="/status" className="underline hover:text-slate-900">
          Portal Status
        </Link>
        .
      </p>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Quick Next Steps</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <li>
            <Link href="/explore" className="underline hover:text-slate-900">
              Start in Explore
            </Link>{" "}
            for mixed-entity discovery.
          </li>
          <li>
            <Link href="/researchers" className="underline hover:text-slate-900">
              Browse Researchers
            </Link>{" "}
            and follow related datasets/technologies.
          </li>
          <li>
            <Link href="/datasets" className="underline hover:text-slate-900">
              Browse Datasets
            </Link>{" "}
            by disease context and recency.
          </li>
          <li>
            <Link href="/status" className="underline hover:text-slate-900">
              Review Portal Status
            </Link>{" "}
            for build and validation health.
          </li>
        </ul>
      </section>

      {ABOUT_PAGE_CONTENT.sections.map((section) => (
        <section key={section.heading} className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{section.heading}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {section.points.map((point) => (
              <li key={point} className="leading-6">
                {point}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
