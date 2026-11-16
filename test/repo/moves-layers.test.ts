import { existsSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { code } from "./helpers/source-region";

const SRC = resolve(
  new URL("../../packages/moves/src/", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"),
);

/** Each layer's folder and its height; a file imports only from its own height or lower. */
const LAYERS: readonly (readonly [string, number])[] = [
  ["style", 1],
  ["parts", 2],
  ["moves", 3],
];

function filesOf(folder: string): readonly string[] {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesOf(join(folder, entry.name))
      : entry.name.endsWith(".ts")
        ? [join(folder, entry.name)]
        : [],
  );
}

/** The layer height of a file under `src`, or 0 for the shared files at its root. */
function heightOf(file: string): number {
  const top = relative(SRC, file).split(/[\\/]/)[0] ?? "";
  return LAYERS.find(([folder]) => folder === top)?.[1] ?? 0;
}

/** A relative specifier in `from "./x"`, `import "./x"` or `import("./x")`. */
const IMPORT = /(?:from|import)\s*\(?\s*"(\.{1,2}\/[^"]+)"/g;

/** The file a specifier names: `x.ts`, or for a folder its `index.ts`, so the folder's layer counts; its `.js`
 * or `.ts` ending dropped. */
function targetOf(folder: string, specifier: string): string {
  const path = resolve(folder, specifier.replace(/\.(?:js|ts)$/, ""));
  if (existsSync(`${path}.ts`)) return `${path}.ts`;
  if (existsSync(path)) return join(path, "index.ts");
  return `${path}.ts`;
}

/** Every import of a higher layer's folder: `file imports target`. */
function climbs(files: readonly string[], read: (file: string) => string): readonly string[] {
  const found: string[] = [];
  for (const file of files) {
    if (relative(SRC, file) === "index.ts") continue;
    for (const [, specifier = ""] of read(file).matchAll(IMPORT)) {
      const target = targetOf(dirname(file), specifier);
      const named = `${relative(SRC, file)} imports ${relative(SRC, target)}`;
      if (relative(SRC, target) === "index.ts")
        found.push(`${named}, which re-exports every layer`);
      else if (heightOf(target) > heightOf(file)) found.push(named);
    }
  }
  return found;
}

describe("the layers of @gerak/moves", () => {
  it("never import from a higher layer's folder: style, then parts, then moves", () => {
    expect(climbs(filesOf(SRC), (file) => code(file))).toEqual([]);
  });

  it("refuses a style file that imports a part, as a quality built on an ease would", () => {
    const style = join(SRC, "style", "qualities.ts");
    expect(climbs([style], () => 'import { ease } from "../parts/ease/ease";')).toEqual([
      `${join("style", "qualities.ts")} imports ${join("parts", "ease", "ease.ts")}`,
    ]);
  });

  it("reads a side-effect import, a dynamic import, a folder and a .js ending, and refuses the package's index", () => {
    const field = join(SRC, "style", "qualities.ts");
    const imports = [
      'import "../parts/blend/mix";',
      'const later = import("../moves/drop");',
      'import { definePart } from "../parts";',
      'import { mix } from "../parts/blend/mix.js";',
      'import { combine } from "../index";',
    ].join("\n");
    const found = climbs([field], () => imports);
    expect(found).toEqual([
      `${join("style", "qualities.ts")} imports ${join("parts", "blend", "mix.ts")}`,
      `${join("style", "qualities.ts")} imports ${join("moves", "drop.ts")}`,
      `${join("style", "qualities.ts")} imports ${join("parts", "index.ts")}`,
      `${join("style", "qualities.ts")} imports ${join("parts", "blend", "mix.ts")}`,
      `${join("style", "qualities.ts")} imports index.ts, which re-exports every layer`,
    ]);
  });
});
