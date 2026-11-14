import { readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { code } from "./helpers/source-region";

const SRC = resolve(
  new URL("../../packages/moves/src/", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"),
);

/** Each layer's folder and its height; a file imports only from its own height or lower. */
const LAYERS: readonly (readonly [string, number])[] = [
  ["fields", 1],
  ["parts", 2],
  ["moves", 3],
  ["compose", 4],
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

/** Every import of a higher layer's folder: `file imports target`. */
function climbs(files: readonly string[], read: (file: string) => string): readonly string[] {
  const found: string[] = [];
  for (const file of files) {
    if (relative(SRC, file) === "index.ts") continue;
    for (const [, specifier = ""] of read(file).matchAll(/from\s+"(\.{1,2}\/[^"]+)"/g)) {
      const target = resolve(dirname(file), `${specifier}.ts`);
      if (heightOf(target) > heightOf(file))
        found.push(`${relative(SRC, file)} imports ${relative(SRC, target)}`);
    }
  }
  return found;
}

describe("the layers of @gerak/moves", () => {
  it("never import from a higher layer's folder: fields, then parts, then moves, then compose", () => {
    expect(climbs(filesOf(SRC), (file) => code(file))).toEqual([]);
  });

  it("refuses a field that imports a part, as a 3D blend left in fields/ would", () => {
    const field = join(SRC, "fields", "mix3d.ts");
    expect(climbs([field], () => 'import { mix } from "../parts/blends/mix";')).toEqual([
      `${join("fields", "mix3d.ts")} imports ${join("parts", "blends", "mix.ts")}`,
    ]);
  });
});
