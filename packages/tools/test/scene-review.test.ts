import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { elapsedOf, type Time } from "@gerak/core";
import { afterEach, describe, expect, it } from "vitest";
import { defineStage, rawStage, readModule, type CastBuilder } from "./stage-definitions";
import {
  isSceneFile,
  parseSceneReviewArgs,
  reviewSceneModule,
  reviewValues,
  type SceneReviewResult,
} from "../src/scene/review";
import * as clean from "./fixtures/review-clean-scene";
import * as flawed from "./fixtures/review-flawed-scene";
import * as moving from "./fixtures/review-moving-scene";
import * as growing from "./fixtures/review-growing-scene";
import * as constant from "./fixtures/review-constant-scene";
import * as stageClean from "./fixtures/stage-clean";

const limits = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };

function review(module: unknown, options: { to?: number } = {}): SceneReviewResult {
  const read = readModule(module);
  if ("reason" in read) throw new Error(read.reason);
  return reviewSceneModule(read, { ...limits, ...options });
}

describe("gerak review on a scene file", () => {
  it("reads a path ending in .ts as a scene and takes the page check's flags and defaults", () => {
    expect(isSceneFile(["a/scene.ts"])).toBe(true);
    expect(isSceneFile(["page.html", "--watch", ".a"])).toBe(false);
    expect(parseSceneReviewArgs(["s.ts"])).toEqual({
      kind: "ok",
      file: "s.ts",
      hold: 500,
      jump: 150,
      turn: 150,
      ratio: 1.5,
      budget: 8,
    });
    expect(parseSceneReviewArgs(["s.ts", "--to", "900", "--hold", "100", "--jump", "9"])).toEqual({
      kind: "ok",
      file: "s.ts",
      to: 900,
      hold: 100,
      jump: 9,
      turn: 150,
      ratio: 1.5,
      budget: 8,
    });
    expect(parseSceneReviewArgs(["s.ts", "--jump", "-1"]).kind).toBe("usage");
  });

  it("holds positions, turns and ratios to their own limits", () => {
    const small = [0, 1].map((step, index) => ({
      at: index * 16,
      targets: { a: { x: step * 0.4, rotation: step * 10, scale: 1 + step * 0.2 } },
    }));
    const world = { hold: 0, jump: 0.5, turn: 150, ratio: 1.5 };
    expect(reviewValues(small, world).some((line) => line.includes("jumps"))).toBe(false);
    const tight = { hold: 0, jump: 0.5, turn: 5, ratio: 0.1 };
    expect(reviewValues(small, tight).filter((line) => line.includes("jumps"))).toEqual([
      "a.rotation jumps 10 at 16 ms",
      "a.scale jumps 0.2 at 16 ms",
    ]);
  });

  it("finds nothing in a clean scene", () => {
    expect(review(clean).findings).toEqual([]);
  });

  it("reports a planted jump, in a target and in a list of poses, and a short final hold", () => {
    const { findings } = review(flawed);
    expect(findings).toContain("ball.x jumps 400 at 608 ms");
    expect(findings).toContain("letters[1].x jumps 400 at 608 ms");
    expect(findings).toContain("ball still changes 192 ms before the end");
  });

  it("names multiple targets changing in the final hold window", () => {
    const samples = [0, 16, 32, 48, 64].map((at, index) => ({
      at,
      targets: {
        a: { x: index <= 2 ? index : 2 },
        b: { x: index <= 3 ? index : 3 },
        still: { x: 0 },
      },
    }));
    expect(reviewValues(samples, { ...limits, hold: 40 })).toEqual([
      "a, b still change 16 ms before the end",
    ]);
  });

  it("reports a target still moving on the last frame", () => {
    expect(review(moving).findings).toEqual(["drift is still moving on the last frame"]);
  });

  it("stops at --to, and reads turn fields in degrees against the same limit", () => {
    expect(review(flawed, { to: 400 }).findings.some((line) => line.includes("jumps"))).toBe(false);
    const turning = readModule({
      durationMs: 1000,
      scene: (time: { progress: number }) => ({ a: { rotationY: time.progress < 0.5 ? 0 : 200 } }),
    });
    if ("reason" in turning) throw new Error(turning.reason);
    expect(reviewSceneModule(turning, limits).findings[0]).toContain("a turns 160");
  });
  it("reads a turn through 180 degrees as the short step it is", () => {
    const turning = [179, -179, -177].map((rotation, index) => ({
      at: index * 16,
      targets: { a: { rotation } },
    }));
    expect(reviewValues(turning, limits).some((line) => line.includes("jumps"))).toBe(false);
    const flipped = [0, 0, 180].map((rotation, index) => ({
      at: index * 16,
      targets: { a: { rotation } },
    }));
    expect(reviewValues(flipped, limits).some((line) => line.includes("jumps"))).toBe(true);
  });
  it("reads hue and skew as turns and lightness as a ratio", () => {
    const jumps = (key: string, from: number, to: number) =>
      reviewValues(
        [from, to].map((value, index) => ({ at: index * 16, targets: { a: { [key]: value } } })),
        limits,
      ).filter((line) => line.includes("jumps"));
    expect(jumps("hue", 179, -179)).toEqual([]);
    expect(jumps("hue", 0, 160)).toEqual(["a.hue jumps 160 at 16 ms"]);
    expect(jumps("skewX", 179, -179)).toEqual([]);
    expect(jumps("skewX", 0, 160)).toEqual(["a.skewX jumps 160 at 16 ms"]);
    expect(jumps("lightness", 0, 1.4)).toEqual([]);
    expect(jumps("lightness", 0, 1.6)).toEqual(["a.lightness jumps 1.6 at 16 ms"]);
  });
  it("reads a 3D turn as one rotation, so the same turn written two ways is no jump", () => {
    const same = [
      { rotation: 10, rotationX: 20, rotationY: 30 },
      { rotation: 190, rotationX: 160, rotationY: 210 },
    ].map((body, index) => ({ at: index * 16, targets: { body } }));
    expect(
      reviewValues(same, limits).filter((line) => line.includes("jump") || line.includes("turns")),
    ).toEqual([]);
    const real = [{ rotationY: 0 }, { rotationY: 170, rotationX: 0 }].map((body, index) => ({
      at: index * 16,
      targets: { body },
    }));
    expect(reviewValues(real, limits)).toContain("body turns 170 at 16 ms");
  });

  it("does not count a last thousandth of movement as still moving", () => {
    const settling = [0, 1, 2, 3].map((index) => ({
      at: index * 16,
      targets: { flap: { rotationX: index < 3 ? 0 : 0.001 } },
    }));
    expect(reviewValues(settling, { ...limits, hold: 0 })).toEqual([]);
  });
});

