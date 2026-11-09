import { describe, expect, it } from "vitest";
import { compareCycles, cycleKey } from "../../../../../scripts/cycle-scan.mjs";

describe("cycle scan", () => {
  it("spells a cycle one way whatever its rotation", () => {
    expect(cycleKey(["b.ts", "c.ts", "a.ts"])).toBe("a.ts > b.ts > c.ts");
    expect(cycleKey(["a.ts", "b.ts", "c.ts"])).toBe("a.ts > b.ts > c.ts");
  });

  it("reports a new cycle and a stale baseline entry", () => {
    expect(compareCycles([["a.ts", "b.ts"]], ["c.ts > d.ts"])).toEqual({
      added: ["a.ts > b.ts"],
      stale: ["c.ts > d.ts"],
    });
  });

  it("passes when the tree matches the baseline", () => {
    expect(compareCycles([["b.ts", "a.ts"]], ["a.ts > b.ts"])).toEqual({ added: [], stale: [] });
  });
});
