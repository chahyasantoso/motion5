import { existsSync } from "node:fs";

const fromSource = existsSync(new URL("../src/", import.meta.url));
if (fromSource) {
  const { registerSourceLoader } = await import("../../../scripts/source-loader.mjs");
  registerSourceLoader();
}

/** The file URL of a tool module of this package, TypeScript source in the repository, built file installed. */
export const tool = (module) =>
  new URL(fromSource ? `../src/${module}.ts` : `../dist/${module}.js`, import.meta.url).href;
