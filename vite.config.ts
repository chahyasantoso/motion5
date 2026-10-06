import { defineConfig } from "vitest/config";
import { workspaceSourceAliases } from "./scripts/workspace-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases("plugins", "core", "react")],
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/react", "@motion5/plugins"],
  },
  test: {
    setupFiles: ["./test/setup.ts"],
    // React 19 only exports `act` from its development build. `react-test-renderer` re-exports
    // `React.act`, so an ambient `NODE_ENV=production` resolves it to `undefined` and every React
    // test fails with `act is not a function`. Pin the test environment instead of depending on
    // the shell that ran Vitest.
    env: { NODE_ENV: "development" },
  },
});
