import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { compileScene, formatStageError, isScene } from "@gerak/stage";
import { describe, expect, it } from "vitest";

const PIECES = join(import.meta.dirname, "..", "..", "apps", "pieces");

function isStagePiece(source: string): boolean {
  return source.includes("sceneBuilder(") && source.includes("export default");
}

/** Every builder piece, past the scratch pieces browser tests write and delete while this runs. */
function stagePieces(): string[] {
  return readdirSync(PIECES, { withFileTypes: true })
    .filter((brief) => brief.isDirectory() && !brief.name.includes("scratch"))
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
    for (const builder of [
      "launch-day.ts",
      "saved.ts",
      "yuzu.ts",
      "yuzu-3d.ts",
      "overlay3d-scene.ts",
    ])
      expect(files.some((file) => file.endsWith(builder))).toBe(true);
    const failures: string[] = [];
    for (const file of files) {
      const module: unknown = await import(pathToFileURL(file).href);
      const scene: unknown = Reflect.get(Object(module), "default");
      if (!isScene(scene)) {
        failures.push(`${file}: no scene`);
        continue;
      }
      const compiled = compileScene(scene);
      if (!compiled.ok)
        failures.push(`${file}: ${compiled.errors.map(formatStageError).join("; ")}`);
    }
    expect(failures).toEqual([]);
  });
});
