import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { getBuildMetadata } from "@/lib/data/processed-data";

function formatBuildDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export async function SiteFooter() {
  const buildMetadata = await getBuildMetadata();
  const freshnessLine = buildMetadata?.generatedAt
    ? `Last build ${formatBuildDate(buildMetadata.generatedAt)}${
        buildMetadata.validationStatus === "passed_with_warnings" ? " (with validation warnings)" : ""
      }.`
    : "Build metadata is not currently available.";

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <PageContainer>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl">MVP scaffold using local seed data only. Built for calm, clear discovery navigation.</p>
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-3 text-sm">
              <Link href="/explore" className="text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
                Explore
              </Link>
              <Link href="/projects" className="text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
                Projects
              </Link>
              <Link href="/about" className="text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
                About
              </Link>
              <Link href="/status" className="text-slate-700 underline-offset-2 hover:text-slate-900 hover:underline">
                Portal Status
              </Link>
            </nav>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            <Link href="/status" className="underline-offset-2 hover:text-slate-700 hover:underline">
              {freshnessLine}
            </Link>
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
