"use client";

import { useMemo, useState } from "react";
import { createExportFilename, rowsToCsv } from "@/lib/export";
import type { ExportRow } from "@/lib/export";

function downloadContent(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

async function copyTextToClipboard(value: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "true");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
  } catch {
    return false;
  }
}

export function ShareExportActions({
  fileStem,
  copyLink = true,
  showCsv = true,
  showJson = true,
  csvRows,
  jsonData,
  className,
}: {
  fileStem: string;
  copyLink?: boolean;
  showCsv?: boolean;
  showJson?: boolean;
  csvRows?: ExportRow[];
  jsonData?: unknown;
  className?: string;
}) {
  const [status, setStatus] = useState<string>("");
  const csvCount = csvRows?.length ?? 0;
  const hasCsvRows = csvCount > 0;
  const jsonPayload = useMemo(() => jsonData ?? csvRows ?? [], [jsonData, csvRows]);
  const hasJsonPayload = Array.isArray(jsonPayload) ? jsonPayload.length > 0 : Boolean(jsonPayload);

  const setStatusWithTimeout = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 2200);
  };

  const handleCopyLink = async () => {
    const copied = await copyTextToClipboard(window.location.href);
    setStatusWithTimeout(copied ? "Link copied." : "Unable to copy link on this browser.");
  };

  const handleExportCsv = () => {
    if (!hasCsvRows || !csvRows) {
      setStatusWithTimeout("No visible results to export.");
      return;
    }

    const csv = rowsToCsv(csvRows);
    if (!csv) {
      setStatusWithTimeout("No visible results to export.");
      return;
    }

    downloadContent(csv, createExportFilename(fileStem, "csv"), "text/csv;charset=utf-8");
    setStatusWithTimeout(`Exported ${csvCount} rows as CSV.`);
  };

  const handleExportJson = () => {
    if (!hasJsonPayload) {
      setStatusWithTimeout("No visible results to export.");
      return;
    }

    const content = `${JSON.stringify(jsonPayload, null, 2)}\n`;
    downloadContent(content, createExportFilename(fileStem, "json"), "application/json;charset=utf-8");
    setStatusWithTimeout("Exported JSON.");
  };

  return (
    <div className={["flex flex-col items-start gap-2", className ?? ""].join(" ").trim()}>
      <div className="flex flex-wrap items-center gap-2">
        {copyLink ? (
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Copy Link
          </button>
        ) : null}
        {showCsv ? (
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!hasCsvRows}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export CSV
          </button>
        ) : null}
        {showJson ? (
          <button
            type="button"
            onClick={handleExportJson}
            disabled={!hasJsonPayload}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export JSON
          </button>
        ) : null}
      </div>
      <p aria-live="polite" className="min-h-4 text-xs text-slate-500">
        {status}
      </p>
    </div>
  );
}
