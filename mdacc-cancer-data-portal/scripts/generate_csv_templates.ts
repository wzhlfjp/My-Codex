import { mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";
import {
  buildRawDataContractArtifact,
  CORE_TABLE_CONTRACTS,
  RELATIONSHIP_TABLE_CONTRACTS,
  type RelationshipContract,
  type TableContract,
} from "./data_contract";

const DEFAULT_TEMPLATE_DIR = path.join(process.cwd(), "data", "templates");

export function renderCsvHeader(columns: readonly string[]): string {
  return `${columns.join(",")}\n`;
}

function toFileTemplate(contract: TableContract | RelationshipContract): { fileName: string; content: string } {
  return {
    fileName: contract.fileName,
    content: renderCsvHeader(contract.columns),
  };
}

export async function generateCsvTemplates(outputDir = DEFAULT_TEMPLATE_DIR): Promise<void> {
  await mkdir(outputDir, { recursive: true });

  const templates = [...CORE_TABLE_CONTRACTS, ...RELATIONSHIP_TABLE_CONTRACTS].map(toFileTemplate);

  await Promise.all(
    templates.map((template) =>
      writeFile(path.join(outputDir, template.fileName), template.content, "utf8"),
    ),
  );

  const artifact = buildRawDataContractArtifact();
  await writeFile(
    path.join(outputDir, "raw_data_contract.json"),
    `${JSON.stringify(artifact, null, 2)}\n`,
    "utf8",
  );

  await writeFile(
    path.join(outputDir, "README.md"),
    [
      "# CSV Templates",
      "",
      "This folder is generated from `scripts/data_contract.ts`.",
      "Use these files as header templates when adding or updating `data/raw/*.csv` files.",
      "Do not edit generated templates directly; regenerate with `npm run data:templates`.",
      "",
      "- Contract artifact: `raw_data_contract.json`",
    ].join("\n"),
    "utf8",
  );
}

async function main(): Promise<void> {
  await generateCsvTemplates();
  console.log(`CSV templates generated in ${DEFAULT_TEMPLATE_DIR}.`);
}

if (typeof require !== "undefined" && require.main === module) {
  void main();
}
