import { elapsedOf, type Time } from "@gerak/moves";
import { actor, many, story } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { readSceneModule } from "../src/scene/scene";
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

const limits = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };

function review(module: unknown, options: { to?: number } = {}): SceneReviewResult {
  const read = readSceneModule(module);
  if ("reason" in read) throw new Error(read.reason);
  return reviewSceneModule(read, { ...limits, ...options });
}

describe("motion:review on a scene file", () => {
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
    });
    expect(parseSceneReviewArgs(["s.ts", "--to", "900", "--hold", "100", "--jump", "9"])).toEqual({
      kind: "ok",
      file: "s.ts",
      to: 900,
      hold: 100,
      jump: 9,
      turn: 150,
      ratio: 1.5,
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
    expect(findings).toContain("the final pose holds only 192 ms");
  });

  it("reports a target still moving on the last frame", () => {
    expect(review(moving).findings).toEqual(["drift is still moving on the last frame"]);
  });

  it("stops at --to, and reads turn fields in degrees against the same limit", () => {
    expect(review(flawed, { to: 400 }).findings.some((line) => line.includes("jumps"))).toBe(false);
    const turning = readSceneModule({
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

describe("motion:review holds a skin to its cast", () => {
  const stage = (css: string) => ({
    beats: story(400, { show: [0, 400] }),
    cast: { box: actor({ still: true }), dust: many(2, { still: true }) },
    skins: { dom: { css } },
    scene: () => ({}),
  });

  it("finds a data-cast or data-path rule that names no member, once per name", () => {
    const { findings } = review(
      stage(
        `[data-cast="box"] { z-index: 1; } [data-path="ghost"] { fill: red; } [data-cast="ghost"] { opacity: 0.5; } [data-cast="dust.1"] { color: red; } [data-cast='spook'] { color: blue; }`,
      ),
    );
    expect(findings).toEqual([
      'skin rule names "ghost", which is not in the cast.',
      'skin rule names "spook", which is not in the cast.',
    ]);
  });

  it("finds nothing in a skin that names its members, a list and its items, or none", () => {
    expect(
      review(
        stage(
          '[data-cast="box"] { z-index: 1; } [data-cast="dust"] { x: 1; } [data-cast="dust.0"] { x: 2; } [data-cast^="du"] { x: 3; }',
        ),
      ).findings,
    ).toEqual([]);
    expect(review(stage("")).findings).toEqual([]);
  });

  it("reads an unquoted name, skips comments, and finds a stroke rule on a member with no path", () => {
    expect(
      review(
        stage(
          '/* [data-cast="old"] */ [data-cast=bogus] { x: 1; } [data-path="box"] { fill: red; }',
        ),
      ).findings,
    ).toEqual([
      'skin rule names "bogus", which is not in the cast.',
      'skin rule styles "box" as a stroke, but it has no path.',
    ]);
  });
});

describe("motion:review on a value's shape", () => {
  const line = [
    { id: "a", x0: 0, y0: 0, x1: 5, y1: 0, x2: 10, y2: 0, x3: 20, y3: 0 },
    { id: "b", x0: 20, y0: 0, x1: 25, y1: 5, x2: 30, y2: 5, x3: 40, y3: 0 },
  ];
  const stage = (cast: Record<string, ReturnType<typeof actor>>) => ({
    beats: story(2000, { show: [0, 2000] }),
    cast,
    skins: { dom: { css: "" } },
    scene: (time: { progress: number }) => ({ mouth: { shape: Math.min(1, time.progress * 4) } }),
  });

  it("finds a member given shape that has no shapes, once", () => {
    const { findings } = review(stage({ mouth: actor({ path: line }) }));
    expect(findings).toEqual(['cast member "mouth" is given shape, but has no shapes.']);
  });

  it("finds nothing when the member has shapes", () => {
    const shaped = actor({
      path: line,
      shapes: [line.map((c) => ({ ...c, y0: c.y0 + 4, y3: c.y3 + 4 }))],
    });
    expect(review(stage({ mouth: shaped })).findings).toEqual([]);
  });
});

describe("motion:review on time itself", () => {
  const ms = (time: Time): number => elapsedOf(time.clock) ?? 0;
  const drifting = (ongoing: boolean) => ({
    beats: story(1000, { all: [0, 1000] }),
    cast: { snow: actor({ ongoing }) },
    skins: {},
    scene: (time: Time) => ({ snow: { y: ms(time) / 10 } }),
  });

  it("asks a member to rest at the end unless it is ongoing", () => {
    expect(review(drifting(false)).findings).toContain("snow is still moving on the last frame");
    expect(review(drifting(true)).findings).not.toContain("snow is still moving on the last frame");
  });

  it("reports a value that differs when sought from when played to", () => {
    let peak = 0;
    const remembering = {
      ...drifting(true),
      scene: (time: Time) => {
        peak = Math.max(peak, ms(time));
        return { snow: { y: peak / 10 } };
      },
    };
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
