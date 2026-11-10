import { defineConfig } from "vite";
import { motionLivePlugin } from "@gerak/tools/vite";
import { workspaceSourceAliases } from "../../scripts/workspace-source-aliases.mjs";

export default defineConfig({
  plugins: [motionLivePlugin()],
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
