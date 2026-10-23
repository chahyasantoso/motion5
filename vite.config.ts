import { configDefaults, defineConfig } from "vitest/config";
import { workspaceSourceAliases } from "./scripts/workspace-source-aliases.mjs";
import { pendingPaths } from "./test/pending.mjs";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases("plugins", "core", "react")],
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/react", "@motion5/plugins"],
  },
  test: {
    // CPU-heavy seeded tests exceed 5s on Windows.
    testTimeout: 30000,
    setupFiles: ["./test/setup.ts"],
    // The one exclusion list, read from the same ledger the guard test checks. The defaults stay
    // in front of it so a pending entry can only ever remove a test, never add a search root.
    exclude: [...configDefaults.exclude, ...pendingPaths()],
    // React 19 only exports `act` from its development build. `react-test-renderer` re-exports
    // `React.act`, so an ambient `NODE_ENV=production` resolves it to `undefined` and every React
    // test fails with `act is not a function`. Pin the test environment instead of depending on
    // the shell that ran Vitest.
    env: { NODE_ENV: "development" },
  },
});
