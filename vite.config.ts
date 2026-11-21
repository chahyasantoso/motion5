import { configDefaults, defineConfig } from "vitest/config";
import { workspaceSourceAliases } from "./scripts/workspace-source-aliases.mjs";
import { pendingPaths } from "./test/pending.mjs";
import { BROWSER_TESTS } from "./test/browser-tests.mjs";

// An agent, a pipe and a log viewer parse no escape sequences, and every one of them is a byte on
// the output `npm run metrics` measures. A terminal keeps its colours.
if (!process.stdout.isTTY) process.env.NO_COLOR ??= "1";

export default defineConfig({
  resolve: {
    alias: [...workspaceSourceAliases()],
  },
  optimizeDeps: {
    exclude: [
      "@gerak/core",
      "@gerak/react",
      "@gerak/moves",
      "@gerak/rig",
      "@gerak/rig-three",
      "@gerak/dom",
      "@gerak/player",
    ],
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
    // An agent's worktree under `.claude` is another checkout, with tests of its own that are not this tree's.
    exclude: [...configDefaults.exclude, "**/.claude/**", ...pendingPaths()],
    // React 19 only exports `act` from its development build. `react-test-renderer` re-exports
    // `React.act`, so an ambient `NODE_ENV=production` resolves it to `undefined` and every React
    // test fails with `act is not a function`. Pin the test environment instead of depending on
    // the shell that ran Vitest.
    env: { NODE_ENV: "development" },
    // Page servers on one pieces folder reload each other's pages when a test writes a scratch piece,
    // so the files that start one run one at a time, beside the parallel rest.
    projects: [
      { extends: true, test: { name: "unit", exclude: [...BROWSER_TESTS] } },
      {
        extends: true,
        test: { name: "browser", include: [...BROWSER_TESTS], fileParallelism: false },
      },
    ],
  },
});
