import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  briefFolders,
  importSpecifiers,
  movesFolders,
  portabilityFindings,
  sourceFiles,
} from "@gerak/tools/scene";

const ROOT = fileURLToPath(new URL("../../apps/pieces/", import.meta.url));
function moveFiles(): readonly string[] {
  return movesFolders(ROOT).flatMap((folder) => sourceFiles(folder));
}

describe("a brief's own moves", () => {
  it("are found in the briefs that hold them", () => {
    expect(briefFolders(ROOT)).toEqual(expect.arrayContaining(["penguin", "showreel"]));
    expect(moveFiles().length).toBeGreaterThan(0);
  });

  it("import only @gerak/moves and their own folder's parts", () => {
    expect(portabilityFindings(ROOT)).toEqual([]);
  });

  it("reads every import form's specifier", () => {
    const source = `import { a } from "./other";\nexport { b } from "@gerak/moves";\nawait import("../x");`;
    expect(importSpecifiers(source)).toEqual(["./other", "@gerak/moves", "../x"]);
  });
});
