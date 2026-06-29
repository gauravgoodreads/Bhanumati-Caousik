import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  base: "/Bhanumati-Caousik/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/worker": {
        target: "https://multi-tenant-platform.gauravgoodreads.workers.dev",
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/worker/, ""),
        headers: {
          Origin: "https://gauravgoodreads.github.io",
        },
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
