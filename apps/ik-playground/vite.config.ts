import { defineConfig } from "vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases("plugins", "core", "react", "three")],
  },
  optimizeDeps: {
    exclude: ["@motion5/plugins", "@motion5/core", "@motion5/react", "@motion5/three"],
  },
});
