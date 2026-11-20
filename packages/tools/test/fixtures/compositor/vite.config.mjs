import { workspaceSourceAliases } from "../../../../../scripts/workspace-source-aliases.mjs";

export default {
  resolve: { alias: [...workspaceSourceAliases()] },
  optimizeDeps: { exclude: ["@gerak/core", "@gerak/stage", "@gerak/dom", "@gerak/player"] },
};
