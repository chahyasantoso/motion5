import { describe, expect, it } from "vitest";
import type { Cubic2d } from "@gerak/moves";
import {
  NO_LAYOUTS,
  NO_REST,
  actor,
  blendShapes,
  castNames,
  matchOutlines,
  readStageModule,
  story,
} from "@gerak/stage";

function point(c: Cubic2d, t: number): readonly [number, number] {
  const u = 1 - t;
  return [
    u * u * u * c.x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x3,
    u * u * u * c.y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y3,
  ];
}

const STEPS = [0, 0.25, 0.5, 0.75, 1];

/** A circle of `radius` about (100, 100) in four cubics from `from` degrees, turning by `way` (1 or -1). */
function circle(radius: number, from: number, way: 1 | -1, name: string): readonly Cubic2d[] {
  const kappa = (4 / 3) * Math.tan(Math.PI / 8);
  const at = (degrees: number) => {
    const a = (degrees * Math.PI) / 180;
    return { x: 100 + radius * Math.cos(a), y: 100 + radius * Math.sin(a), a };
  };
  return [0, 1, 2, 3].map((index): Cubic2d => {
    const start = at(from + way * 90 * index);
    const end = at(from + way * 90 * (index + 1));
    const reach = radius * kappa * way;
    return {
      id: `${name}${index}`,
      x0: start.x,
      y0: start.y,
      x1: start.x - reach * Math.sin(start.a),
      y1: start.y + reach * Math.cos(start.a),
      x2: end.x + reach * Math.sin(end.a),
      y2: end.y - reach * Math.cos(end.a),
      x3: end.x,
      y3: end.y,
    };
  });
}

/** A run of `count` cubics joined end to end, rising and falling. */
function wave(count: number, name: string): readonly Cubic2d[] {
  return Array.from({ length: count }, (_, index): Cubic2d => {
    const x = (index * 100) / count;
    const next = ((index + 1) * 100) / count;
    return {
      id: `${name}${index}`,
      x0: x,
      y0: index % 2 === 0 ? 0 : 20,
      x1: x + 3,
      y1: 40,
      x2: next - 7,
      y2: -10,
      x3: next,
      y3: (index + 1) % 2 === 0 ? 0 : 20,
    };
  });
}

function matched(outlines: readonly (readonly Cubic2d[])[]): readonly (readonly Cubic2d[])[] {
  const result = matchOutlines(outlines);
  if ("reason" in result) throw new Error(result.reason);
  return result.matched;
}

describe("matching outlines", () => {
  it("splits the shorter to as many cubics as the longer and draws the same shape", () => {
    const few = wave(3, "a");
    const many = wave(5, "b");
    const [first, second] = matched([few, many]);
    expect(first).toHaveLength(5);
    expect(second).toHaveLength(5);
    for (const original of few) {
      const descendants = (first ?? []).filter(
        ({ id }) => id === original.id || id.startsWith(`${original.id}.`),
      );
      expect(descendants.length).toBeGreaterThan(0);
      const drawn = descendants.flatMap((c) => STEPS.map((t) => point(c, t)));
      for (const t of STEPS) {
        const [x, y] = point(original, t);
        const near = drawn.some(([dx, dy]) => Math.abs(dx - x) < 1e-9 && Math.abs(dy - y) < 1e-9);
        expect(near).toBe(true);
      }
    }
    expect(second).toEqual(many);
  });

  it("names the halves of a split cubic .1 and .2", () => {
    const [first] = matched([wave(1, "a"), wave(2, "b")]);
    expect(first?.map(({ id }) => id)).toEqual(["a0.1", "a0.2"]);
  });

  it("blends a circle with one started elsewhere and drawn the other way round without twisting", () => {
    const small = circle(10, -90, 1, "s");
    const large = circle(20, 90, -1, "l");
    const result = matched([small, large]);
    const halfway = blendShapes(result, 0.5);
    for (const c of halfway)
      for (const t of STEPS) {
        const [x, y] = point(c, t);
        const radius = Math.hypot(x - 100, y - 100);
        expect(radius).toBeGreaterThan(10 - 0.05);
        expect(radius).toBeLessThan(20 + 0.05);
      }
  });

  it("refuses outlines of different numbers of pieces", () => {
    const apart = (cubics: readonly Cubic2d[]) =>
      cubics.map((c) => ({ ...c, x0: c.x0 + 500, x3: c.x3 + 500, x1: c.x1 + 500, x2: c.x2 + 500 }));
    const two = [...wave(2, "a"), ...apart(wave(2, "b"))];
    const result = matchOutlines([two, wave(4, "c")]);
    expect("reason" in result && result.reason).toMatch(/path has 2, shapes\[0\] has 1/);
  });
});

