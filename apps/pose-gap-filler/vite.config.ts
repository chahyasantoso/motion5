import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@motion5/core": path.resolve(import.meta.dirname, "../../packages/core/src"),
      "@motion5/three": path.resolve(import.meta.dirname, "../../packages/three/src"),
    },
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/three"],
  },
});
