import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { compileStage, formatStageError } from "@gerak/stage";
import { describe, expect, it } from "vitest";

const PIECES = join(import.meta.dirname, "..", "..", "apps", "pieces");

const DEFAULTS = ["export default defineStage", "export default sceneBuilder("];

function isStagePiece(source: string): boolean {
  return DEFAULTS.some((start) => source.includes(start));
}

function stagePieces(): string[] {
  return readdirSync(PIECES, { withFileTypes: true })
    .filter((brief) => brief.isDirectory())
    .flatMap((brief) => {
      const src = join(PIECES, brief.name, "src");
      let names: string[] = [];
      try {
        names = readdirSync(src);
      } catch {
        return [];
      }
      return names
        .filter((name) => name.endsWith(".ts"))
        .map((name) => join(src, name))
        .filter((file) => isStagePiece(readFileSync(file, "utf8")));
    })
    .sort();
}

describe("stage pieces", () => {
  it("every piece under apps/pieces compiles", async () => {
    const files = stagePieces();
    expect(files.length).toBeGreaterThan(0);
    for (const builder of ["shop.ts", "nowplaying.ts", "nadi.ts", "showreel-e.ts"])
      expect(files.some((file) => file.endsWith(builder))).toBe(true);
    const failures: string[] = [];
    for (const file of files) {
      const module: unknown = await import(pathToFileURL(file).href);
      const compiled = compileStage(Reflect.get(Object(module), "default"));
      if (!compiled.ok)
        failures.push(`${file}: ${compiled.errors.map(formatStageError).join("; ")}`);
    }
    expect(failures).toEqual([]);
  });
});
