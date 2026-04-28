import Link from "next/link";
import { formatDateForDisplay } from "@/lib/detail-format";
import {
  getHealthStatusPresentation,
  summarizePortalHealth,
  type PortalHealthSummary,
} from "@/lib/data-health";
import type { BuildMetadata, ValidationReport } from "@/types/domain";

function formatDateTime(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}

function formatIssueCount(errors: number, warnings: number): string {
  const parts: string[] = [];
  parts.push(`${errors} error${errors === 1 ? "" : "s"}`);
  parts.push(`${warnings} warning${warnings === 1 ? "" : "s"}`);
  return parts.join(", ");
}

function FileIssueList({ items }: { items: PortalHealthSummary["filesWithIssues"] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No file-level warnings or errors are currently reported.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.fileName} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <p className="font-medium text-[#1f3f70]">{item.fileName}</p>
          <p className="mt-1 text-xs text-slate-600">
            {formatIssueCount(item.errorCount, item.warningCount)}
            {typeof item.rowCount === "number" ? ` - ${item.rowCount} rows` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function ValidationSummary({
  buildMetadata,
  validationReport,
  variant = "full",
  showIssueDetails = false,
  maxFiles = 8,
  showStatusLink = false,
}: {
  buildMetadata: BuildMetadata | null;
  validationReport: ValidationReport | null;
  variant?: "compact" | "full";
  showIssueDetails?: boolean;
  maxFiles?: number;
  showStatusLink?: boolean;
}) {
  const summary = summarizePortalHealth(buildMetadata, validationReport);
  const presentation = getHealthStatusPresentation(summary.status);
  const filesForDisplay = summary.filesWithIssues.slice(0, maxFiles);
  const buildDate = formatDateTime(summary.buildGeneratedAt);
  const validationDate = formatDateTime(summary.validationGeneratedAt);
  const latestSourceDate = formatDateForDisplay(summary.latestSourceUpdateDate);

  if (variant === "compact") {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${presentation.badgeClassName}`}>
            {presentation.label}
          </span>
          <p className="text-xs text-slate-600">
            {formatIssueCount(summary.errorCount, summary.warningCount)}
            {buildDate ? ` - build ${buildDate}` : ""}
          </p>
          {showStatusLink ? (
            <Link href="/status" className="text-xs font-medium text-slate-700 underline hover:text-slate-900">
              View portal status
            </Link>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1f3f70]">Validation And Build Health</h2>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${presentation.badgeClassName}`}>
          {presentation.label}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Issues</span>
          <span className="mt-1 block font-medium text-slate-800">{formatIssueCount(summary.errorCount, summary.warningCount)}</span>
        </p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source Files</span>
          <span className="mt-1 block font-medium text-slate-800">
            {typeof summary.sourceFileCount === "number" ? summary.sourceFileCount : "Not available"}
          </span>
        </p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Build</span>
          <span className="mt-1 block font-medium text-slate-800">{buildDate ?? "Not available"}</span>
        </p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Validation Report</span>
          <span className="mt-1 block font-medium text-slate-800">{validationDate ?? "Not available"}</span>
        </p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest Source Update</span>
          <span className="mt-1 block font-medium text-slate-800">{latestSourceDate ?? "Not available"}</span>
        </p>
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Normalized Substitutions</span>
          <span className="mt-1 block font-medium text-slate-800">
            {typeof summary.normalizationSubstitutionCount === "number"
              ? summary.normalizationSubstitutionCount
              : "Not available"}
          </span>
        </p>
      </div>

      {summary.processedEntityCounts ? (
        <p className="mt-3 text-sm text-slate-700">
          Processed entities: {summary.processedEntityCounts.researchers} researchers,{" "}
          {summary.processedEntityCounts.projects} projects, {summary.processedEntityCounts.datasets} datasets,{" "}
          {summary.processedEntityCounts.technologies} technologies, {summary.processedEntityCounts.diseaseAreas} disease areas.
        </p>
      ) : null}

      {!summary.hasBuildMetadata && !summary.hasValidationReport ? (
        <p className="mt-3 text-sm text-slate-600">
          Build metadata and validation report are not available yet. Run `npm run data:build` or `npm run data:validate`.
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <h3 className="text-sm font-semibold text-[#1f3f70]">Files Needing Attention</h3>
        <FileIssueList items={filesForDisplay} />
        {summary.filesWithIssues.length > filesForDisplay.length ? (
          <p className="text-xs text-slate-500">
            Showing {filesForDisplay.length} of {summary.filesWithIssues.length} files with issues.
          </p>
        ) : null}
      </div>

      {showIssueDetails && filesForDisplay.some((item) => item.errors.length > 0 || item.warnings.length > 0) ? (
        <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">View issue details</summary>
          <div className="mt-2 space-y-3">
            {filesForDisplay.map((item) => (
              <div key={`${item.fileName}-details`} className="text-xs text-slate-600">
                <p className="font-semibold text-slate-700">{item.fileName}</p>
                {[...item.errors, ...item.warnings].length > 0 ? (
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {[...item.errors, ...item.warnings].map((issue) => (
                      <li key={issue} className="break-words">
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
