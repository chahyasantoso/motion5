import { describe, expect, it } from "vitest";
import { mix, type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";
import { collectRecords } from "../src/scene/catalog";
import { describeOffsets, descriptorsOf } from "../src/scene/moves";

const number = (description: string) => ({ kind: "number", description }) as const;

/** Offsets of a piecewise-linear path through knots, on the gate's 63 samples. */
function along(knots: readonly (readonly [number, number])[]): readonly number[] {
  return Array.from({ length: 63 }, (_, step) => {
    const at = step / 62;
    for (let i = 1; i < knots.length; i += 1) {
      const [from = 0, start = 0] = knots[i - 1] ?? [];
      const [to = 1, end = 0] = knots[i] ?? [];
      if (at <= to) return mix(start, end, (at - from) / (to - from));
    }
    return knots.at(-1)?.[1] ?? 0;
  });
}

describe("describeOffsets", () => {
  it("measures a travelling path's overshoot, rings and settle", () => {
    const d = describeOffsets(
      along([
        [0, -100],
        [0.4, 20],
        [0.6, -5],
        [0.8, 2],
        [1, 0],
      ]),
    );
    expect(d.travelling).toBe(true);
    expect(d.overshoot).toBeCloseTo(0.2, 1);
    expect(d.rings).toBe(2);
    expect(d.windup).toBe(0);
    expect(d.peak).toBeCloseTo(0.2, 1);
    expect(d.settle).toBeCloseTo(0.35, 1);
  });

  it("measures a path that starts and ends away from rest by where it ends, not by rest", () => {
    const leave = describeOffsets(
      along([
        [0, 120],
        [1, 180],
      ]),
    );
    expect(leave).toMatchObject({ travelling: true, overshoot: 0, windup: 0, rings: 0 });
    const bob = describeOffsets(
      along([
        [0, 120],
        [0.25, 140],
        [0.75, 100],
        [1, 120],
      ]),
    );
    expect(bob).toMatchObject({ travelling: false, overshoot: 0, windup: 0, rings: 1 });
  });

  it("measures an oscillating path by every crossing and by the tail after its greatest offset", () => {
    const hump = describeOffsets(
      Array.from({ length: 63 }, (_, i) => 40 * Math.sin((Math.PI * i) / 62)),
    );
    expect(hump).toMatchObject({ travelling: false, overshoot: 0, windup: 0, rings: 0 });
    expect(hump.settle).toBeCloseTo(0.5, 5);
    const waves = describeOffsets(
      Array.from({ length: 63 }, (_, i) => 20 * Math.sin((4 * Math.PI * i) / 62)),
    );
    expect(waves.travelling).toBe(false);
    expect(waves.rings).toBe(3);
  });

  it("reads a windup as the pull away from rest before the path first shrinks", () => {
    const wound = describeOffsets(
      along([
        [0, -100],
        [0.2, -130],
        [1, 0],
      ]),
    );
    expect(wound.windup).toBeCloseTo(0.3, 1);
    expect(
      describeOffsets(
        along([
          [0, -100],
          [1, 0],
        ]),
      ).windup,
    ).toBe(0);
  });

  it("measures a path that starts at rest and ends away against its end", () => {
    const d = describeOffsets(
      along([
        [0, 0],
        [0.6, 110],
        [1, 100],
      ]),
    );
    expect(d.travelling).toBe(true);
    expect(d.overshoot).toBeCloseTo(0.1, 1);
    expect(d.rings).toBe(0);
  });
});

describe("descriptorsOf", () => {
  const mover = (id: string, run: (progress: number) => Pose2d) =>
    defineMove({
      id,
      role: "emphasis",
      description: "A test mover.",
      options: { amount: number("Unused.") },
      example: { options: { amount: 1 } },
      moments: () => ({}),
      run: (_options, { progress }): Pose2d => run(progress),
    });

  it("picks the primary field by its offset over its judged limit, across a px and a ratio field", () => {
    const wide = mover("wide", (p) => ({ x: 100 * Math.sin(Math.PI * p), scale: 1 }));
    expect(descriptorsOf(wide)).toMatchObject({ fields: ["x"], primary: "x" });
    const grows = mover("grows", (p) => ({
      x: 100 * Math.sin(Math.PI * p),
      scale: 1 + 1.2 * Math.sin(Math.PI * p),
    }));
    expect(descriptorsOf(grows)).toMatchObject({ fields: ["x", "scale"], primary: "scale" });
  });

  it("compares a turn to the turn limit, and leaves out a field that never moves", () => {
    const spin = mover("spin", (p) => ({
      x: 100 * Math.sin(Math.PI * p),
      y: 0,
      rotation: 200 * Math.sin(Math.PI * p),
    }));
    expect(descriptorsOf(spin)).toMatchObject({ fields: ["x", "rotation"], primary: "rotation" });
  });

  it("reads the example's descriptors as the move's, a custom number resting at 0", () => {
    const glow = mover("glow", (p) => ({ custom: { glow: 90 * Math.sin(Math.PI * p) } }));
    const found = descriptorsOf(glow);
    expect(found.fields).toEqual(["custom.glow"]);
    expect(found.primary).toBe("custom.glow");
    expect(found.descriptors).toMatchObject({ travelling: false, rings: 0 });
  });

  it("names no primary for a move that moves nothing", () => {
    expect(descriptorsOf(mover("still", () => ({ x: 0 })))).toEqual({
      fields: [],
      primary: undefined,
      descriptors: undefined,
      shapes: {},
      shapesAt: [{ options: { amount: 1 }, shapes: {} }],
    });
  });
});

describe("a catalog record", () => {
  it("carries the fields it moves, its primary field and the descriptors of that field", () => {
    const drop = collectRecords([])
      .map(({ record }) => record)
      .find((record) => record.id === "drop");
    expect(drop?.fields).toContain("y");
    expect(drop?.primary).toBeDefined();
    expect(drop?.descriptors).toMatchObject({ travelling: true });
  });
});
