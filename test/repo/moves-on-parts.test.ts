import { fileURLToPath } from "node:url";
import { relative } from "node:path";
import { describe, expect, it } from "vitest";
import { movesFolders, sourceFiles } from "@gerak/tools/scene";
import { code } from "./helpers/source-region";

const PIECES = fileURLToPath(new URL("../../apps/pieces/", import.meta.url));
const BUILT_IN = fileURLToPath(new URL("../../packages/moves/src/moves/", import.meta.url));
/** What shapes motion instead of a part: a sine, cosine, tangent or exponential, read in any spelling. */
const CALL = /\bMath\s*(?:\.\s*(?:sin|cos|tan|sinh|cosh|tanh|exp|expm1|pow)\b|\[)|\}\s*=\s*Math\b/;

describe("moves built on the laws", () => {
  it("call no sine, cosine, tangent or exponential of Math, in any spelling", () => {
    const files = [BUILT_IN, ...movesFolders(PIECES)].flatMap((folder) => sourceFiles(folder));
    expect(files.length).toBeGreaterThan(20);
    const offenders = files
      .filter((file) => CALL.test(code(file)))
      .map((file) => relative(fileURLToPath(new URL("../../", import.meta.url)), file));
    expect(offenders).toEqual([]);
  });

  it("catches the spellings that dodge the plain name", () => {
    for (const text of [
      "Math.sin(p)",
      "Math.tan(p)",
      "Math.pow(Math.E, p)",
      'Math["sin"](p)',
      "const { sin } = Math;",
      "Math.sinh(p)",
    ])
      expect(CALL.test(text), text).toBe(true);
    for (const text of ["Math.atan2(y, x)", "Math.hypot(x, y)", "const top = Math.max(a, b);"])
      expect(CALL.test(text), text).toBe(false);
  });
});
