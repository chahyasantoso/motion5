import { defineConfig } from "vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases("moves", "rig", "plugins", "core", "react")],
  },
  optimizeDeps: {
    exclude: [
      "@motion5/moves",
      "@motion5/rig",
      "@motion5/plugins",
      "@motion5/core",
      "@motion5/react",
    ],
  },
});
