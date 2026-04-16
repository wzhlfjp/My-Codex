"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
exports.normalizeBoolean = normalizeBoolean;
exports.normalizeDate = normalizeDate;
exports.normalizeEnumValue = normalizeEnumValue;
exports.validateRelationshipUniqueness = validateRelationshipUniqueness;
exports.validateForeignKeys = validateForeignKeys;
exports.inferIssueType = inferIssueType;
exports.validateAllCsvData = validateAllCsvData;
exports.buildValidationReport = buildValidationReport;
exports.writeValidationReport = writeValidationReport;
exports.getDefaultValidationReportPath = getDefaultValidationReportPath;
const promises_1 = require("node:fs/promises");
const path = require("node:path");
const data_contract_1 = require("./data_contract");
const DEFAULT_RAW_DATA_DIR = path.join(process.cwd(), "data", "raw");
const DEFAULT_VALIDATION_REPORT_PATH = path.join(process.cwd(), "data", "processed", "validation_report.json");
function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    cell += '"';
                    i += 1;
                }
                else {
                    inQuotes = false;
                }
            }
            else {
                cell += char;
            }
            continue;
        }
        if (char === '"') {
            inQuotes = true;
            continue;
        }
        if (char === ",") {
            row.push(cell);
            cell = "";
            continue;
        }
        if (char === "\n") {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
            continue;
        }
        if (char === "\r") {
            continue;
        }
        cell += char;
    }
    if (cell.length > 0 || row.length > 0) {
        row.push(cell);
        rows.push(row);
    }
    return rows;
}
function normalizeCell(value) {
    return value.trim();
}
function normalizeBoolean(value) {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) {
        return "TRUE";
    }
    if (["false", "0", "no"].includes(normalized)) {
        return "FALSE";
    }
    return value.trim();
}
function normalizeDate(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return "";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }
    const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
    if (!match) {
        return trimmed;
    }
    const month = match[1].padStart(2, "0");
    const day = match[2].padStart(2, "0");
    const year = match[3];
    return `${year}-${month}-${day}`;
}
function normalizeEnumValue(value) {
    const lowered = value.trim().toLowerCase();
    return data_contract_1.NORMALIZED_VALUE_MAP[lowered] ?? lowered;
}
function trackNormalization(substitutions, fileName, column, from, to) {
    const key = `${fileName}|${column}|${from}|${to}`;
    const existing = substitutions.get(key);
    if (existing) {
        existing.count += 1;
        return;
    }
    substitutions.set(key, {
        fileName,
        column,
        from,
        to,
        count: 1,
    });
}
async function readCsvRows(fileName, rawDataDir) {
    const filePath = path.join(rawDataDir, fileName);
    const text = await (0, promises_1.readFile)(filePath, "utf8");
    const parsed = parseCsv(text);
    if (parsed.length === 0) {
        return { headers: [], rows: [] };
    }
    const [headerRow, ...dataRows] = parsed;
    const headers = headerRow.map((header, index) => (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim());
    const rows = dataRows
        .filter((row) => row.some((cell) => cell.trim().length > 0))
        .map((row) => {
        const record = {};
        headers.forEach((header, index) => {
            record[header] = normalizeCell(row[index] ?? "");
        });
        return record;
    });
    return { headers, rows };
}
function validateRequiredColumns(tableName, headers, requiredColumns, errors) {
    for (const column of requiredColumns) {
        if (!headers.includes(column)) {
            errors.push(`[${tableName}] Missing required column: ${column}`);
        }
    }
}
function validateRequiredValues(tableName, rows, requiredColumns, errors) {
    rows.forEach((row, index) => {
        requiredColumns.forEach((column) => {
            if (!row[column]?.trim()) {
                errors.push(`[${tableName}] Row ${index + 2} missing required value for column: ${column}`);
            }
        });
    });
}
function validateUniqueIdColumn(tableName, rows, idColumn, errors) {
    const seen = new Set();
    rows.forEach((row, index) => {
        const idValue = row[idColumn]?.trim();
        if (!idValue) {
            return;
        }
        if (seen.has(idValue)) {
            errors.push(`[${tableName}] Duplicate ID in column ${idColumn}: ${idValue} (row ${index + 2})`);
            return;
        }
        seen.add(idValue);
    });
}
function normalizeRowsForSchema(rows, schema, substitutions) {
    return rows.map((row) => {
        const next = { ...row };
        schema.booleanColumns?.forEach((column) => {
            next[column] = normalizeBoolean(next[column] ?? "");
        });
        Object.keys(schema.enumColumns ?? {}).forEach((column) => {
            const currentRaw = next[column] ?? "";
            const current = currentRaw.trim();
            if (!current) {
                next[column] = "";
                return;
            }
            const lowered = current.toLowerCase();
            const normalized = normalizeEnumValue(current);
            const mapped = data_contract_1.NORMALIZED_VALUE_MAP[lowered];
            if (mapped && mapped !== lowered) {
                trackNormalization(substitutions, schema.fileName, column, lowered, mapped);
            }
            next[column] = normalized;
        });
        if (typeof next.last_updated === "string") {
            next.last_updated = normalizeDate(next.last_updated);
        }
        return next;
    });
}
function validateBooleanColumns(tableName, rows, columns, errors) {
    rows.forEach((row, index) => {
        columns.forEach((column) => {
            const value = (row[column] ?? "").trim();
            if (!value) {
                return;
            }
            if (value !== "TRUE" && value !== "FALSE") {
                errors.push(`[${tableName}] Row ${index + 2} has invalid boolean value for ${column}: ${value}`);
            }
        });
    });
}
function validateEnumColumns(tableName, rows, enums, errors) {
    rows.forEach((row, index) => {
        Object.entries(enums).forEach(([column, allowedValues]) => {
            const value = (row[column] ?? "").trim();
            if (!value) {
                return;
            }
            if (!allowedValues.includes(value)) {
                errors.push(`[${tableName}] Row ${index + 2} has invalid value for ${column}: ${value}. Allowed: ${allowedValues.join(", ")}`);
            }
        });
    });
}
function validateRelationshipUniqueness(schema, rows, errors) {
    const seen = new Set();
    rows.forEach((row, index) => {
        const key = schema.uniqueComposite.map((column) => row[column]).join("||");
        if (seen.has(key)) {
            errors.push(`[${schema.fileName}] Duplicate relationship row for key (${schema.uniqueComposite.join(", ")}): ${key} (row ${index + 2})`);
            return;
        }
        seen.add(key);
    });
}
function validateForeignKeys(schema, rows, allTables, errors) {
    schema.foreignKeys.forEach((fk) => {
        const targetRows = allTables[fk.targetFile] ?? [];
        const validIds = new Set(targetRows.map((row) => row[fk.targetIdColumn]).filter(Boolean));
        rows.forEach((row, index) => {
            const value = row[fk.column];
            if (!value) {
                return;
            }
            if (!validIds.has(value)) {
                errors.push(`[${schema.fileName}] Row ${index + 2} has missing foreign key ${fk.column}=${value}; target ${fk.targetFile}.${fk.targetIdColumn} not found`);
            }
        });
    });
}
function buildNormalizationSummary(substitutions) {
    const rows = [...substitutions.values()].sort((a, b) => {
        if (b.count !== a.count) {
            return b.count - a.count;
        }
        return `${a.fileName}|${a.column}|${a.from}|${a.to}`.localeCompare(`${b.fileName}|${b.column}|${b.from}|${b.to}`);
    });
    return {
        totalSubstitutions: rows.reduce((sum, row) => sum + row.count, 0),
        substitutions: rows,
    };
}
function extractFileName(message) {
    const match = /^\[([^\]]+)\]/.exec(message.trim());
    return match?.[1] ?? "unknown";
}
function inferIssueType(message) {
    if (message.includes("Missing required column")) {
        return "missing_required_column";
    }
    if (message.includes("missing required value for column")) {
        return "missing_required_value";
    }
    if (message.includes("Duplicate ID in column")) {
        return "duplicate_id";
    }
    if (message.includes("invalid boolean value")) {
        return "invalid_boolean";
    }
    if (message.includes("invalid value for")) {
        return "invalid_enum";
    }
    if (message.includes("Duplicate relationship row")) {
        return "duplicate_relationship";
    }
    if (message.includes("missing foreign key")) {
        return "missing_foreign_key";
    }
    if (message.includes("No rows found")) {
        return "empty_table";
    }
    return "other";
}
function getStatus(errors, warnings) {
    if (errors.length > 0) {
        return "failed";
    }
    if (warnings.length > 0) {
        return "passed_with_warnings";
    }
    return "passed";
}
async function validateAllCsvData(options) {
    const rawDataDir = options?.rawDataDir ?? DEFAULT_RAW_DATA_DIR;
    const errors = [];
    const warnings = [];
    const tables = {};
    const substitutions = new Map();
    for (const schema of data_contract_1.CORE_TABLE_CONTRACTS) {
        const loadedTable = await readCsvRows(schema.fileName, rawDataDir);
        const rows = normalizeRowsForSchema(loadedTable.rows, schema, substitutions);
        tables[schema.fileName] = rows;
        validateRequiredColumns(schema.fileName, loadedTable.headers, schema.requiredColumns, errors);
        validateRequiredValues(schema.fileName, rows, schema.requiredColumns, errors);
        if (schema.idColumn) {
            validateUniqueIdColumn(schema.fileName, rows, schema.idColumn, errors);
        }
        if (schema.booleanColumns) {
            validateBooleanColumns(schema.fileName, rows, schema.booleanColumns, errors);
        }
        if (schema.enumColumns) {
            validateEnumColumns(schema.fileName, rows, schema.enumColumns, errors);
        }
        if (rows.length === 0) {
            warnings.push(`[${schema.fileName}] No rows found.`);
        }
    }
    for (const schema of data_contract_1.RELATIONSHIP_TABLE_CONTRACTS) {
        const loadedTable = await readCsvRows(schema.fileName, rawDataDir);
        const rows = loadedTable.rows;
        tables[schema.fileName] = rows;
        validateRequiredColumns(schema.fileName, loadedTable.headers, schema.requiredColumns, errors);
        validateRequiredValues(schema.fileName, rows, schema.requiredColumns, errors);
        validateRelationshipUniqueness(schema, rows, errors);
        validateForeignKeys(schema, rows, tables, errors);
        if (rows.length === 0) {
            warnings.push(`[${schema.fileName}] No rows found.`);
        }
    }
    const normalizationSummary = buildNormalizationSummary(substitutions);
    return {
        ok: errors.length === 0,
        status: getStatus(errors, warnings),
        errors,
        warnings,
        tables,
        normalizationSummary,
    };
}
function buildValidationReport(result, options) {
    const issuesByFile = {};
    Object.entries(result.tables).forEach(([fileName, rows]) => {
        issuesByFile[fileName] = {
            rowCount: rows.length,
            errors: [],
            warnings: [],
        };
    });
    const issueCountByType = new Map();
    result.errors.forEach((error) => {
        const fileName = extractFileName(error);
        issuesByFile[fileName] ?? (issuesByFile[fileName] = { rowCount: 0, errors: [], warnings: [] });
        issuesByFile[fileName].errors.push(error);
        const type = inferIssueType(error);
        issueCountByType.set(type, (issueCountByType.get(type) ?? 0) + 1);
    });
    result.warnings.forEach((warning) => {
        const fileName = extractFileName(warning);
        issuesByFile[fileName] ?? (issuesByFile[fileName] = { rowCount: 0, errors: [], warnings: [] });
        issuesByFile[fileName].warnings.push(warning);
        const type = inferIssueType(warning);
        issueCountByType.set(type, (issueCountByType.get(type) ?? 0) + 1);
    });
    const sortedIssueCountByType = Object.fromEntries([...issueCountByType.entries()].sort((a, b) => a[0].localeCompare(b[0])));
    return {
        generatedAt: options?.generatedAt ?? new Date().toISOString(),
        status: result.status,
        summary: {
            filesScanned: Object.keys(result.tables).length,
            tableCount: {
                core: data_contract_1.CORE_TABLE_CONTRACTS.length,
                relationship: data_contract_1.RELATIONSHIP_TABLE_CONTRACTS.length,
                total: data_contract_1.CORE_TABLE_CONTRACTS.length + data_contract_1.RELATIONSHIP_TABLE_CONTRACTS.length,
            },
            rowCount: Object.values(result.tables).reduce((sum, rows) => sum + rows.length, 0),
            issueCountBySeverity: {
                error: result.errors.length,
                warning: result.warnings.length,
            },
            issueCountByType: sortedIssueCountByType,
            normalizationSubstitutionCount: result.normalizationSummary.totalSubstitutions,
        },
        issuesByFile,
        normalizationSummary: result.normalizationSummary,
    };
}
async function writeValidationReport(report, outputPath) {
    await (0, promises_1.mkdir)(path.dirname(outputPath), { recursive: true });
    await (0, promises_1.writeFile)(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
function getDefaultValidationReportPath(processedDataDir) {
    if (processedDataDir) {
        return path.join(processedDataDir, "validation_report.json");
    }
    return DEFAULT_VALIDATION_REPORT_PATH;
}
async function main() {
    const result = await validateAllCsvData();
    const report = buildValidationReport(result);
    const reportPath = getDefaultValidationReportPath();
    await writeValidationReport(report, reportPath);
    console.log(`Validation report written: ${reportPath}`);
    if (result.warnings.length > 0) {
        console.warn("CSV validation warnings:");
        result.warnings.forEach((warning) => {
            console.warn(`- ${warning}`);
        });
    }
    if (!result.ok) {
        console.error("CSV validation failed:");
        result.errors.forEach((error) => {
            console.error(`- ${error}`);
        });
        process.exitCode = 1;
        return;
    }
    console.log("CSV validation passed.");
}
if (typeof require !== "undefined" && require.main === module) {
    void main();
}
