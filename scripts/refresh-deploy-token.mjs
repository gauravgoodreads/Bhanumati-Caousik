import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const envPath = resolve(import.meta.dirname, "..", ".env");
const envLines = (await readFile(envPath, "utf8")).split("\n");
const env = Object.fromEntries(
  envLines
    .map((line) => line.match(/^\s*([^#][^=]*?)\s*=\s*(.*)$/))
    .filter(Boolean)
    .map((match) => [match[1].trim(), match[2].trim()]),
);

const projectId = env.SANITY_PROJECT_ID || "gmm8mjbz";
const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`, {
  method: "POST",
  headers: { Authorization: `Bearer ${env.SANITY_EDITOR_TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ label: `studio-deploy-${Date.now()}`, roleName: "developer" }),
});

const data = await response.json();
if (!data.key) {
  console.error("Failed to create deploy token", JSON.stringify(data).slice(0, 200));
  process.exit(1);
}

let content = await readFile(envPath, "utf8");
if (/^SANITY_DEPLOY_TOKEN=/m.test(content)) {
  content = content.replace(/^SANITY_DEPLOY_TOKEN=.*/m, `SANITY_DEPLOY_TOKEN=${data.key}`);
} else {
  content += `\nSANITY_DEPLOY_TOKEN=${data.key}`;
}
await writeFile(envPath, content);
console.log("SANITY_DEPLOY_TOKEN updated");
