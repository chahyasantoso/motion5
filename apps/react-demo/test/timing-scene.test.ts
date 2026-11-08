import { describe, expect, it } from "vitest";
import { validateV5 } from "@motion5/core";
import { cssClip } from "@motion5/dom";
import type { Pose2d } from "@motion5/moves";
import { manualDriver, play } from "@motion5/player";
import { loadBuiltinCatalog } from "../../../scripts/motion-tools/catalog";
import { sampleProject, type NodeSample } from "../../../scripts/motion-tools/sample";
import timingBeat from "../src/timing-beat.json";
import { BEAT_MS, timingScene } from "../src/timing-scene";

const TIMES = [0, 120, 333, 500, 880, 1000, 1200, 1500, 1870, 2400, 2700, 3000];
const NUMBERS = ["x", "y", "scaleX", "scaleY"] as const;

async function engineAt(ms: number) {
  const catalog = await loadBuiltinCatalog();
  const validated = validateV5(timingBeat, catalog);
  if (validated.kind === "refused") throw new Error(JSON.stringify(validated.diagnostics));
  const result = sampleProject(validated.value, catalog, { kind: "time", ms: [ms] });
  if (result.kind !== "accepted") throw new Error(JSON.stringify(result));
  return result.samples[0]?.nodes ?? {};
}

function values(sample: NodeSample | undefined): unknown {
  if (sample?.status !== "ready") throw new Error(`Expected ready, got ${sample?.status}.`);
  return sample.outputs.values;
}

function numbers(cells: unknown): Record<string, number> {
  return Object.fromEntries(
    NUMBERS.flatMap((key) => {
      const value: unknown = Reflect.get(Object(cells), key);
      return typeof value === "number" ? [[key, value]] : [];
    }),
  );
}

function poseNumbers(pose: Pose2d | undefined): Record<string, number> {
  return numbers(pose);
}

describe("the timing beat as code", () => {
  const driver = manualDriver({ durationMs: BEAT_MS });
  const player = play(timingScene({ x: 0, y: 0 }), driver);

  it.each(TIMES)("matches the engine project at %i ms", async (ms) => {
    driver.seek(ms / BEAT_MS);
    const engine = await engineAt(ms);
    const rows = values(engine["letters/word"]);
    if (!Array.isArray(rows)) throw new Error("The word publishes no rows.");
    const code = player.values;
    rows.forEach((row, index) => {
      const expected = numbers(Reflect.get(Object(row), "cells"));
      const actual = poseNumbers(code.letters[index]);
      expect(Object.keys(expected)).toContain("y");
      for (const key of Object.keys(expected))
        expect(actual[key]).toBeCloseTo(expected[key] ?? NaN, 9);
    });
    const dot = numbers(values(engine["period/dot"]));
    expect(Object.keys(dot)).toEqual(expect.arrayContaining(["x", "y"]));
    expect(rows).toHaveLength(code.letters.length);
    for (const key of Object.keys(dot))
      expect(poseNumbers(code.dot)[key]).toBeCloseTo(dot[key] ?? NaN, 9);
    const clip = String(Reflect.get(Object(values(engine["cover/wipe"])), "clipPath"));
    const radius = Number(/circle\(([-\d.e]+)px/.exec(clip)?.[1]);
    expect(code.cover.radius).toBeCloseTo(radius, 9);
    expect(cssClip({ ...code.cover, radius })).toBe(clip);
  });
});
