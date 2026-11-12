import { describe, expect, it } from "vitest";
import { PACKAGES, checkReference, fill } from "../../scripts/reference.mjs";

const START = "<!-- generated:reference:start -->";
const END = "<!-- generated:reference:end -->";

describe("generated reference", () => {
  it("is what npm run reference -- --write would write, so no export entry goes stale", () => {
    expect(checkReference()).toEqual([]);
  });

  it("rewrites only between its markers", () => {
    const text = `intro\n${START}\nold\n${END}\noutro`;
    expect(fill(text, ["new"])).toBe(`intro\n${START}\nnew\n${END}\noutro`);
  });

  it("refuses a file whose marker pairs do not match the packages", () => {
    expect(fill(`${START}\n${END}`, ["a", "b"])).toBeUndefined();
    expect(fill(`${START}\nno end`, ["a"])).toBeUndefined();
    expect(PACKAGES.length).toBeGreaterThan(0);
  });
});
