import { generateCsvTemplates } from "./generate_csv_templates";
import { buildValidationReport, getDefaultValidationReportPath, validateAllCsvData, writeValidationReport } from "./validate_csv";
import type { ValidationReport } from "./validate_csv";

export type PreflightSummary = {
  status: ValidationReport["status"];
  errorCount: number;
  warningCount: number;
  filesWithIssues: Array<{
    fileName: string;
    errorCount: number;
    warningCount: number;
  }>;
};

function rankFilesForSummary(report: ValidationReport): PreflightSummary["filesWithIssues"] {
  return Object.entries(report.issuesByFile)
    .map(([fileName, issue]) => ({
      fileName,
      errorCount: issue.errors.length,
      warningCount: issue.warnings.length,
    }))
    .filter((item) => item.errorCount > 0 || item.warningCount > 0)
    .sort((a, b) => {
      if (b.errorCount !== a.errorCount) {
        return b.errorCount - a.errorCount;
      }
      if (b.warningCount !== a.warningCount) {
        return b.warningCount - a.warningCount;
      }
      return a.fileName.localeCompare(b.fileName);
    });
}

export function createPreflightSummary(report: ValidationReport): PreflightSummary {
  return {
    status: report.status,
    errorCount: report.summary.issueCountBySeverity.error,
    warningCount: report.summary.issueCountBySeverity.warning,
    filesWithIssues: rankFilesForSummary(report),
  };
}

export function renderPreflightSummary(summary: PreflightSummary, reportPath: string): string[] {
  const lines: string[] = [];
  lines.push("Data preflight summary:");
  lines.push(`- Status: ${summary.status}`);
  lines.push(`- Issues: ${summary.errorCount} errors, ${summary.warningCount} warnings`);

  if (summary.filesWithIssues.length > 0) {
    lines.push("- Files needing attention:");
    summary.filesWithIssues.slice(0, 8).forEach((item) => {
      lines.push(`  - ${item.fileName}: ${item.errorCount} errors, ${item.warningCount} warnings`);
    });

    if (summary.filesWithIssues.length > 8) {
      lines.push(`  - ... ${summary.filesWithIssues.length - 8} more files`);
    }
  } else {
    lines.push("- Files needing attention: none");
  }

  lines.push(`- Full report: ${reportPath}`);
  lines.push("- Use `npm run verify` for full test/lint/build validation.");
  return lines;
}

export async function runDataPreflight(options?: { processedDataDir?: string }): Promise<{
  report: ValidationReport;
  reportPath: string;
  summary: PreflightSummary;
}> {
  await generateCsvTemplates();

  const validation = await validateAllCsvData();
  const report = buildValidationReport(validation);
  const reportPath = getDefaultValidationReportPath(options?.processedDataDir);
  await writeValidationReport(report, reportPath);
  const summary = createPreflightSummary(report);

  return { report, reportPath, summary };
}

async function main(): Promise<void> {
  const { report, reportPath, summary } = await runDataPreflight();
  const lines = renderPreflightSummary(summary, reportPath);
  lines.forEach((line) => {
    console.log(line);
  });

  if (report.status === "failed") {
    process.exitCode = 1;
  }
}

if (typeof require !== "undefined" && require.main === module) {
  void main();
}
