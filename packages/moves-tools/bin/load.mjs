import { existsSync } from "node:fs";

const here = existsSync(new URL("../src/", import.meta.url));

/** The file URL of a tool module of this package, TypeScript source in the repository, built file installed. */
export const tool = (module) =>
  new URL(here ? `../src/${module}.ts` : `../dist/${module}.js`, import.meta.url).href;
