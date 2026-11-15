import { existsSync } from "node:fs";

const source = new URL("../src/", import.meta.url);
const fromSource = existsSync(source);

if (fromSource) {
  const { registerSourceLoader } = await import("../../../scripts/source-loader.mjs");
  registerSourceLoader();
}

/** The file URL of a tool module: its TypeScript source in the repository, its built file installed. */
export function tool(module) {
  const target = fromSource ? `../src/${module}.ts` : `../dist/${module}.js`;
  return new URL(target, import.meta.url).href;
}
