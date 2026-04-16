export type ExportPrimitive = string | number | boolean | null | undefined;
export type ExportRow = Record<string, ExportPrimitive>;

function sanitizeFileStem(stem: string): string {
  const normalized = stem
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "export";
}

function formatDateStamp(date: Date): string {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function serializeCellValue(value: ExportPrimitive): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return `${value}`;
}

function escapeCsvValue(value: string): string {
  if (!/[",\n]/.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, "\"\"")}"`;
}

export function createExportFilename(stem: string, format: "csv" | "json", date = new Date()): string {
  return `${sanitizeFileStem(stem)}-${formatDateStamp(date)}.${format}`;
}

export function inferExportColumns(rows: ExportRow[]): string[] {
  const columns: string[] = [];
  const seen = new Set<string>();

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      columns.push(key);
    });
  });

  return columns;
}

export function rowsToCsv(rows: ExportRow[], columns?: string[]): string {
  const csvColumns = columns && columns.length > 0 ? columns : inferExportColumns(rows);

  if (csvColumns.length === 0) {
    return "";
  }

  const header = csvColumns.join(",");
  const lines = rows.map((row) =>
    csvColumns
      .map((column) => escapeCsvValue(serializeCellValue(row[column])))
      .join(","),
  );

  return [header, ...lines].join("\n");
}

export function serializeList(values: Array<string | undefined>, limit = 4): string {
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .slice(0, limit)
    .join(" | ");
}
