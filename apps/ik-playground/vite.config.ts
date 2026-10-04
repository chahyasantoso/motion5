import { defineConfig } from "vite";
import path from "node:path";
import { pluginSourceAliases } from "../../scripts/plugin-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [
      ...pluginSourceAliases(),
      {
        find: "@motion5/core",
        replacement: path.resolve(import.meta.dirname, "../../packages/core/src"),
      },
      {
        find: "@motion5/react",
        replacement: path.resolve(import.meta.dirname, "../../packages/react/src"),
      },
      {
        find: "@motion5/three",
        replacement: path.resolve(import.meta.dirname, "../../packages/three/src"),
      },
    ],
  },
  optimizeDeps: {
    exclude: ["@motion5/plugins", "@motion5/core", "@motion5/react", "@motion5/three"],
  },
});
