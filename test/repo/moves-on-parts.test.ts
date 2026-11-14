import { fileURLToPath } from "node:url";
import { relative } from "node:path";
import { describe, expect, it } from "vitest";
import { movesFolders, sourceFiles } from "@gerak/tools/scene";
import { code } from "./helpers/source-region";

const PIECES = fileURLToPath(new URL("../../apps/pieces/", import.meta.url));
const BUILT_IN = fileURLToPath(new URL("../../packages/moves/src/moves/", import.meta.url));
const CALL = /\bMath\s*\.\s*(?:sin|cos|exp)\b/;

describe("moves built on the laws", () => {
  it("call no Math.sin, Math.cos or Math.exp", () => {
    const files = [BUILT_IN, ...movesFolders(PIECES)].flatMap((folder) => sourceFiles(folder));
    expect(files.length).toBeGreaterThan(20);
    const offenders = files
      .filter((file) => CALL.test(code(file)))
      .map((file) => relative(fileURLToPath(new URL("../../", import.meta.url)), file));
    expect(offenders).toEqual([]);
  });
});
