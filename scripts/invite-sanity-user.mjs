import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const email = process.argv[2] || "garyphadale@gmail.com";
const projectId = process.argv[3] || "gmm8mjbz";

const envPath = resolve(import.meta.dirname, "..", ".env");
const env = Object.fromEntries(
  (await readFile(envPath, "utf8"))
    .split("\n")
    .map((line) => line.match(/^\s*([^#][^=]*?)\s*=\s*(.*)$/))
    .filter(Boolean)
    .map((match) => [match[1].trim(), match[2].trim()]),
);

const token = env.SANITY_EDITOR_TOKEN;
if (!token) throw new Error("SANITY_EDITOR_TOKEN required in .env");

const endpoints = [
  {
    name: "access-api",
    url: `https://api.sanity.io/v2025-07-11/access/project/${projectId}/invites`,
    body: { email, roleNames: ["administrator"] },
  },
  {
    name: "legacy-invitations",
    url: `https://api.sanity.io/v2021-06-07/invitations/project/${projectId}`,
    body: { email, role: "administrator" },
  },
];

for (const endpoint of endpoints) {
  const response = await fetch(endpoint.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(endpoint.body),
  });
  const text = await response.text();
  console.log(`${endpoint.name}: ${response.status} ${text.slice(0, 200)}`);
  if (response.ok) break;
}
