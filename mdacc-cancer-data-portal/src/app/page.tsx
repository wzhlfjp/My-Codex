import type { Metadata } from "next";
import Link from "next/link";
import { QuickJumpSearch } from "@/components/search/quick-jump-search";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { PageHeader } from "@/components/ui/page-header";
import { ValidationSummary } from "@/components/ui/validation-summary";
import { EXAMPLE_QUESTION_PROMPTS, START_HERE_CARD_CONTENT } from "@/content/onboarding";
import { getBuildMetadata, getPortalData, getValidationReport } from "@/lib/data/processed-data";
import { buildOnboardingLinks, buildOnboardingQuestionLinks } from "@/lib/onboarding";
import { buildRouteMetadata } from "@/lib/site-metadata";
import { truncateWithEllipsis } from "@/lib/text-format";

export const metadata: Metadata = buildRouteMetadata({
  title: "Home",
  description:
    "Start discovery across researchers, projects, datasets, technologies, and disease areas in the MD Anderson Cancer Data Portal.",
  path: "/",
  keywords: ["md anderson", "cancer data portal", "research discovery", "datasets", "researchers"],
});

export default async function HomePage() {
  const [portalData, buildMetadata, validationReport] = await Promise.all([
    getPortalData(),
    getBuildMetadata(),
    getValidationReport(),
  ]);
  const { researchers, projects, datasets, technologies, diseaseAreas, relationships } = portalData;
  const relationshipMaps = Object.values(relationships) as Record<string, string[]>[];
  const relationshipCount = relationshipMaps.reduce(
    (sum, relationshipMap) => sum + Object.values(relationshipMap).reduce((inner, ids) => inner + ids.length, 0),
    0,
  );

  const browseLinks = [
    { href: "/researchers", title: "Browse Researchers", count: researchers.length, note: "Profiles and collaboration context" },
    { href: "/projects", title: "Browse Projects", count: projects.length, note: "Programs and initiatives" },
    { href: "/datasets", title: "Browse Datasets", count: datasets.length, note: "Data resources and modalities" },
    { href: "/technologies", title: "Browse Technologies", count: technologies.length, note: "Methods and platforms" },
    { href: "/disease-areas", title: "Browse Disease Areas", count: diseaseAreas.length, note: "Disease-first discovery" },
    {
      href: "/explore",
      title: "Explore All",
      count: researchers.length + projects.length + datasets.length + technologies.length + diseaseAreas.length,
      note: "Cross-entity search workspace",
    },
  ];

  const highlightedDiseaseAreas = diseaseAreas
    .map((diseaseArea) => ({
      id: diseaseArea.id,
      name: diseaseArea.diseaseAreaName,
      researcherCount: (relationships.diseaseAreaToResearchers[diseaseArea.id] ?? []).length,
      datasetCount: (relationships.diseaseAreaToDatasets[diseaseArea.id] ?? []).length,
      technologyCount: (relationships.diseaseAreaToTechnologies[diseaseArea.id] ?? []).length,
    }))
    .sort((a, b) => b.researcherCount - a.researcherCount || a.name.localeCompare(b.name))
    .slice(0, 4);

  const representativeDatasets = [...datasets]
    .sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? "") || a.datasetName.localeCompare(b.datasetName))
    .slice(0, 3);

  const technologyCategoryCounts = technologies.reduce<Record<string, number>>((acc, technology) => {
    const category = technology.technologyCategory || "unspecified";
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  const topTechnologyCategories = Object.entries(technologyCategoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .slice(0, 4);

  const onboardingLinks = buildOnboardingLinks(portalData);
  const onboardingQuestions = buildOnboardingQuestionLinks(portalData);
  const onboardingLinkByKey = Object.fromEntries(onboardingLinks.map((item) => [item.key, item]));
  const curatedQuestionLinks = EXAMPLE_QUESTION_PROMPTS.map((question, index) => ({
    question,
    href: onboardingQuestions[index]?.href ?? "/explore",
  }));

  const metricCards = [
    { label: "Researchers", value: researchers.length, href: "/researchers" },
    { label: "Projects", value: projects.length, href: "/projects" },
    { label: "Datasets", value: datasets.length, href: "/datasets" },
    { label: "Technologies", value: technologies.length, href: "/technologies" },
    { label: "Disease Areas", value: diseaseAreas.length, href: "/disease-areas" },
    { label: "Mapped Relationships", value: relationshipCount, href: "/dashboard" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discovery Dashboard"
        description="Use a search-first workflow to move quickly between disease areas, investigator profiles, datasets, technologies, and programs."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {metricCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-blue-200"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1f3f70]">{card.value}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Search Workspace</h2>
          <QuickJumpSearch
            title="Search and Quick Jump"
            description="Start with a keyword, optionally narrow by entity type, and continue in Explore with shareable URL filters."
            defaultType="all"
            showTypeSelector
            submitLabel="Search Explore"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-slate-900">Curated Discovery Paths</h3>
              <ul className="mt-2 space-y-2">
                {onboardingLinks.slice(0, 4).map((example) => (
                  <li key={example.key}>
                    <Link href={example.href} className="text-sm font-medium text-blue-800 underline hover:text-blue-700">
                      {example.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-600">{example.description}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-slate-900">Common Questions</h3>
              <ul className="mt-2 space-y-2">
                {curatedQuestionLinks.slice(0, 4).map((item) => (
                  <li key={item.question}>
                    <Link href={item.href} className="text-sm text-slate-800 underline hover:text-slate-900">
                      {item.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Portal Health Snapshot</h2>
            <ValidationSummary
              buildMetadata={buildMetadata}
              validationReport={validationReport}
              variant="compact"
              showStatusLink={true}
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Start Here</h2>
            <div className="mt-3 space-y-2">
              {START_HERE_CARD_CONTENT.slice(0, 3).map((card) => {
                const route = onboardingLinkByKey[card.id] ?? onboardingLinks[0];
                return (
                  <article key={card.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{card.description}</p>
                    {route ? (
                      <Link href={route.href} className="mt-2 inline-block text-xs font-semibold text-blue-800 underline hover:text-blue-700">
                        {card.actionLabel}
                      </Link>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Entity Browsing</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {browseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-blue-200 hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="break-words text-sm font-semibold text-[#1f3f70]">{link.title}</p>
                <p className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900">
                  {link.count}
                </p>
              </div>
              <p className="mt-2 line-clamp-2 break-words text-xs text-slate-600">{link.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Featured Disease Areas</h2>
          <ul className="mt-3 space-y-2">
            {highlightedDiseaseAreas.map((item) => (
              <li key={item.id}>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="break-words text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {item.researcherCount} researchers - {item.datasetCount} datasets - {item.technologyCount} technologies
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link href={`/disease-areas/${item.id}`} className="text-xs font-medium text-blue-800 underline-offset-2 hover:underline">
                      View Disease Area
                    </Link>
                    <Link href={`/researchers?disease=${item.id}`} className="text-xs font-medium text-blue-800 underline-offset-2 hover:underline">
                      Researchers
                    </Link>
                    <Link href={`/datasets?disease=${item.id}`} className="text-xs font-medium text-blue-800 underline-offset-2 hover:underline">
                      Datasets
                    </Link>
                    <Link href={`/projects?disease=${item.id}`} className="text-xs font-medium text-blue-800 underline-offset-2 hover:underline">
                      Projects
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Data and Technology Snapshot</h2>
          <ul className="mt-3 space-y-2">
            {representativeDatasets.map((dataset) => (
              <li key={dataset.id}>
                <Link href={`/datasets/${dataset.id}`} className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:border-blue-200">
                  <p className="break-words text-sm font-medium text-slate-900">{dataset.datasetName}</p>
                  <p className="mt-1 text-xs text-slate-600">{dataset.datasetType} - updated {dataset.lastUpdated ?? "n/a"}</p>
                </Link>
              </li>
            ))}
          </ul>

          <MetadataChips
            className="mt-4"
            items={topTechnologyCategories.map((item) => `${truncateWithEllipsis(item.category, 28)}: ${item.count}`)}
            max={4}
          />
        </section>
      </section>
    </div>
  );
}