describe("blending shapes", () => {
  const first = wave(2, "a");
  const second = wave(2, "b").map((c) => ({
    ...c,
    y0: c.y0 + 10,
    y1: c.y1 + 10,
    y2: c.y2 + 10,
    y3: c.y3 + 10,
  }));
  const third = second.map((c) => ({ ...c, y1: c.y1 + 20, y2: c.y2 + 20 }));
  const all = [first, second, third];

  it("answers the first at 0, the second at 1, and the cubic-wise midpoint between", () => {
    expect(blendShapes(all, 0)).toEqual(first);
    expect(blendShapes(all, 1)).toEqual(second);
    const mid = blendShapes([first, second], 0.5);
    mid.forEach((c, index) => {
      const a = first[index];
      const b = second[index];
      expect(c.y1).toBeCloseTo(((a?.y1 ?? 0) + (b?.y1 ?? 0)) / 2, 12);
      expect(c.x2).toBeCloseTo(((a?.x2 ?? 0) + (b?.x2 ?? 0)) / 2, 12);
      expect(c.y3).toBeCloseTo(((a?.y3 ?? 0) + (b?.y3 ?? 0)) / 2, 12);
    });
  });

  it("blends between the neighbouring two, and clamps past the ends", () => {
    expect(blendShapes(all, 1.5)).toEqual(
      second.map((c) => ({ ...c, y1: c.y1 + 10, y2: c.y2 + 10 })),
    );
    expect(blendShapes(all, -3)).toEqual(first);
    expect(blendShapes(all, 9)).toEqual(third);
  });
});

describe("a member that morphs", () => {
  const good = {
    beats: story(1000, { go: [0, 1000] }),
    skins: { dom: { css: "" } },
    scene: () => ({}),
  };

  it("holds its matched outlines in the cast names", () => {
    const names = castNames({ mouth: actor({ path: wave(3, "a"), shapes: [wave(5, "b")] }) });
    expect(names[0]?.shapes?.map((outline) => outline.length)).toEqual([5, 5]);
  });

  it("is refused by name when its outlines have different numbers of pieces", () => {
    const apart = wave(2, "b").map((c, index) => ({ ...c, x0: c.x0 + index * 500 }));
    const read = readStageModule({
      ...good,
      cast: { mouth: actor({ path: wave(2, "a"), shapes: [apart] }) },
    });
    expect("reason" in read && read.reason).toMatch(/"mouth".*path has 1, shapes\[0\] has 2/);
  });

  it("is refused by name when its path is a function", () => {
    const read = readStageModule({
      ...good,
      cast: { mouth: actor({ path: () => wave(2, "a"), shapes: [wave(2, "b")] }) },
    });
    expect("reason" in read && read.reason).toMatch(/"mouth".*fixed path/);
  });

  it("is read when its outlines match", () => {
    const read = readStageModule({
      ...good,
      cast: { mouth: actor({ path: wave(2, "a"), shapes: [wave(3, "b")] }) },
    });
    if ("reason" in read) throw new Error(read.reason);
    expect(
      read.scene(
        { progress: 0, clock: { kind: "timed", elapsed: 0, length: 1000 } },
        [],
        NO_REST,
        NO_LAYOUTS,
      ),
    ).toEqual({});
  });
});
