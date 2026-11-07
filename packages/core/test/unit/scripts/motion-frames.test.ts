import { describe, expect, it } from "vitest";
import { parseFramesArgs } from "../../../../../scripts/motion-tools/frames";

describe("parseFramesArgs", () => {
  it("reads a page, times, and the default size", () => {
    expect(parseFramesArgs(["timing.html", "--at", "0,500"])).toEqual({
      kind: "ok",
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
  ])("refuses %s", (_name, argv) => {
    expect(parseFramesArgs(argv).kind).toBe("usage");
  });
});
