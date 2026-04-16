import type { BuildMetadata, ValidationReport, ValidationStatus } from "@/types/domain";

export type HealthTone = "good" | "warning" | "error" | "neutral";

export type FileIssueSummary = {
  fileName: string;
  rowCount?: number;
  errorCount: number;
  warningCount: number;
  errors: string[];
  warnings: string[];
};

export type PortalHealthSummary = {
  status: ValidationStatus | "unknown";
  tone: HealthTone;
  hasBuildMetadata: boolean;
  hasValidationReport: boolean;
  buildGeneratedAt?: string;
  validationGeneratedAt?: string;
  latestSourceUpdateDate?: string;
  sourceFileCount?: number;
  processedEntityCounts?: BuildMetadata["processedEntityCounts"];
  rowCount?: number;
  errorCount: number;
  warningCount: number;
  normalizationSubstitutionCount?: number;
  filesWithIssues: FileIssueSummary[];
};

const FILE_NAME_PATTERN = /^\[([^\]]+)\]/;

function parseIssueFileName(message: string): string {
  return FILE_NAME_PATTERN.exec(message)?.[1] ?? "unknown";
}

function mapStatusToTone(status: PortalHealthSummary["status"]): HealthTone {
  if (status === "passed") {
    return "good";
  }
  if (status === "failed") {
    return "error";
  }
  if (status === "passed_with_warnings") {
    return "warning";
  }
  return "neutral";
}

function sortFileIssues(items: FileIssueSummary[]): FileIssueSummary[] {
  return [...items].sort((a, b) => {
    if (b.errorCount !== a.errorCount) {
      return b.errorCount - a.errorCount;
    }
    if (b.warningCount !== a.warningCount) {
      return b.warningCount - a.warningCount;
    }
    return a.fileName.localeCompare(b.fileName);
  });
}

function summarizeFromValidationReport(report: ValidationReport): FileIssueSummary[] {
  const entries = Object.entries(report.issuesByFile)
    .map(([fileName, issue]) => ({
      fileName,
      rowCount: issue.rowCount,
      errorCount: issue.errors.length,
      warningCount: issue.warnings.length,
      errors: issue.errors,
      warnings: issue.warnings,
    }))
    .filter((item) => item.errorCount > 0 || item.warningCount > 0);

  return sortFileIssues(entries);
}

function summarizeFromBuildWarnings(buildMetadata: BuildMetadata): FileIssueSummary[] {
  const grouped = new Map<string, FileIssueSummary>();

  buildMetadata.validationWarningsSummary.warnings.forEach((warning) => {
    const fileName = parseIssueFileName(warning);
    const existing = grouped.get(fileName) ?? {
      fileName,
      rowCount: undefined,
      errorCount: 0,
      warningCount: 0,
      errors: [],
      warnings: [],
    };
    existing.warningCount += 1;
    existing.warnings.push(warning);
    grouped.set(fileName, existing);
  });

  return sortFileIssues([...grouped.values()]);
}

export function getHealthStatusPresentation(status: PortalHealthSummary["status"]): {
  label: string;
  badgeClassName: string;
} {
  if (status === "passed") {
    return {
      label: "Passed",
      badgeClassName: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    };
  }
  if (status === "passed_with_warnings") {
    return {
      label: "Passed With Warnings",
      badgeClassName: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    };
  }
  if (status === "failed") {
    return {
      label: "Failed",
      badgeClassName: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    };
  }

  return {
    label: "Unavailable",
    badgeClassName: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  };
}

export function summarizePortalHealth(
  buildMetadata: BuildMetadata | null,
  validationReport: ValidationReport | null,
): PortalHealthSummary {
  const status: PortalHealthSummary["status"] = validationReport?.status ?? buildMetadata?.validationStatus ?? "unknown";
  const filesWithIssues = validationReport
    ? summarizeFromValidationReport(validationReport)
    : buildMetadata
      ? summarizeFromBuildWarnings(buildMetadata)
      : [];

  const errorCount = validationReport?.summary.issueCountBySeverity.error ?? 0;
  const warningCount =
    validationReport?.summary.issueCountBySeverity.warning ?? buildMetadata?.validationWarningsSummary.count ?? 0;

  return {
    status,
    tone: mapStatusToTone(status),
    hasBuildMetadata: Boolean(buildMetadata),
    hasValidationReport: Boolean(validationReport),
    buildGeneratedAt: buildMetadata?.generatedAt,
    validationGeneratedAt: validationReport?.generatedAt,
    latestSourceUpdateDate: buildMetadata?.latestSourceUpdateDate,
    sourceFileCount: validationReport?.summary.filesScanned ?? buildMetadata?.sourceFilesUsed.length,
    processedEntityCounts: buildMetadata?.processedEntityCounts,
    rowCount: validationReport?.summary.rowCount,
    errorCount,
    warningCount,
    normalizationSubstitutionCount: validationReport?.summary.normalizationSubstitutionCount,
    filesWithIssues,
  };
}
