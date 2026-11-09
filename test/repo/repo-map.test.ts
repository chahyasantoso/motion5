import { describe, expect, it } from "vitest";
import { checkMap, mapProblems, render } from "../../../../../scripts/repo-map.mjs";

const OWNERS = { "packages/a/src": "the a entry", "packages/a/src/b": "the b part" };

describe("source map", () => {
  it("is current for the real repository", () => {
    expect(checkMap()).toEqual([]);
  });

  it("names a source folder with no line", () => {
    expect(mapProblems(["packages/a/src", "packages/a/src/b", "apps/c/src"], OWNERS)).toEqual([
      "apps/c/src: source folder with no line in OWNERS",
    ]);
  });

  it("names a line whose folder is gone", () => {
    expect(mapProblems(["packages/a/src"], OWNERS)).toEqual([
      "packages/a/src/b: OWNERS names a folder the tree does not hold",
    ]);
  });

  it("refuses a map over its size limit", () => {
    const owners = { "packages/a/src": "x".repeat(4000) };
    expect(mapProblems(["packages/a/src"], owners)).toEqual([
      "docs/MAP.md: over 3072 bytes, shorten the owner lines",
    ]);
  });

  it("groups lines by package and lists public entries once", () => {
    expect(render(OWNERS, () => [".", "./x"])).toContain(
      "## packages/a\n\nPublic: `.`, `./x`\n\n- `src/`: the a entry\n- `src/b/`: the b part\n",
    );
  });
});
