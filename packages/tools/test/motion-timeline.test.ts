import { describe, expect, it } from "vitest";
import { DEFAULT_SOURCE } from "../src/page/page";
import { parseProbeArgs } from "../src/page/probe";

describe("motion:probe arguments", () => {
  it("reads a page, times and a selector", () => {
    expect(parseProbeArgs(["timing.html", "--at", "0,100", "--select", ".beat-dot"])).toEqual({
      kind: "ok",
      page: "timing.html",
      width: 1280,
      height: 720,
      at: [0, 100],
      select: ".beat-dot",
      source: DEFAULT_SOURCE,
    });
  });

  it.each([
    ["no selector", ["timing.html", "--at", "0"]],
    ["no times", ["timing.html", "--select", ".x"]],
    ["an unknown flag", ["timing.html", "--at", "0", "--select", ".x", "--zoom", "2"]],
  ])("refuses %s", (_name, argv) => {
    expect(parseProbeArgs(argv).kind).toBe("usage");
  });
});
