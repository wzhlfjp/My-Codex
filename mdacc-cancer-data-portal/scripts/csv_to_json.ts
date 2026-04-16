import { mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import {
  buildValidationReport,
  getDefaultValidationReportPath,
  validateAllCsvData,
  writeValidationReport,
  type CsvRow,
  type ValidationResult,
} from "./validate_csv";

type RelationshipMaps = {
  researcherToDiseaseAreas: Record<string, string[]>;
  researcherToTechnologies: Record<string, string[]>;
  researcherToDatasets: Record<string, string[]>;
  researcherToProjects: Record<string, string[]>;
  projectToResearchers: Record<string, string[]>;
  projectToDatasets: Record<string, string[]>;
  projectToDiseaseAreas: Record<string, string[]>;
  datasetToTechnologies: Record<string, string[]>;
  datasetToDiseaseAreas: Record<string, string[]>;
  datasetToResearchers: Record<string, string[]>;
  datasetToProjects: Record<string, string[]>;
  diseaseAreaToResearchers: Record<string, string[]>;
  diseaseAreaToDatasets: Record<string, string[]>;
  diseaseAreaToProjects: Record<string, string[]>;
  diseaseAreaToTechnologies: Record<string, string[]>;
  technologyToResearchers: Record<string, string[]>;
  technologyToDatasets: Record<string, string[]>;
  technologyToDiseaseAreas: Record<string, string[]>;
};

export type BuildMetadata = {
  generatedAt: string;
  sourceFilesUsed: string[];
  processedEntityCounts: {
    researchers: number;
    projects: number;
    datasets: number;
    technologies: number;
    diseaseAreas: number;
  };
  latestSourceUpdateDate?: string;
  validationStatus: "passed" | "passed_with_warnings";
  validationWarningsSummary: {
    count: number;
    warnings: string[];
  };
};

const DEFAULT_PROCESSED_DATA_DIR = path.join(process.cwd(), "data", "processed");

export function toBoolean(value: string): boolean {
  return value === "TRUE";
}

export function toNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toOptional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function sortById<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

export function buildMap(rows: CsvRow[], sourceColumn: string, targetColumn: string): Record<string, string[]> {
  const map = new Map<string, Set<string>>();

  rows.forEach((row) => {
    const sourceId = row[sourceColumn];
    const targetId = row[targetColumn];
    if (!sourceId || !targetId) {
      return;
    }

    const current = map.get(sourceId) ?? new Set<string>();
    current.add(targetId);
    map.set(sourceId, current);
  });

  const output: Record<string, string[]> = {};
  for (const [sourceId, targetIds] of map.entries()) {
    output[sourceId] = [...targetIds].sort();
  }

  return output;
}

export function invertMap(input: Record<string, string[]>): Record<string, string[]> {
  const inverted = new Map<string, Set<string>>();

  Object.entries(input).forEach(([sourceId, targets]) => {
    targets.forEach((targetId) => {
      const current = inverted.get(targetId) ?? new Set<string>();
      current.add(sourceId);
      inverted.set(targetId, current);
    });
  });

  const output: Record<string, string[]> = {};
  for (const [key, values] of inverted.entries()) {
    output[key] = [...values].sort();
  }

  return output;
}

export function mergeMaps(...maps: Record<string, string[]>[]): Record<string, string[]> {
  const merged = new Map<string, Set<string>>();

  maps.forEach((map) => {
    Object.entries(map).forEach(([key, values]) => {
      const current = merged.get(key) ?? new Set<string>();
      values.forEach((value) => current.add(value));
      merged.set(key, current);
    });
  });

  const output: Record<string, string[]> = {};
  for (const [key, values] of merged.entries()) {
    output[key] = [...values].sort();
  }

  return output;
}

async function writeJsonFile(processedDataDir: string, fileName: string, data: unknown): Promise<void> {
  const targetPath = path.join(processedDataDir, fileName);
  await writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function latestDateFromRows(rows: CsvRow[]): string | undefined {
  return rows
    .map((row) => row.last_updated?.trim())
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => b.localeCompare(a))[0];
}

export type BuildProcessedDataOptions = {
  rawDataDir?: string;
  processedDataDir?: string;
  generatedAt?: string;
};

export type BuildProcessedDataResult = {
  validation: ValidationResult;
  buildMetadata: BuildMetadata;
};

export async function buildProcessedData(options?: BuildProcessedDataOptions): Promise<BuildProcessedDataResult> {
  const processedDataDir = options?.processedDataDir ?? DEFAULT_PROCESSED_DATA_DIR;
  const validation = await validateAllCsvData({ rawDataDir: options?.rawDataDir });
  const validationReport = buildValidationReport(validation, { generatedAt: options?.generatedAt });
  const validationReportPath = getDefaultValidationReportPath(processedDataDir);
  await writeValidationReport(validationReport, validationReportPath);

  if (validation.warnings.length > 0) {
    console.warn("CSV validation warnings:");
    validation.warnings.forEach((warning) => {
      console.warn(`- ${warning}`);
    });
  }

  if (!validation.ok) {
    console.error("CSV validation failed, processed JSON not generated:");
    validation.errors.forEach((error) => {
      console.error(`- ${error}`);
    });
    console.error(`Validation report written to ${validationReportPath}`);
    throw new Error(`CSV validation failed: ${validation.errors.join(" | ")}`);
  }

  const researchers = sortById(
    validation.tables["researchers.csv"].map((row) => ({
      id: row.researcher_id,
      fullName: row.full_name,
      title: toOptional(row.title),
      department: toOptional(row.department),
      centerProgram: toOptional(row.center_program),
      email: toOptional(row.email),
      profileUrl: toOptional(row.profile_url),
      shortBio: toOptional(row.short_bio),
      labName: toOptional(row.lab_name),
      active: toBoolean(row.active),
      lastUpdated: toOptional(row.last_updated),
    })),
  );

  const projects = sortById(
    validation.tables["projects.csv"].map((row) => ({
      id: row.project_id,
      projectName: row.project_name,
      projectType: row.project_type,
      summary: row.summary,
      status: toOptional(row.status),
      departmentOwner: toOptional(row.department_owner),
      startYear: toNumber(row.start_year),
      endYear: toNumber(row.end_year),
      projectUrl: toOptional(row.project_url),
      lastUpdated: toOptional(row.last_updated),
    })),
  );

  const datasets = sortById(
    validation.tables["datasets.csv"].map((row) => ({
      id: row.dataset_id,
      datasetName: row.dataset_name,
      datasetType: row.dataset_type,
      summary: row.summary,
      dataModality: toOptional(row.data_modality),
      accessLevel: toOptional(row.access_level),
      accessNotes: toOptional(row.access_notes),
      sampleScope: toOptional(row.sample_scope),
      datasetUrl: toOptional(row.dataset_url),
      active: toBoolean(row.active),
      lastUpdated: toOptional(row.last_updated),
    })),
  );

  const technologies = sortById(
    validation.tables["technologies.csv"].map((row) => ({
      id: row.technology_id,
      technologyName: row.technology_name,
      technologyCategory: row.technology_category,
      summary: row.summary,
      measurementFocus: toOptional(row.measurement_focus),
      vendorPlatform: toOptional(row.vendor_platform),
      technologyUrl: toOptional(row.technology_url),
      active: toBoolean(row.active),
      lastUpdated: toOptional(row.last_updated),
    })),
  );

  const diseaseAreas = sortById(
    validation.tables["disease_areas.csv"].map((row) => ({
      id: row.disease_area_id,
      diseaseAreaName: row.disease_area_name,
      diseaseGroup: toOptional(row.disease_group),
      summary: toOptional(row.summary),
      active: toBoolean(row.active),
      lastUpdated: toOptional(row.last_updated),
    })),
  );

  const researcherToDiseaseAreas = buildMap(validation.tables["researcher_disease_areas.csv"], "researcher_id", "disease_area_id");
  const researcherToTechnologies = buildMap(validation.tables["researcher_technologies.csv"], "researcher_id", "technology_id");
  const researcherToDatasets = buildMap(validation.tables["researcher_datasets.csv"], "researcher_id", "dataset_id");
  const projectToResearchers = buildMap(validation.tables["project_researchers.csv"], "project_id", "researcher_id");
  const projectToDatasets = buildMap(validation.tables["project_datasets.csv"], "project_id", "dataset_id");
  const projectToDiseaseAreas = buildMap(validation.tables["project_disease_areas.csv"], "project_id", "disease_area_id");
  const datasetToTechnologies = buildMap(validation.tables["dataset_technologies.csv"], "dataset_id", "technology_id");
  const datasetToDiseaseAreas = buildMap(validation.tables["dataset_disease_areas.csv"], "dataset_id", "disease_area_id");

  const diseaseAreaToResearchers = invertMap(researcherToDiseaseAreas);
  const technologyToResearchers = invertMap(researcherToTechnologies);
  const datasetToResearchers = invertMap(researcherToDatasets);
  const researcherToProjects = invertMap(projectToResearchers);
  const datasetToProjects = invertMap(projectToDatasets);
  const diseaseAreaToProjects = invertMap(projectToDiseaseAreas);
  const technologyToDatasets = invertMap(datasetToTechnologies);
  const diseaseAreaToDatasets = invertMap(datasetToDiseaseAreas);

  const diseaseAreaToTechnologies = mergeMaps(
    Object.fromEntries(
      Object.entries(diseaseAreaToDatasets).map(([diseaseAreaId, datasetIds]) => {
        const technologyIds = new Set<string>();
        datasetIds.forEach((datasetId) => {
          (datasetToTechnologies[datasetId] ?? []).forEach((technologyId) => technologyIds.add(technologyId));
        });
        return [diseaseAreaId, [...technologyIds]];
      }),
    ),
  );

  const technologyToDiseaseAreas = mergeMaps(
    Object.fromEntries(
      Object.entries(technologyToDatasets).map(([technologyId, datasetIds]) => {
        const diseaseAreaIds = new Set<string>();
        datasetIds.forEach((datasetId) => {
          (datasetToDiseaseAreas[datasetId] ?? []).forEach((diseaseAreaId) => diseaseAreaIds.add(diseaseAreaId));
        });
        return [technologyId, [...diseaseAreaIds]];
      }),
    ),
  );

  const relationships: RelationshipMaps = {
    researcherToDiseaseAreas,
    researcherToTechnologies,
    researcherToDatasets,
    researcherToProjects,
    projectToResearchers,
    projectToDatasets,
    projectToDiseaseAreas,
    datasetToTechnologies,
    datasetToDiseaseAreas,
    datasetToResearchers,
    datasetToProjects,
    diseaseAreaToResearchers,
    diseaseAreaToDatasets,
    diseaseAreaToProjects,
    diseaseAreaToTechnologies,
    technologyToResearchers,
    technologyToDatasets,
    technologyToDiseaseAreas,
  };

  const latestSourceUpdateDate = [
    latestDateFromRows(validation.tables["researchers.csv"]),
    latestDateFromRows(validation.tables["projects.csv"]),
    latestDateFromRows(validation.tables["datasets.csv"]),
    latestDateFromRows(validation.tables["technologies.csv"]),
    latestDateFromRows(validation.tables["disease_areas.csv"]),
  ]
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => b.localeCompare(a))[0];

  const buildMetadata: BuildMetadata = {
    generatedAt: options?.generatedAt ?? new Date().toISOString(),
    sourceFilesUsed: Object.keys(validation.tables).sort(),
    processedEntityCounts: {
      researchers: researchers.length,
      projects: projects.length,
      datasets: datasets.length,
      technologies: technologies.length,
      diseaseAreas: diseaseAreas.length,
    },
    latestSourceUpdateDate,
    validationStatus: validation.warnings.length > 0 ? "passed_with_warnings" : "passed",
    validationWarningsSummary: {
      count: validation.warnings.length,
      warnings: validation.warnings,
    },
  };

  await mkdir(processedDataDir, { recursive: true });
  await Promise.all([
    writeJsonFile(processedDataDir, "researchers.json", researchers),
    writeJsonFile(processedDataDir, "projects.json", projects),
    writeJsonFile(processedDataDir, "datasets.json", datasets),
    writeJsonFile(processedDataDir, "technologies.json", technologies),
    writeJsonFile(processedDataDir, "disease_areas.json", diseaseAreas),
    writeJsonFile(processedDataDir, "relationships.json", relationships),
    writeJsonFile(processedDataDir, "build_metadata.json", buildMetadata),
  ]);

  console.log(`Processed data written to ${processedDataDir}.`);
  return { validation, buildMetadata };
}

async function main(): Promise<void> {
  try {
    await buildProcessedData();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown build error.";
    console.error(message);
    process.exitCode = 1;
  }
}

if (typeof require !== "undefined" && require.main === module) {
  void main();
}
