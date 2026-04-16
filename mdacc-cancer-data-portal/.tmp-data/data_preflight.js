"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreflightSummary = createPreflightSummary;
exports.renderPreflightSummary = renderPreflightSummary;
exports.runDataPreflight = runDataPreflight;
const generate_csv_templates_1 = require("./generate_csv_templates");
const validate_csv_1 = require("./validate_csv");
function rankFilesForSummary(report) {
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
function createPreflightSummary(report) {
    return {
        status: report.status,
        errorCount: report.summary.issueCountBySeverity.error,
        warningCount: report.summary.issueCountBySeverity.warning,
        filesWithIssues: rankFilesForSummary(report),
    };
}
function renderPreflightSummary(summary, reportPath) {
    const lines = [];
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
    }
    else {
        lines.push("- Files needing attention: none");
    }
    lines.push(`- Full report: ${reportPath}`);
    lines.push("- Use `npm run verify` for full test/lint/build validation.");
    return lines;
}
async function runDataPreflight(options) {
    await (0, generate_csv_templates_1.generateCsvTemplates)();
    const validation = await (0, validate_csv_1.validateAllCsvData)();
    const report = (0, validate_csv_1.buildValidationReport)(validation);
    const reportPath = (0, validate_csv_1.getDefaultValidationReportPath)(options?.processedDataDir);
    await (0, validate_csv_1.writeValidationReport)(report, reportPath);
    const summary = createPreflightSummary(report);
    return { report, reportPath, summary };
}
async function main() {
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
