import { defineConfig } from "vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases()],
  },
  optimizeDeps: {
    exclude: [
      "@gerak/moves",
      "@gerak/rig",
      "@gerak/dom",
      "@gerak/player",
      "@gerak/physics",
      "@gerak/rapier",
      "@gerak/react",
    ],
  },
});
