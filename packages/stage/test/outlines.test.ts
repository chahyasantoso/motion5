import { circlePath, rectPath } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  blendShapes,
  compileStage,
  defineStage,
  evaluateFrame,
  matchOutlines,
  piecesOf,
} from "../src";

const SQUARE = rectPath({ x: 0, y: 0, width: 40, height: 40 });
const CIRCLE = circlePath({ cx: 20, cy: 20, r: 20 });
const EXTRA = rectPath({ x: 80, y: 0, width: 10, height: 10 });

describe("outlines and morphs", () => {
  it("splits disconnected outlines into continuous pieces", () => {
    expect(piecesOf(SQUARE)).toHaveLength(1);
    expect(piecesOf([...SQUARE, ...EXTRA])).toHaveLength(2);
  });

  it("matches outline orientation, start seam, and cubic counts", () => {
    const matched = matchOutlines([SQUARE, CIRCLE]);
    expect("matched" in matched).toBe(true);
    if (!("matched" in matched)) return;

    const [a, b] = matched.matched;
    expect(a).toHaveLength(b?.length ?? -1);

    const mismatch = matchOutlines([SQUARE, [...SQUARE, ...EXTRA]]);
    expect("reason" in mismatch).toBe(true);
  });

  it("blends shapes with clamping and integer fast-path", () => {
    const matched = matchOutlines([SQUARE, CIRCLE]);
    if (!("matched" in matched)) throw new Error(matched.reason);

    expect(blendShapes([], 0.5)).toEqual([]);
    expect(blendShapes(matched.matched, -2)).toEqual(matched.matched[0]);
    const clampedEnd = blendShapes(matched.matched, 5);
    expect(clampedEnd.map(({ id: _id, ...coords }) => coords)).toEqual(
      matched.matched[1]?.map(({ id: _id, ...coords }) => coords),
    );

    const mid = blendShapes(matched.matched, 0.5);
    expect(mid).not.toEqual(matched.matched[0]);
    expect(mid).not.toEqual(matched.matched[1]);
  });

  it("rejects morph piece mismatch during compileStage and blends morphs in evaluateFrame", () => {
    const bad = compileStage(
      defineStage({
        beats: { main: [0, 400] },
        cast: (m) => ({
          badMorph: m.morph(SQUARE, [[...SQUARE, ...EXTRA]]),
        }),
        scene: () => ({}),
      }),
    );
    expect(bad.ok).toBe(false);

    const good = compileStage(
      defineStage({
        beats: { main: [0, 400] },
        cast: (m) => ({
          hero: m.morph(SQUARE, [CIRCLE]),
          listMorph: m.many([1], () => m.morph(SQUARE, [CIRCLE])),
        }),
        scene: ({ time }) => ({
          hero: { shape: time.progress },
          listMorph: [{ shape: time.progress }],
        }),
      }),
    );
    expect(good.ok).toBe(true);
    if (!good.ok) return;

    const frame = evaluateFrame(good.stage, {
      time: { progress: 0.5, clock: { kind: "timed", elapsed: 200, length: 400 } },
    });
    expect(frame.ok).toBe(true);
    if (!frame.ok) return;
    expect(frame.morphs.hero?.length).toBeGreaterThan(0);
    expect(frame.morphs["listMorph.0"]?.length).toBeGreaterThan(0);
    expect(frame.morphs.hero).toEqual(frame.morphs["listMorph.0"]);
  });
});
