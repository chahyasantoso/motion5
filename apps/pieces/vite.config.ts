import { defineConfig } from "vite";
import {
  builtInMovesPlugin,
  workspaceSourceAliases,
} from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  plugins: [builtInMovesPlugin()],
  resolve: {
    alias: [...workspaceSourceAliases()],
  },
  optimizeDeps: {
    exclude: [
      "@gerak/moves",
      "@gerak/core",
      "@gerak/rig",
      "@gerak/rig-three",
      "@gerak/moves-tools",
      "@gerak/dom",
      "@gerak/player",
      "@gerak/physics",
      "@gerak/rapier",
      "@gerak/react",
    ],
  },
});
