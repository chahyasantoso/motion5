import { describe, expect, it } from "vitest";
import {
  DEFAULT_LIMITS,
  analyse,
  parseCheckArgs,
  type Frame,
} from "../../../../../scripts/motion-tools/check";
import { DEFAULT_SOURCE } from "../../../../../scripts/motion-tools/page";

const STEP = 16;
type Spot = { readonly x: number; readonly y: number };

/** Frames of named 10x10 boxes, placed by `at` for each frame index. */
function frames(count: number, place: (index: number) => Readonly<Record<string, Spot>>): Frame[] {
  return Array.from({ length: count }, (_, index) => ({
    at: index * STEP,
    elements: Object.entries(place(index)).map(([name, spot]) => ({
      name,
      box: { x: spot.x, y: spot.y, width: 10, height: 10 },
    })),
  }));
}

const STAGE = { width: 1280, height: 720 };

describe("motion:check analysis", () => {
  it("reports nothing for a clean run that holds", () => {
    const run = frames(80, (i) => ({ a: { x: Math.min(i, 20) * 5, y: 0 }, b: { x: 500, y: 0 } }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toEqual([]);
  });

  it("reports an overlap with how long it lasts", () => {
    const run = frames(80, (i) => ({
      a: { x: 100, y: 100 },
      b: { x: i >= 10 && i < 40 ? 105 : 115, y: 100 },
    }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toEqual([
      { kind: "overlap", a: "a", b: "b", from: 160, to: 624, frames: 30 },
    ]);
  });

  it("lets a crossing shorter than the limit pass", () => {
    const run = frames(80, (i) => ({
      a: { x: 100, y: 100 },
      b: { x: i >= 10 && i < 13 ? 105 : 115, y: 100 },
    }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toEqual([]);
  });

  it("ignores boxes that are wholly off the stage", () => {
    const run = frames(80, () => ({ a: { x: -500, y: 0 }, b: { x: -495, y: 0 } }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toEqual([]);
  });

  it("reports a jump larger than the per-frame limit", () => {
    const run = frames(80, (i) => ({ a: { x: i === 20 ? 600 : 0, y: 0 } }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toEqual([
      { kind: "jump", element: "a", at: 320, px: 600 },
      { kind: "jump", element: "a", at: 336, px: 600 },
    ]);
  });

  it("reports a final hold shorter than the limit", () => {
    const run = frames(40, (i) => ({ a: { x: Math.min(i, 35) * 2, y: 0 } }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toEqual([{ kind: "short-hold", ms: 64 }]);
  });

  it("reports an element still moving on the last frame", () => {
    const run = frames(40, (i) => ({ a: { x: i * 2, y: 0 }, b: { x: 900, y: 0 } }));
    expect(analyse(run, STAGE, DEFAULT_LIMITS)).toContainEqual({
      kind: "still-moving",
      element: "a",
    });
  });
});

describe("motion:check arguments", () => {
  it("reads a page, a watch list, an end and limits", () => {
    expect(
      parseCheckArgs(["a.html", "--watch", ".dot,.glyph", "--to", "3000", "--hold", "300"]),
    ).toEqual({
      kind: "ok",
      page: "a.html",
      width: 1280,
      height: 720,
      watch: [".dot", ".glyph"],
      to: 3000,
      limits: { ...DEFAULT_LIMITS, hold: 300 },
      source: DEFAULT_SOURCE,
    });
  });

  it.each([
    ["no watch list", ["a.html", "--to", "100"]],
    ["no end", ["a.html", "--watch", ".a"]],
    ["a bad limit", ["a.html", "--watch", ".a", "--to", "100", "--jump", "far"]],
  ])("refuses %s", (_name, argv) => {
    expect(parseCheckArgs(argv).kind).toBe("usage");
  });
});
