import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@motion5/core": path.resolve(import.meta.dirname, "../../packages/core/src"),
      "@motion5/react": path.resolve(import.meta.dirname, "../../packages/react/src"),
      "@motion5/three": path.resolve(import.meta.dirname, "../../packages/three/src"),
    },
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/react", "@motion5/three"],
  },
});
