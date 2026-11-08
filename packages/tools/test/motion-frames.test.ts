import { describe, expect, it } from "vitest";
import { parseFramesArgs } from "../src/page/frames";
import { DEFAULT_SOURCE, fromCaller } from "../src/page/page";

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
      source: DEFAULT_SOURCE,
    });
  });

  it("reads a page, times, and the default size", () => {
    expect(parseFramesArgs(["timing.html", "--at", "0,500"])).toEqual({
      kind: "frames",
      page: "timing.html",
      at: [0, 500],
      width: 1280,
      height: 720,
      source: DEFAULT_SOURCE,
    });
  });

  it("serves another folder, read from where the command was run", () => {
    expect(parseFramesArgs(["index.html", "--at", "0", "--root", "site"])).toMatchObject({
      source: { kind: "serve", root: fromCaller("site") },
    });
  });

  it("reaches a running server and allows a page path with no extension", () => {
    expect(parseFramesArgs(["about", "--at", "0", "--url", "http://localhost:3000"])).toMatchObject(
      { page: "about", source: { kind: "url", base: "http://localhost:3000/" } },
    );
  });

  it("reads a size and an output folder", () => {
    expect(
      parseFramesArgs(["a/b.html", "--at", "1", "--size", "640x360", "--out", "dir"]),
    ).toMatchObject({ page: "a/b.html", width: 640, height: 360, out: fromCaller("dir") });
  });

  it.each([
    ["no page", ["--at", "1"]],
    ["two pages", ["a.html", "b.html", "--at", "1"]],
    ["a page outside the app", ["../a.html", "--at", "1"]],
    ["an absolute page", ["/a.html", "--at", "1"]],
    ["a page with a space", ["a b.html", "--at", "1"]],
    ["both a root and a url", ["a.html", "--at", "1", "--root", "x", "--url", "http://x"]],
    ["a url that is not http", ["a.html", "--at", "1", "--url", "file:///x"]],
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
