import { describe, expect, it } from "vitest";
import {
  buildRawDataContractArtifact,
  CORE_TABLE_CONTRACTS,
  getAllRawCsvFileNames,
  RELATIONSHIP_TABLE_CONTRACTS,
} from "../scripts/data_contract";

describe("raw data contract", () => {
  it("defines unique file names across core and relationship tables", () => {
    const fileNames = getAllRawCsvFileNames();
    const unique = new Set(fileNames);
    expect(unique.size).toBe(fileNames.length);
  });

  it("exposes a machine-readable artifact with sorted file list", () => {
    const artifact = buildRawDataContractArtifact();

    expect(artifact.coreTables).toHaveLength(CORE_TABLE_CONTRACTS.length);
    expect(artifact.relationshipTables).toHaveLength(RELATIONSHIP_TABLE_CONTRACTS.length);
    expect(artifact.allFileNames).toEqual([...artifact.allFileNames].sort());
    expect(artifact.allFileNames).toContain("researchers.csv");
    expect(artifact.allFileNames).toContain("dataset_technologies.csv");
  });
});
