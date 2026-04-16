import type { Metadata } from "next";
import Link from "next/link";
import { QuickJumpSearch } from "@/components/search/quick-jump-search";
import { PageHeader } from "@/components/ui/page-header";
import { MetadataChips } from "@/components/ui/metadata-chips";
import { EXAMPLE_QUESTION_PROMPTS, START_HERE_CARD_CONTENT } from "@/content/onboarding";
import { getPortalData } from "@/lib/data/processed-data";
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
  const portalData = await getPortalData();
  const { researchers, projects, datasets, technologies, diseaseAreas, relationships } = portalData;

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Discover MD Anderson research expertise, data resources, and technologies"
        description="Use guided pathways and search-first navigation to move quickly between disease areas, investigator profiles, datasets, technologies, and projects."
        actions={
          <Link
            href="/explore"
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium !text-white hover:bg-slate-800 hover:!text-white visited:!text-white focus-visible:!text-white"
          >
            Open Explore
          </Link>
        }
      />

      <QuickJumpSearch
        title="Search and Quick Jump"
        description="Start with a keyword, optionally narrow by entity type, and continue in Explore with shareable URL filters."
        defaultType="all"
        showTypeSelector
        submitLabel="Search Explore"
      />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Start Here</h2>
        <p className="mt-2 text-sm text-slate-700">
          Use one of these guided pathways to move from a collaboration question to relevant people, datasets, technologies, and projects.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {START_HERE_CARD_CONTENT.map((card) => {
            const route = onboardingLinkByKey[card.id] ?? onboardingLinks[0];
            return (
              <article key={card.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{card.description}</p>
                {route ? (
                  <>
                    <p className="mt-2 text-xs text-slate-600">{route.description}</p>
                    <Link href={route.href} className="mt-2 inline-block text-sm font-medium text-slate-900 underline hover:text-slate-700">
                      {card.actionLabel}
                    </Link>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Curated Example Discovery Paths</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {onboardingLinks.map((example) => (
            <li key={example.key} className="rounded-md border border-slate-200 px-3 py-2">
              <Link href={example.href} className="text-sm font-medium text-slate-900 underline hover:text-slate-700">
                {example.title}
              </Link>
              <p className="mt-1 text-xs text-slate-600">{example.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Example Questions This Portal Can Answer</h2>
        <ul className="mt-3 space-y-2">
          {curatedQuestionLinks.map((item) => (
            <li key={item.question}>
              <Link href={item.href} className="text-sm text-slate-800 underline hover:text-slate-900">
                {item.question}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {browseLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <p className="break-words text-sm font-semibold text-slate-900">{link.title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{link.count}</p>
            <p className="mt-1 line-clamp-2 break-words text-xs text-slate-600">{link.note}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">What You Can Discover</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <p className="text-sm text-slate-700">Researchers working in specific disease areas and the technologies they use.</p>
          <p className="text-sm text-slate-700">Projects and programs linking teams, datasets, and disease-focused efforts.</p>
          <p className="text-sm text-slate-700">Datasets linked to disease context, modalities, and associated research teams.</p>
          <p className="text-sm text-slate-700">Measurement platforms and methods connected to active data resources.</p>
          <p className="text-sm text-slate-700">Disease-oriented entry points that branch into people, projects, datasets, and technologies.</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Featured Disease Areas</h2>
          <ul className="mt-3 space-y-2">
            {highlightedDiseaseAreas.map((item) => (
              <li key={item.id}>
                <div className="rounded-md border border-slate-200 px-3 py-2 hover:border-slate-300">
                  <p className="break-words text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {item.researcherCount} researchers - {item.datasetCount} datasets - {item.technologyCount} technologies
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link href={`/disease-areas/${item.id}`} className="text-xs text-slate-700 underline-offset-2 hover:underline">
                      View Disease Area
                    </Link>
                    <Link href={`/researchers?disease=${item.id}`} className="text-xs text-slate-700 underline-offset-2 hover:underline">
                      Browse Researchers
                    </Link>
                    <Link href={`/datasets?disease=${item.id}`} className="text-xs text-slate-700 underline-offset-2 hover:underline">
                      Browse Datasets
                    </Link>
                    <Link href={`/projects?disease=${item.id}`} className="text-xs text-slate-700 underline-offset-2 hover:underline">
                      Browse Projects
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Data and Technology Snapshot</h2>
          <ul className="mt-3 space-y-2">
            {representativeDatasets.map((dataset) => (
              <li key={dataset.id}>
                <Link href={`/datasets/${dataset.id}`} className="block rounded-md border border-slate-200 px-3 py-2 hover:border-slate-300">
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
        </div>
      </section>
    </div>
  );
}
