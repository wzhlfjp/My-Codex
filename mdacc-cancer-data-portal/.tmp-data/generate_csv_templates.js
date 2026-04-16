"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCsvHeader = renderCsvHeader;
exports.generateCsvTemplates = generateCsvTemplates;
const promises_1 = require("node:fs/promises");
const path = require("node:path");
const data_contract_1 = require("./data_contract");
const DEFAULT_TEMPLATE_DIR = path.join(process.cwd(), "data", "templates");
function renderCsvHeader(columns) {
    return `${columns.join(",")}\n`;
}
function toFileTemplate(contract) {
    return {
        fileName: contract.fileName,
        content: renderCsvHeader(contract.columns),
    };
}
async function generateCsvTemplates(outputDir = DEFAULT_TEMPLATE_DIR) {
    await (0, promises_1.mkdir)(outputDir, { recursive: true });
    const templates = [...data_contract_1.CORE_TABLE_CONTRACTS, ...data_contract_1.RELATIONSHIP_TABLE_CONTRACTS].map(toFileTemplate);
    await Promise.all(templates.map((template) => (0, promises_1.writeFile)(path.join(outputDir, template.fileName), template.content, "utf8")));
    const artifact = (0, data_contract_1.buildRawDataContractArtifact)();
    await (0, promises_1.writeFile)(path.join(outputDir, "raw_data_contract.json"), `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
    await (0, promises_1.writeFile)(path.join(outputDir, "README.md"), [
        "# CSV Templates",
        "",
        "This folder is generated from `scripts/data_contract.ts`.",
        "Use these files as header templates when adding or updating `data/raw/*.csv` files.",
        "Do not edit generated templates directly; regenerate with `npm run data:templates`.",
        "",
        "- Contract artifact: `raw_data_contract.json`",
    ].join("\n"), "utf8");
}
async function main() {
    await generateCsvTemplates();
    console.log(`CSV templates generated in ${DEFAULT_TEMPLATE_DIR}.`);
}
if (typeof require !== "undefined" && require.main === module) {
    void main();
}
