import { defineConfig } from "vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases("moves", "plugins", "core", "three")],
  },
  optimizeDeps: {
    exclude: ["@motion5/moves", "@motion5/plugins", "@motion5/core", "@motion5/three"],
  },
});
