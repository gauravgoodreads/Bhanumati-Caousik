import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const token = process.env.SANITY_EDITOR_TOKEN;
if (!token) {
  console.error("Set SANITY_EDITOR_TOKEN before running this script.");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const filesToPatch = [
  "client/src/lib/config.ts",
  "sanity.cli.ts",
  "studio/sanity.config.ts",
  "worker/src/index.ts",
];

const response = await fetch("https://api.sanity.io/v2021-06-07/projects", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ displayName: "Bhanumati Caousik" }),
});

if (!response.ok) {
  const text = await response.text();
  console.error("Failed to create Sanity project:", response.status, text.slice(0, 200));
  process.exit(1);
}

const project = await response.json();
const projectId = project.id;
console.log("Created Sanity project:", projectId);

const datasetResponse = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/datasets/production`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ aclMode: "public" }),
});
if (!datasetResponse.ok) {
  const text = await datasetResponse.text();
  console.error("Failed to create dataset:", datasetResponse.status, text.slice(0, 200));
  process.exit(1);
}
console.log("Created production dataset");

for (const relativePath of filesToPatch) {
  const filePath = resolve(root, relativePath);
  const content = await readFile(filePath, "utf8");
  const updated = content.replaceAll("PLACEHOLDER_SANITY_ID", projectId);
  await writeFile(filePath, updated);
  console.log("Patched", relativePath);
}

console.log("Done. Run: npm run studio:deploy && SANITY_EDITOR_TOKEN=<token> SANITY_PROJECT_ID=" + projectId + " node scripts/seed-sanity.mjs");
