import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { briefFolders, movesFolders, sourceFiles } from "@gerak/tools/scene";

const ROOT = fileURLToPath(new URL("../../apps/pieces/", import.meta.url));
const SPECIFIER = /\b(?:from|import)\s*\(?\s*["']([^"']+)["']/g;

function specifiersOf(source: string): readonly string[] {
  return [...source.matchAll(SPECIFIER)].map(([, specifier = ""]) => specifier);
}

function moveFiles(): readonly string[] {
  return movesFolders(ROOT).flatMap((folder) => sourceFiles(folder));
}

describe("a brief's own moves", () => {
  it("are found in the briefs that hold them", () => {
    expect(briefFolders(ROOT)).toEqual(expect.arrayContaining(["penguin", "showreel"]));
    expect(moveFiles().length).toBeGreaterThan(0);
  });

  it("import only @gerak/moves", () => {
    const offenders = moveFiles().flatMap((file) =>
      specifiersOf(readFileSync(file, "utf8"))
        .filter((specifier) => specifier !== "@gerak/moves")
        .map((specifier) => `${relative(ROOT, file)} imports ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });

  it("reads every import form's specifier", () => {
    const source = `import { a } from "./other";\nexport { b } from "@gerak/moves";\nawait import("../x");`;
    expect(specifiersOf(source)).toEqual(["./other", "@gerak/moves", "../x"]);
  });
});
