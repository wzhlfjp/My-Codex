import { describe, expect, it } from "vitest";
import {
  getBuildMetadata,
  getDatasetDetailById,
  getPortalData,
  getPortalSnapshot,
  getProjectDetailById,
  getResearcherDetailById,
} from "@/lib/data/processed-data";

describe("processed-data utilities", () => {
  it("loads processed portal data with core entities", async () => {
    const data = await getPortalData();
    expect(data.researchers.length).toBeGreaterThan(0);
    expect(data.datasets.length).toBeGreaterThan(0);
    expect(data.technologies.length).toBeGreaterThan(0);
    expect(data.diseaseAreas.length).toBeGreaterThan(0);
  });

  it("loads build metadata and exposes aligned snapshot counts", async () => {
    const [metadata, snapshot] = await Promise.all([getBuildMetadata(), getPortalSnapshot()]);
    expect(metadata).not.toBeNull();
    expect(snapshot.researcherCount).toBe(metadata?.processedEntityCounts.researchers);
    expect(snapshot.projectCount).toBe(metadata?.processedEntityCounts.projects);
    expect(snapshot.datasetCount).toBe(metadata?.processedEntityCounts.datasets);
    expect(snapshot.technologyCount).toBe(metadata?.processedEntityCounts.technologies);
    expect(snapshot.diseaseAreaCount).toBe(metadata?.processedEntityCounts.diseaseAreas);
    expect(snapshot.buildGeneratedAt).toBe(metadata?.generatedAt);
  });

  it("returns null for missing detail IDs (smoke for route data path)", async () => {
    await expect(getResearcherDetailById("R_DOES_NOT_EXIST")).resolves.toBeNull();
    await expect(getProjectDetailById("P_DOES_NOT_EXIST")).resolves.toBeNull();
    await expect(getDatasetDetailById("D_DOES_NOT_EXIST")).resolves.toBeNull();
  });
});
