import { configDefaults, defineConfig } from "vitest/config";
import { workspaceSourceAliases } from "./scripts/workspace-source-aliases.mjs";
import { pendingPaths } from "./test/pending.mjs";

// An agent, a pipe and a log viewer parse no escape sequences, and every one of them is a byte on
// the output `npm run metrics` measures. A terminal keeps its colours.
if (!process.stdout.isTTY) process.env.NO_COLOR ??= "1";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases("plugins", "core", "react")],
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/react", "@motion5/plugins"],
  },
  test: {
    // The quiet reporter: a green run states its counts, and a red one still prints every
    // assertion diff. `--reporter=default` is the human view, and CI names its own reporters.
    reporters: ["agent"],
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
