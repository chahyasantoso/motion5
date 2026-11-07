import { describe, expect, it } from "vitest";
import { parseFramesArgs } from "../../../../../scripts/motion-tools/frames";

describe("parseFramesArgs", () => {
  it("reads an onion request", () => {
    expect(
      parseFramesArgs([
        "a.html",
        "--onion",
        ".dot",
        "--from",
        "100",
        "--to",
        "300",
        "--every",
        "50",
      ]),
    ).toEqual({
      kind: "onion",
      page: "a.html",
      width: 1280,
      height: 720,
      select: ".dot",
      from: 100,
      to: 300,
      every: 50,
    });
  });

  it("reads a page, times, and the default size", () => {
    expect(parseFramesArgs(["timing.html", "--at", "0,500"])).toEqual({
      kind: "frames",
      page: "timing.html",
      at: [0, 500],
      width: 1280,
      height: 720,
    });
  });

  it("reads a size and an output folder", () => {
    expect(
      parseFramesArgs(["a/b.html", "--at", "1", "--size", "640x360", "--out", "dir"]),
    ).toMatchObject({ page: "a/b.html", width: 640, height: 360, out: "dir" });
  });

  it.each([
    ["no page", ["--at", "1"]],
    ["two pages", ["a.html", "b.html", "--at", "1"]],
    ["a page outside the app", ["../a.html", "--at", "1"]],
    ["an absolute page", ["/a.html", "--at", "1"]],
    ["a page that is not html", ["a.png", "--at", "1"]],
    ["no times", ["a.html"]],
    ["descending times", ["a.html", "--at", "5,1"]],
    ["a bad size", ["a.html", "--at", "1", "--size", "big"]],
    ["an unknown flag", ["a.html", "--at", "1", "--fps", "60"]],
    [
      "both modes",
      ["a.html", "--at", "1", "--onion", ".x", "--from", "0", "--to", "1", "--every", "1"],
    ],
    ["an onion with no step", ["a.html", "--onion", ".x", "--from", "0", "--to", "10"]],
    [
      "an onion that runs backwards",
      ["a.html", "--onion", ".x", "--from", "9", "--to", "1", "--every", "1"],
    ],
    [
      "an onion with too many steps",
      ["a.html", "--onion", ".x", "--from", "0", "--to", "1000", "--every", "1"],
    ],
  ])("refuses %s", (_name, argv) => {
    expect(parseFramesArgs(argv).kind).toBe("usage");
  });
});
