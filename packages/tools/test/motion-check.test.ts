import { describe, expect, it } from "vitest";
import { DEFAULT_LIMITS, analyse, auditText, parseCheckArgs, type Frame } from "../src/page/check";
import { blend, contrastNeeded, contrastRatio, parseColour } from "../src/page/contrast";
import { DEFAULT_SOURCE } from "../src/page/page";

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

describe("motion:check contacts the page marks as meant", () => {
  it("skips an overlap between elements one marks as touching the other", () => {
    const touching = (touches?: readonly string[]): Frame[] =>
      Array.from({ length: 40 }, (_, index) => ({
        at: index * STEP,
        elements: [
          {
            name: "foot",
            box: { x: 0, y: 0, width: 10, height: 10 },
            ...(touches ? { touches } : {}),
          },
          { name: "ball", box: { x: 5, y: 0, width: 10, height: 10 } },
        ],
      }));
    expect(analyse(touching(), STAGE, DEFAULT_LIMITS)).toHaveLength(1);
    expect(analyse(touching(["ball"]), STAGE, DEFAULT_LIMITS)).toEqual([]);
  });
});

describe("motion:check text on the last frame", () => {
  const BLACK = { r: 0, g: 0, b: 0, a: 1 };
  const text = {
    name: "p",
    box: { x: 0, y: 0, width: 10, height: 10 },
    shown: 1,
    opacity: 1,
    fontSize: 40,
    fontWeight: 700,
  };

  it("measures contrast as WCAG does", () => {
    expect(contrastRatio({ r: 255, g: 255, b: 255, a: 1 }, BLACK)).toBeCloseTo(21, 6);
    expect(
      contrastRatio(parseColour("rgb(119, 119, 119)") ?? BLACK, { r: 255, g: 255, b: 255, a: 1 }),
    ).toBeCloseTo(4.48, 2);
    expect(parseColour("rgba(255, 0, 0, 0.5)")).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    expect(blend({ r: 255, g: 255, b: 255, a: 1 }, BLACK, 0.5).r).toBe(127.5);
    expect([contrastNeeded(40, 400), contrastNeeded(16, 400), contrastNeeded(19, 700)]).toEqual([
      3, 4.5, 3,
    ]);
  });

  it("reports faint text, text faded by opacity, and text off the page's edge", () => {
    expect(auditText([{ ...text, colour: "rgb(255, 255, 255)" }], [BLACK])).toEqual([]);
    expect(auditText([{ ...text, colour: "rgb(34, 34, 34)" }], [BLACK])).toEqual([
      { kind: "low-contrast", element: "p", ratio: 1.3, needs: 3 },
    ]);
    expect(
      auditText([{ ...text, colour: "rgb(255, 255, 255)", opacity: 0.1 }], [BLACK])[0]?.kind,
    ).toBe("low-contrast");
    expect(auditText([{ ...text, colour: "rgb(255, 255, 255)", shown: 0.5 }], [BLACK])).toEqual([
      { kind: "cut-off", element: "p", shown: 0.5 },
    ]);
  });
});
