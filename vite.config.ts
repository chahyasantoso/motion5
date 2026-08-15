import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@motion5/core/internal", replacement: path.resolve(import.meta.dirname, "packages/core/src/internal.ts") },
      { find: "@motion5/core", replacement: path.resolve(import.meta.dirname, "packages/core/src/index.ts") },
      { find: "@motion5/react", replacement: path.resolve(import.meta.dirname, "packages/react/src/index.ts") },
    ],
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/react"],
  },
});
