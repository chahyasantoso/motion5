// The test files that start a page server; vite.config.ts runs them one at a time.
export const BROWSER_TESTS = [
  "**/*-browser.test.ts",
  "packages/tools/test/import-svg.test.ts",
  "packages/tools/test/motion-new.test.ts",
];
