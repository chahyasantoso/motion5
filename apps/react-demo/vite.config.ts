import { defineConfig } from "vite";
import { motionLivePlugin } from "@motion5/tools/vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  plugins: [motionLivePlugin()],
  resolve: {
    alias: [...workspaceSourceAliases()],
  },
  optimizeDeps: {
    exclude: [
      "@motion5/moves",
      "@motion5/rig",
      "@motion5/dom",
      "@motion5/player",
      "@motion5/physics",
      "@motion5/rapier",
      "@motion5/react",
    ],
  },
});