describe("gerak review on a value's shape", () => {
  const line = [
    { id: "a", x0: 0, y0: 0, x1: 5, y1: 0, x2: 10, y2: 0, x3: 20, y3: 0 },
    { id: "b", x0: 20, y0: 0, x1: 25, y1: 5, x2: 30, y2: 5, x3: 40, y3: 0 },
  ];
  const stage = (
    cast: (m: CastBuilder<"show">) => Record<string, ReturnType<CastBuilder<"show">["box"]>>,
  ) =>
    defineStage({
      beats: { show: [0, 2000] },
      cast,
      scene: ({ time }) => ({ mouth: { shape: Math.min(1, time.progress * 4) } }),
    });

  it("finds a member given shape that has no shapes, once", () => {
    const { findings } = review(stage((m) => ({ mouth: m.stroke(line) })));
    expect(findings).toEqual(['cast member "mouth" is given shape, but has no shapes.']);
  });

  it("finds nothing when the member has shapes", () => {
    const target = line.map((c) => ({ ...c, y0: c.y0 + 4, y3: c.y3 + 4 }));
    expect(review(stage((m) => ({ mouth: m.morph(line, [target]) }))).findings).toEqual([]);
  });
});

describe("gerak review on time itself", () => {
  const ms = (time: Time): number => elapsedOf(time.clock) ?? 0;
  const drifting = (ambient: boolean) =>
    defineStage({
      beats: { all: [0, 1000] },
      cast: (m) => ({ snow: ambient ? m.box().ambient() : m.box().settle() }),
      scene: ({ time }) => ({ snow: { y: ms(time) / 10 } }),
    });

  it("asks a settle member to rest at the end while an ambient member skips settle", () => {
    expect(review(drifting(false)).findings).toContain("snow is still moving on the last frame");
    expect(review(drifting(true)).findings).not.toContain("snow is still moving on the last frame");
  });

  it("reports a value that differs when sought from when played to", () => {
    let peak = 0;
    const remembering = defineStage({
      beats: { all: [0, 1000] },
      cast: (m) => ({ snow: m.box().ambient() }),
      scene: ({ time }) => {
        peak = Math.max(peak, ms(time));
        return { snow: { y: peak / 10 } };
      },
    });
    const found = review(remembering).findings.filter((line) => line.includes("sought"));
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(/^snow at \d+ ms .*differs when sought from when played to/);
    expect(review(drifting(true)).findings.filter((line) => line.includes("sought"))).toEqual([]);
  });
});

