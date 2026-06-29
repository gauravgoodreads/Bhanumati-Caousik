import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const studioOut = resolve(root, "studio-dist");
const pagesDir = resolve(root, "studio-pages");

await rm(studioOut, { recursive: true, force: true });
execSync(`npx sanity build "${studioOut}" --yes`, { cwd: root, stdio: "inherit", env: process.env });

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });
await cp(studioOut, pagesDir, { recursive: true });
await writeFile(resolve(pagesDir, ".nojekyll"), "");
console.log("Studio static files copied to studio-pages/ for GitHub Pages");
