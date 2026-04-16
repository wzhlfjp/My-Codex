import { access, constants, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildProcessedData, type BuildMetadata } from "../scripts/csv_to_json";

const TEMP_DIRS: string[] = [];

async function writeCsvFixture(
  rawDir: string,
  overrides?: Partial<Record<string, string>>,
): Promise<void> {
  const fixtures: Record<string, string> = {
    "researchers.csv": `researcher_id,full_name,title,department,center_program,email,profile_url,short_bio,lab_name,active,last_updated
R001,Jane Smith,Professor,Oncology,Center A,jane@example.org,https://example.org/jane,Focuses on breast cancer,Smith Lab,TRUE,2026-03-01
`,
    "projects.csv": `project_id,project_name,project_type,summary,status,department_owner,start_year,end_year,project_url,last_updated
P001,Breast Atlas Program,program,Builds breast cancer atlas,active,Oncology,2024,,,2026-02-15
`,
    "datasets.csv": `dataset_id,dataset_name,dataset_type,summary,data_modality,access_level,access_notes,sample_scope,dataset_url,active,last_updated
D001,Breast Tumor Single-Cell,single-cell,Single-cell tumor profiles,RNA,internal,Internal access only,Tumor biopsies,https://example.org/datasets/d001,TRUE,2026-02-01
`,
    "technologies.csv": `technology_id,technology_name,technology_category,summary,measurement_focus,vendor_platform,technology_url,active,last_updated
T001,Single-Cell RNA Sequencing,sequencing,Profiles RNA at single-cell resolution,Expression quantification,10x Genomics,https://example.org/tech/t001,TRUE,2026-01-20
`,
    "disease_areas.csv": `disease_area_id,disease_area_name,disease_group,summary,active,last_updated
C001,Breast Cancer,solid tumor,Breast oncology focus area,TRUE,2026-02-10
`,
    "researcher_disease_areas.csv": `researcher_id,disease_area_id,relevance_type
R001,C001,primary
`,
    "researcher_technologies.csv": `researcher_id,technology_id,usage_type
R001,T001,uses
`,
    "researcher_datasets.csv": `researcher_id,dataset_id,relationship_type
R001,D001,owner
`,
    "project_researchers.csv": `project_id,researcher_id,role
P001,R001,lead
`,
    "project_datasets.csv": `project_id,dataset_id,relationship_type
P001,D001,produces
`,
    "project_disease_areas.csv": `project_id,disease_area_id
P001,C001
`,
    "dataset_technologies.csv": `dataset_id,technology_id,relationship_type
D001,T001,generated_by
`,
    "dataset_disease_areas.csv": `dataset_id,disease_area_id
D001,C001
`,
  };

  const mergedFixtures = { ...fixtures, ...overrides };

  await Promise.all(
    Object.entries(mergedFixtures).map(([fileName, content]) => writeFile(path.join(rawDir, fileName), content, "utf8")),
  );
}

describe("pipeline integration", () => {
  afterEach(async () => {
    await Promise.all(TEMP_DIRS.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it("builds processed artifacts and metadata from a tiny raw CSV fixture", async () => {
    const tempRoot = await mkdtemp(path.join(tmpdir(), "mdacc-pipeline-"));
    TEMP_DIRS.push(tempRoot);

    const rawDir = path.join(tempRoot, "raw");
    const processedDir = path.join(tempRoot, "processed");
    await mkdir(rawDir, { recursive: true });
    await writeCsvFixture(rawDir);

    const generatedAt = "2026-04-15T00:00:00.000Z";
    const result = await buildProcessedData({
      rawDataDir: rawDir,
      processedDataDir: processedDir,
      generatedAt,
    });

    expect(result.validation.ok).toBe(true);
    expect(result.validation.warnings).toHaveLength(0);

    const [researchers, datasets, technologies, diseaseAreas, relationships, buildMetadata, validationReport] =
      await Promise.all([
      readFile(path.join(processedDir, "researchers.json"), "utf8").then((raw) => JSON.parse(raw)),
      readFile(path.join(processedDir, "datasets.json"), "utf8").then((raw) => JSON.parse(raw)),
      readFile(path.join(processedDir, "technologies.json"), "utf8").then((raw) => JSON.parse(raw)),
      readFile(path.join(processedDir, "disease_areas.json"), "utf8").then((raw) => JSON.parse(raw)),
      readFile(path.join(processedDir, "relationships.json"), "utf8").then((raw) => JSON.parse(raw)),
      readFile(path.join(processedDir, "build_metadata.json"), "utf8").then(
        (raw) => JSON.parse(raw) as BuildMetadata,
      ),
      readFile(path.join(processedDir, "validation_report.json"), "utf8").then((raw) => JSON.parse(raw)),
    ]);

    expect(researchers).toHaveLength(1);
    expect(datasets).toHaveLength(1);
    expect(technologies).toHaveLength(1);
    expect(diseaseAreas).toHaveLength(1);
    expect(relationships.researcherToDatasets.R001).toEqual(["D001"]);
    expect(relationships.datasetToTechnologies.D001).toEqual(["T001"]);
    expect(relationships.diseaseAreaToTechnologies.C001).toEqual(["T001"]);

    expect(buildMetadata.generatedAt).toBe(generatedAt);
    expect(buildMetadata.sourceFilesUsed).toHaveLength(13);
    expect(buildMetadata.processedEntityCounts).toEqual({
      researchers: 1,
      projects: 1,
      datasets: 1,
      technologies: 1,
      diseaseAreas: 1,
    });
    expect(buildMetadata.validationStatus).toBe("passed");
    expect(buildMetadata.validationWarningsSummary.count).toBe(0);
    expect(buildMetadata.latestSourceUpdateDate).toBe("2026-03-01");
    expect(validationReport.status).toBe("passed");
    expect(validationReport.summary.filesScanned).toBe(13);
  });

  it("fails build with a clear foreign-key error and does not write processed artifacts", async () => {
    const tempRoot = await mkdtemp(path.join(tmpdir(), "mdacc-pipeline-negative-"));
    TEMP_DIRS.push(tempRoot);

    const rawDir = path.join(tempRoot, "raw");
    const processedDir = path.join(tempRoot, "processed");
    await mkdir(rawDir, { recursive: true });
    await writeCsvFixture(rawDir, {
      "dataset_technologies.csv": `dataset_id,technology_id,relationship_type
D001,T999,generated_by
`,
    });

    await expect(
      buildProcessedData({
        rawDataDir: rawDir,
        processedDataDir: processedDir,
        generatedAt: "2026-04-15T00:00:00.000Z",
      }),
    ).rejects.toThrow(
      "[dataset_technologies.csv] Row 2 has missing foreign key technology_id=T999; target technologies.csv.technology_id not found",
    );

    await expect(access(path.join(processedDir, "build_metadata.json"), constants.F_OK)).rejects.toThrow();
    await expect(access(path.join(processedDir, "relationships.json"), constants.F_OK)).rejects.toThrow();
  });
});