describe("review limits per target", () => {
  const step = (time: Time): number => Math.floor((elapsedOf(time.clock) ?? 0) / 16);
  const moved = (module: object) =>
    review({ durationMs: 64, ...module }).findings.filter((line) => /jumps|turns/.test(line));

  it("judges a target by its own limit and the rest by the flag", () => {
    const found = moved({
      scene: (time: Time) => ({
        label: { x: step(time) * 40, y: 0 },
        body: { x: step(time) * 0.3 },
      }),
      limits: { body: { jump: 0.1 } },
    });
    expect(found.some((line) => line.startsWith("body.x jumps"))).toBe(true);
    expect(found.some((line) => line.startsWith("label."))).toBe(false);
  });

  it("judges a custom number as a ratio, never a position", () => {
    const blink = (value: (time: Time) => number) => ({
      scene: (time: Time) => ({ character: { custom: { blink: value(time) } } }),
    });
    expect(moved(blink((time) => Math.min(1, step(time) * 0.5)))).toEqual([]);
    const found = moved(blink((time) => (step(time) === 2 ? 2 : 0)));
    expect(found[0]).toBe("character.custom.blink jumps 2 at 32 ms");
  });

  it("measures a 3D turn owner by its target's turn limit", () => {
    const head = { scene: (time: Time) => ({ bones: { Head: { rotationX: step(time) * 20 } } }) };
    expect(moved(head)).toEqual([]);
    const found = moved({ ...head, limits: { bones: { turn: 10 } } });
    expect(found[0]).toBe("bones.Head turns 20 at 16 ms");
  });

  it("reports a limit for a target the scene never returns", () => {
    const found = review({
      durationMs: 64,
      scene: () => ({ a: { x: 0 } }),
      limits: { ghost: { jump: 1 } },
    }).findings;
    expect(found).toContain('limits names "ghost", which the scene never returns');
  });
});

describe("gerak review costs", () => {
  const growth = (found: SceneReviewResult) =>
    found.findings.filter((line) =>
      line.startsWith("cost grows with time: a step reads all of the past"),
    );

  it("parses --budget and refuses zero, negative and missing", () => {
    expect(parseSceneReviewArgs(["s.ts", "--budget", "2.5"])).toMatchObject({ budget: 2.5 });
    for (const bad of [["--budget", "0"], ["--budget", "-1"], ["--budget"], ["--budget", "x"]])
      expect(parseSceneReviewArgs(["s.ts", ...bad]).kind).toBe("usage");
  });

  it("flags a step whose cost grows with time, once, and not a constant one", () => {
    const found = growth(review(growing));
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(
      /averages \d+\.\d{2} ms, the last fifth \d+\.\d{2} ms, from \d+ ms on/,
    );
    expect(growth(review(constant))).toEqual([]);
    expect(growth(review(clean))).toEqual([]);
  });

  it("flags a step over --budget, with or without limits, and a stage module", () => {
    const tiny = { ...limits, budget: 0.0001 };
    const over = (module: unknown) => {
      const read = readModule(module);
      if ("reason" in read) throw new Error(read.reason);
      return reviewSceneModule(read, tiny).findings.filter((line) => line.includes("budget"));
    };
    expect(over(constant)).toHaveLength(1);
    expect(over(constant)[0]).toMatch(
      /0\.0001 ms: the worst is \d+\.\d{2} ms (seeking|stepping) to \d+ ms, and \d+ of \d+ steps/,
    );
    expect(over({ ...constant, limits: { ball: { jump: 1000 } } })).toHaveLength(1);
    expect(over(stageClean)).toHaveLength(1);
    expect(review(constant).findings.filter((line) => line.includes("budget"))).toEqual([]);
  });
});

