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

      <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-4">
          <DataScopeCallout
            contextLine="For this MVP, portal data is generated from local source files and refreshed through the CSV validation/build pipeline."
            snapshot={snapshot}
          />

          {ABOUT_PAGE_CONTENT.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">{section.heading}</h2>
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

        <aside className="space-y-4 xl:sticky xl:top-6 xl:h-fit">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Build Transparency</h2>
            <ValidationSummary
              buildMetadata={buildMetadata}
              validationReport={validationReport}
              variant="compact"
              showStatusLink={true}
            />
            <p className="mt-2 text-sm text-slate-700">
              For a detailed build and validation snapshot, visit{" "}
              <Link href="/status" className="font-medium text-blue-800 underline hover:text-blue-700">
                Portal Status
              </Link>
              .
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Quick Next Steps</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Link href="/explore" className="font-medium text-blue-800 underline hover:text-blue-700">
                  Start in Explore
                </Link>{" "}
                for mixed-entity discovery.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Link href="/researchers" className="font-medium text-blue-800 underline hover:text-blue-700">
                  Browse Researchers
                </Link>{" "}
                and follow related datasets/technologies.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Link href="/datasets" className="font-medium text-blue-800 underline hover:text-blue-700">
                  Browse Datasets
                </Link>{" "}
                by disease context and recency.
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Link href="/status" className="font-medium text-blue-800 underline hover:text-blue-700">
                  Review Portal Status
                </Link>{" "}
                for build and validation health.
              </li>
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
