import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@motion5/core": path.resolve(import.meta.dirname, "../../packages/core/src"),
    },
  },
  optimizeDeps: {
    exclude: ["@motion5/core"],
  },
});