describe("gerak review expectations and shape mismatches", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it("enforces ambient limits and stage bounds while skipping settle rest check", () => {
    const cleanAmbient = defineStage({
      frame: { width: 400, height: 300 },
      beats: { loop: [0, 1000] },
      cast: (m) => ({ orb: m.box().ambient() }),
      scene: ({ time }) => ({
        orb: { x: 200 + 50 * Math.sin(time.progress * Math.PI * 2), y: 150 },
      }),
    });
    expect(review(cleanAmbient).findings).toEqual([]);

    const outOfBounds = defineStage({
      frame: { width: 400, height: 300 },
      beats: { loop: [0, 1000] },
      rest: { orb: { x: 100, y: 100, width: 20, height: 20 } },
      cast: (m) => ({ orb: m.box().ambient() }),
      scene: ({ time }) => ({ orb: { x: 350 * time.progress } }),
    });
    expect(review(outOfBounds).findings.some((line) => /leaves stage bounds/.test(line))).toBe(
      true,
    );

    const jumpingAmbient = defineStage({
      frame: { width: 800, height: 600 },
      beats: { loop: [0, 1000] },
      cast: (m) => ({ orb: m.box().ambient() }),
      limits: { orb: { jump: 10 } },
      scene: ({ time }) => ({ orb: { x: time.progress < 0.5 ? 100 : 300 } }),
    });
    expect(review(jumpingAmbient).findings.some((line) => /orb\.x jumps/.test(line))).toBe(true);
  });

  it("reports a list item that throws as a finding, and no never-moved noise beside it", () => {
    const broken = defineStage({
      beats: { show: [0, 400] },
      cast: (m) => ({ row: m.many(2), dot: m.box() }),
      scene: () => ({
        row: (i) => {
          if (i === 1) throw new Error("boom");
          return { x: i };
        },
      }),
    });
    expect(review(broken).findings).toEqual(["boom"]);
  });

  it("judges an ambient member's bounds only where its box is measured", () => {
    const unmeasured = defineStage({
      beats: { show: [0, 400] },
      cast: (m) => ({ flake: m.box().ambient() }),
      scene: ({ time }) => ({ flake: { x: -10 + 5 * Math.sin(time.progress * 6) } }),
    });
    expect(review(unmeasured).findings.filter((line) => /bounds/.test(line))).toEqual([]);
    const measured = defineStage({
      beats: { show: [0, 400] },
      rest: { flake: { x: 5, y: 5, width: 4, height: 4 } },
      cast: (m) => ({ flake: m.box().ambient() }),
      scene: ({ time }) => ({ flake: { x: -10 + 5 * Math.sin(time.progress * 6) } }),
    });
    expect(review(measured).findings.filter((line) => /bounds/.test(line))).toHaveLength(1);
  });

  it("emits findings for frame shape_mismatch errors instead of throwing", () => {
    const mismatch = rawStage({
      beats: { show: [0, 400] },
      cast: (m: CastBuilder<"show">) => ({ dots: m.many(2) }),
      scene: () => ({ dots: [{ x: 0 }] }),
    });
    expect(review(mismatch).findings).toContain(
      'scene: "dots" is a list: give it `(index, count) => pose`, got an array.',
    );
  });
});
