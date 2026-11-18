import { circlePath, rectPath } from "@gerak/core";
import { describe, expect, it } from "vitest";
import { NO_REST, compileStage, defineStage, formatStageError, type Stage } from "../src";
import {
  blendShapes,
  drawStrokes,
  matchOutlines,
  morphAt,
  piecesOf,
  strokeBox,
} from "../src/render";

const SQUARE = rectPath({ x: 0, y: 0, width: 40, height: 40 });
const CIRCLE = circlePath({ cx: 20, cy: 20, r: 20 });
const EXTRA = rectPath({ x: 80, y: 0, width: 10, height: 10 });

function compiled(definition: unknown): Stage {
  const result = compileStage(definition);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

describe("outlines", () => {
  it("splits outlines at gaps and matches counts, orientation and seams", () => {
    expect(piecesOf([...SQUARE, ...EXTRA])).toHaveLength(2);
    const matched = matchOutlines([SQUARE, CIRCLE]);
    if (!("matched" in matched)) throw new Error(matched.reason);
    expect(matched.matched[0]).toHaveLength(matched.matched[1]?.length ?? -1);
    expect("reason" in matchOutlines([SQUARE, [...SQUARE, ...EXTRA]])).toBe(true);
    expect(blendShapes(matched.matched, -2)).toEqual(matched.matched[0]);
  });

  it("blends a morph by the pose's shape, the base when there is none", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({ blob: m.morph(SQUARE, [CIRCLE]) }),
        scene: () => ({}),
      }),
    );
    const blob = stage.members[0];
    if (blob?.kind !== "actor" || blob.content.kind !== "morph") throw new Error("no morph");
    expect(morphAt(blob.content, undefined)).toBe(blob.content.shapes[0]);
    expect(morphAt(blob.content, { shape: 0.5 })).not.toEqual(blob.content.shapes[0]);
  });
});

describe("drawStrokes", () => {
  const line = rectPath({ x: 0, y: 0, width: 100, height: 2 });

  it("draws paths in the order they read each other and adds their boxes to rest", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({
          follower: m.stroke((rest) =>
            rectPath({ x: rest.get("leader").x, y: 0, width: 4, height: 4 }),
          ),
          leader: m.stroke(line),
          marks: m.many([line], (each) => m.stroke(each)),
        }),
        scene: () => ({}),
      }),
    );
    const drawn = drawStrokes(stage, NO_REST);
    if (!drawn.ok) throw new Error(formatStageError(drawn.error));
    expect([...drawn.strokes.cubics.keys()]).toEqual(["leader", "marks.0", "follower"]);
    expect(drawn.strokes.rest.get("leader").x).toBe(strokeBox(line).x + strokeBox(line).width / 2);
    expect(drawn.strokes.failures).toEqual([]);
  });

  it("names the paths that read each other", () => {
    const stage = compiled(
      defineStage({
        beats: { a: [0, 100] },
        cast: (m) => ({
          a: m.stroke((rest) => rectPath({ x: rest.get("b").x, y: 0, width: 4, height: 4 })),
          b: m.stroke((rest) => rectPath({ x: rest.get("a").x, y: 0, width: 4, height: 4 })),
          c: m.stroke((rest) => rectPath({ x: rest.get("a").x, y: 0, width: 4, height: 4 })),
        }),
        scene: () => ({}),
      }),
    );
    const drawn = drawStrokes(stage, NO_REST);
    expect(drawn.ok ? "" : formatStageError(drawn.error)).toBe(
      'paths "a" and "b" read each other; "c" reads them and is not drawn either.',
    );
  });
});
