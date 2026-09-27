import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      {
        // The declared plugin subpaths of packages/core/package.json, and only those, resolve to
        // source; a string alias for the bare package name below would otherwise swallow them.
        find: /^@motion5\/core\/plugins\/(transform|fk|ik|transform3d|fk3d|ik3d)$/,
        replacement: path.resolve(import.meta.dirname, "packages/core/src/plugins/$1.ts"),
      },
      {
        find: "@motion5/core/adapters",
        replacement: path.resolve(import.meta.dirname, "packages/core/src/adapters/index.ts"),
      },
      {
        find: "@motion5/core/internal",
        replacement: path.resolve(import.meta.dirname, "packages/core/src/internal.ts"),
      },
      {
        find: "@motion5/core",
        replacement: path.resolve(import.meta.dirname, "packages/core/src/index.ts"),
      },
      {
        find: "@motion5/react",
        replacement: path.resolve(import.meta.dirname, "packages/react/src/index.ts"),
      },
    ],
  },
  optimizeDeps: {
    exclude: ["@motion5/core", "@motion5/react"],
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
