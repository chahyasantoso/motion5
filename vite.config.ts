import { defineConfig } from "vitest/config";
import path from "node:path";
import { pluginSourceAliases } from "./scripts/plugin-source-aliases.mjs";

export default defineConfig({
  resolve: {
    alias: [
      ...pluginSourceAliases(),
      {
        find: "@motion5/core/adapters",
        replacement: path.resolve(import.meta.dirname, "packages/core/src/adapters/index.ts"),
      },
      {
        find: "@motion5/core/internal",
        replacement: path.resolve(import.meta.dirname, "packages/core/src/internal.ts"),
      },
      {
        find: "@motion5/core/plugin-api",
        replacement: path.resolve(import.meta.dirname, "packages/core/src/plugin-api.ts"),
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
