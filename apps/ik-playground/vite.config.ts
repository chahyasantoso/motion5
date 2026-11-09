import { defineConfig } from "vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases()],
  },
  optimizeDeps: {
    exclude: [
      "@motion5/moves",
      "@motion5/rig",
      "@motion5/dom",
      "@motion5/player",
      "@motion5/plugins",
      "@motion5/core",
      "@motion5/react",
      "@motion5/three",
    ],
  },
});
