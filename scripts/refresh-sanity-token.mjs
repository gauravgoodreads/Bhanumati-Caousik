import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const orgToken = process.env.SANITY_EDITOR_TOKEN;
const projectId = process.env.SANITY_PROJECT_ID || "gmm8mjbz";
if (!orgToken) throw new Error("SANITY_EDITOR_TOKEN required");

const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/tokens`, {
  method: "POST",
  headers: { Authorization: `Bearer ${orgToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({ label: `seed-${Date.now()}`, roleName: "editor" }),
});

const data = await response.json();
if (!data.key) {
  console.error("Token creation failed", JSON.stringify(data).slice(0, 200));
  process.exit(1);
}

const envPath = resolve(import.meta.dirname, "..", ".env");
let env = await readFile(envPath, "utf8");
env = env.replace(/^SANITY_EDITOR_TOKEN=.*/m, `SANITY_EDITOR_TOKEN=${data.key}`);
env = env.replace(/^SANITY_PROJECT_ID=.*/m, `SANITY_PROJECT_ID=${projectId}`);
await writeFile(envPath, env);
console.log("Updated .env with project-scoped editor token");
