import { existsSync } from "node:fs";
import { registerTsResolve } from "./ts-resolve.mjs";

const source = new URL("../src/", import.meta.url);
const fromSource = existsSync(source);

registerTsResolve();
if (fromSource) {
  const { registerSourceLoader } = await import("../../../scripts/source-loader.mjs");
  registerSourceLoader();
}

/** The `tool` function of the package whose `bin/` folder holds `binUrl`: a tool module's file URL, its TypeScript source in the repository, its built file installed. */
export function toolsOf(binUrl) {
  const here = existsSync(new URL("../src/", binUrl));
  return (module) => new URL(here ? `../src/${module}.ts` : `../dist/${module}.js`, binUrl).href;
}

/** The file URL of a tool module of this package. */
export const tool = toolsOf(import.meta.url);
