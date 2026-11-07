import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type Value } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinModels } from "@motion5/plugins/models";
import { ropePlugin } from "@motion5/plugins/motion/rope";
import { tracePlugin } from "@motion5/plugins/motion/trace";
import { anchorsToCubicPlugin } from "@motion5/plugins/path/anchors-to-cubic";
import { svgPathPlugin } from "@motion5/plugins/path/svg-path";

const SHAPE = [
  { x: 100, y: 300 },
  { x: 160, y: 220 },
  { x: 220, y: 300 },
  { x: 280, y: 220 },
  { x: 340, y: 300 },
];

function load(param: Record<string, number> = {}) {
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({
      models: builtinModels,
      plugins: [ropePlugin, anchorsToCubicPlugin, svgPathPlugin, tracePlugin],
    }),
  }).load({
    schemaVersion: 5,
    motions: [
      {
        id: "m",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "rope",
            output: { plugin: "rope" },
            input: {
              values: SHAPE.map((cells, index) => ({ id: `p${index}`, cells })),
              param,
            },
          },
          {
            id: "path",
            output: { plugin: "anchorsToCubic" },
            input: { requires: { anchors: "rope" } },
          },
          { id: "d", output: { plugin: "svgPath" }, input: { requires: { path: "path" } } },
          { id: "ink", output: { plugin: "trace" }, input: { requires: { path: "path" } } },
        ],
      },
    ],
  });
  for (const id of ["rope", "path", "d", "ink"]) handle.mount(`m/${id}`);
  return (node: string, progress: number): Value => {
    for (const id of ["rope", "path", "d", "ink"]) handle.seek(`m/${id}`, progress);
    const patch = handle.get(`m/${node}`);
    if (patch?.status !== "ready") throw new Error(`${node} is ${patch?.status ?? "absent"}`);
    return patch.outputs.values ?? [];
  };
}

function points(value: Value): { x: number; y: number; inX?: number; outX?: number }[] {
  if (!Array.isArray(value)) throw new Error("Expected rows.");
  return value.map((row) => {
    const cells = Object(Reflect.get(Object(row), "cells"));
    return { x: Number(cells.x), y: Number(cells.y), inX: cells.inX, outX: cells.outX };
  });
}

function lengths(rows: readonly { x: number; y: number }[]): number[] {
  return rows.slice(1).map((row, index) => {
    const before = rows[index]!;
    return Math.hypot(row.x - before.x, row.y - before.y);
  });
}

describe("rope", () => {
  const target = lengths(SHAPE);

  it("starts pulled straight from the first point, along its angle", () => {
    const start = points(load({ angle: 0 })("rope", 0));
    expect(start[0]).toMatchObject({ x: 100, y: 300 });
    for (const row of start) expect(row.y).toBeCloseTo(300, 9);
    lengths(start).forEach((length, index) => expect(length).toBeCloseTo(target[index]!, 9));
  });

  it("settles exactly on the shape", () => {
    const end = points(load()("rope", 1));
    end.forEach((row, index) => {
      expect(row.x).toBeCloseTo(SHAPE[index]!.x, 9);
      expect(row.y).toBeCloseTo(SHAPE[index]!.y, 9);
    });
  });

  it("never stretches: every segment keeps its length at every step", () => {
    const read = load({ overshoot: 1, ripple: 0.5 });
    for (let step = 0; step <= 20; step += 1)
      lengths(points(read("rope", step / 20))).forEach((length, index) =>
        expect(length).toBeCloseTo(target[index]!, 9),
      );
  });

  it("overshoots its shape on the way when asked, and not when not", () => {
    const tip = (read: ReturnType<typeof load>, progress: number) =>
      points(read("rope", progress)).at(-1)!;
    const bouncy = load({ overshoot: 1, ripple: 0 });
    const plain = load({ overshoot: 0, ripple: 0 });
    const distance = (read: ReturnType<typeof load>) =>
      Math.max(
        ...Array.from({ length: 21 }, (_, step) => {
          const point = tip(read, step / 20);
          return Math.hypot(point.x - 340, point.y - 300);
        }).slice(10),
      );
    expect(distance(bouncy)).toBeGreaterThan(distance(plain));
  });

  it("releases the end first when it ripples", () => {
    const read = load({ ripple: 0.8, overshoot: 0 });
    const early = points(read("rope", 0.15));
    // The joint nearest the start has not turned yet, so the first segment still points along the line.
    expect(early[1]!.y).toBeCloseTo(300, 9);
    expect(early.at(-1)!.y).not.toBeCloseTo(300 + 0, 3);
  });

  it("smooths through each point with handles that line up", () => {
    const end = points(load()("rope", 1));
    const middle = end[2]!;
    expect(middle.inX).toBeCloseTo(-(middle.outX ?? 0), 9);
  });
});

describe("svgPath and trace", () => {
  it("publishes the path as a CSS path() and draws it on from nothing to all", () => {
    const read = load();
    const d = read("d", 1);
    expect(d).toMatchObject({ d: expect.stringMatching(/^path\("M 100 300 C /) });
    const length = Number(Reflect.get(Object(read("ink", 0)), "strokeDashoffset"));
    // Straight at the start, so the path is exactly the chain: four segments of 100.
    expect(length).toBeCloseTo(400, 6);
    expect(read("ink", 0)).toEqual({
      strokeDasharray: `${length} ${length}`,
      strokeDashoffset: length,
    });
    expect(Reflect.get(Object(read("ink", 1)), "strokeDashoffset")).toBe(0);
  });
});
