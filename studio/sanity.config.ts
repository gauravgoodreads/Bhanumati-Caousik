import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "bhanumati-caousik",
  title: "Bhanumati Caousik",
  projectId: "gmm8mjbz",
  dataset: "production",
  basePath: "/Bhanumati-Caousik/studio-pages",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
