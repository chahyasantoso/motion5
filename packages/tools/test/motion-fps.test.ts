import { describe, expect, it } from "vitest";
import { parseFpsArgs } from "../src/page/fps";
import { DEFAULT_SOURCE } from "../src/page/page";

describe("parseFpsArgs", () => {
  it("defaults to 10000 ms, 1280x720, hidden", () => {
    expect(parseFpsArgs(["a.html"])).toEqual({
      kind: "fps",
      page: "a.html",
      width: 1280,
      height: 720,
      source: DEFAULT_SOURCE,
      to: 10000,
      show: false,
    });
  });

  it("reads --to, --size and --show", () => {
    expect(parseFpsArgs(["a.html", "--to", "3000", "--size", "800x600", "--show"])).toMatchObject({
      kind: "fps",
      to: 3000,
      width: 800,
      height: 600,
      show: true,
    });
  });

  it("refuses a --to that is missing, zero or negative", () => {
    expect(parseFpsArgs(["a.html", "--to"]).kind).toBe("usage");
    for (const bad of ["0", "-5", "abc"])
      expect(parseFpsArgs(["a.html", "--to", bad]).kind).toBe("usage");
  });

  it("refuses an unknown flag", () => {
    expect(parseFpsArgs(["a.html", "--nope", "1"]).kind).toBe("usage");
  });
});
