import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  clamp,
  elapsedOf,
  inputs,
  motion,
  pageInputs,
  pointer,
  scroll,
  springTo,
  state,
  transition,
  triggers,
  value,
  type Input,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { beat, bind, box, object, scene, scrollPoint, stagger } from "@gerak/stage";
import { afterEach, describe, expect, it } from "vitest";
import type { MeasureCache } from "../src/page/measure-cache";
import { NO_INPUTS, directStage, readModule, type MemberInput } from "./stage-definitions";
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
import * as stageShots from "./fixtures/stage-shots";
import { removeTemp } from "../../../test/support/temp";

const limits = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };

function review(
  module: unknown,
  options: { to?: number; events?: Input } = {},
  measured?: MeasureCache,
): SceneReviewResult {
  const read = readModule(module, measured);
  if ("reason" in read) throw new Error(read.reason);
  return reviewSceneModule(read, { ...limits, ...options });
}

/** The findings about the motion, without the cost ones, which follow the machine's load. */
function motionFindings(found: SceneReviewResult): readonly string[] {
  return found.findings.filter(
    (line) => !line.startsWith("cost grows with time") && !line.startsWith("a step costs over"),
  );
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
    expect(parseSceneReviewArgs(["s.ts", "--measure", "--to", "900"])).toEqual({
      kind: "ok",
      file: "s.ts",
      to: 900,
      measure: true,
      hold: 500,
      jump: 150,
      turn: 150,
      ratio: 1.5,
      budget: 8,
    });
    expect(parseSceneReviewArgs(["s.ts", "--measure", "--measure"]).kind).toBe("usage");
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
    expect(motionFindings(review(clean))).toEqual([]);
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
  const stage = (mouth: MemberInput) =>
    directStage({
      beats: { show: [0, 2000] },
      members: [mouth],
      scene: ({ time }) => ({ mouth: { shape: Math.min(1, time.progress * 4) } }),
    });

  it("finds a member given shape that has no shapes, once", () => {
    const { findings } = review(
      stage({
        name: "mouth",
        expect: "settle",
        inputs: NO_INPUTS,
        kind: "actor",
        content: { kind: "stroke", path: line },
      }),
    );
    expect(findings).toEqual(['cast member "mouth" is given shape, but has no shapes.']);
  });

  it("finds nothing when the member has shapes", () => {
    const target = line.map((c) => ({ ...c, y0: c.y0 + 4, y3: c.y3 + 4 }));
    expect(
      motionFindings(
        review(
          stage({
            name: "mouth",
            expect: "settle",
            inputs: NO_INPUTS,
            kind: "actor",
            content: { kind: "morph", shapes: [line, target] },
          }),
        ),
      ),
    ).toEqual([]);
  });
});

describe("gerak review on time itself", () => {
  const ms = (time: Time): number => elapsedOf(time.clock) ?? 0;
  const drifting = (ambient: boolean) =>
    directStage({
      beats: { all: [0, 1000] },
      members: [
        {
          name: "snow",
          expect: ambient ? "ambient" : "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: ({ time }) => ({ snow: { y: ms(time) / 10 } }),
    });

  it("asks a settle member to rest at the end while an ambient member skips settle", () => {
    expect(review(drifting(false)).findings).toContain("snow is still moving on the last frame");
    expect(review(drifting(true)).findings).not.toContain("snow is still moving on the last frame");
  });

  it("reports a value that differs when sought from when played to", () => {
    let peak = 0;
    const remembering = directStage({
      beats: { all: [0, 1000] },
      members: [
        {
          name: "snow",
          expect: "ambient",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
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

  it("reads a custom field its target declares under `steps` as a step, and no other field", () => {
    const flavour = {
      scene: (time: Time) => ({
        character: { custom: { flavour: step(time) * 3, blink: step(time) === 2 ? 2 : 0 } },
      }),
    };
    expect(moved(flavour).some((line) => line.startsWith("character.custom.flavour"))).toBe(true);
    const found = moved({ ...flavour, limits: { character: { steps: ["flavour"] } } });
    expect(found.some((line) => line.startsWith("character.custom.flavour"))).toBe(false);
    expect(found).toContain("character.custom.blink jumps 2 at 32 ms");
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

describe("gerak review of shots", () => {
  it("reviews a reel of shots clean, each title holding at the end of its shot", () => {
    const read = readModule(stageShots);
    if ("reason" in read) throw new Error(read.reason);
    expect(read.stage?.shots?.map(({ name }) => name)).toEqual(["hook", "story", "call"]);
    expect(motionFindings(review(stageShots))).toEqual([]);
  });
});

describe("gerak review expectations and shape mismatches", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) removeTemp(dir);
  });

  it("enforces ambient limits and the measured frame's bounds while skipping settle rest check", () => {
    const measured = (
      frame: { readonly width: number; readonly height: number },
      rest: MeasureCache["rest"] = {},
    ): MeasureCache => ({ page: "orb.html", digest: "", frame, rest, lines: {}, parents: {} });
    const orbMember: MemberInput = {
      name: "orb",
      expect: "ambient",
      inputs: NO_INPUTS,
      kind: "actor",
      content: { kind: "box" },
    };
    const cleanAmbient = directStage({
      beats: { loop: [0, 1000] },
      members: [orbMember],
      scene: ({ time }) => ({
        orb: { x: 200 + 50 * Math.sin(time.progress * Math.PI * 2), y: 150 },
      }),
    });
    expect(motionFindings(review(cleanAmbient, {}, measured({ width: 400, height: 300 })))).toEqual(
      [],
    );

    const outOfBounds = directStage({
      beats: { loop: [0, 1000] },
      members: [orbMember],
      scene: ({ time }) => ({ orb: { x: 350 * time.progress } }),
    });
    const orbRest: MeasureCache["rest"] = {
      orb: { x: 100, y: 100, width: 20, height: 20, placement: { kind: "flow" } },
    };
    const bounded = measured({ width: 400, height: 300 }, orbRest);
    expect(
      review(outOfBounds, {}, bounded).findings.some((line) => /leaves stage bounds/.test(line)),
    ).toBe(true);
    expect(review(outOfBounds).findings.some((line) => /leaves stage bounds/.test(line))).toBe(
      false,
    );

    const jumpingAmbient = directStage({
      beats: { loop: [0, 1000] },
      members: [orbMember],
      limits: { orb: { jump: 10 } },
      scene: ({ time }) => ({ orb: { x: time.progress < 0.5 ? 100 : 300 } }),
    });
    expect(review(jumpingAmbient).findings.some((line) => /orb\.x jumps/.test(line))).toBe(true);
  });

  it("reports a list item that throws as a finding, and no never-moved noise beside it", () => {
    const broken = directStage({
      beats: { show: [0, 400] },
      members: [
        { name: "row", expect: "settle", inputs: NO_INPUTS, kind: "list" },
        {
          name: "dot",
          expect: "settle",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: () => ({
        row: (i: number) => {
          if (i === 1) throw new Error("boom");
          return { x: i };
        },
      }),
    });
    const cache: MeasureCache = {
      page: "row.html",
      digest: "",
      frame: { width: 400, height: 300 },
      rest: {
        "row.0": { x: 0, y: 0, width: 10, height: 10, placement: { kind: "flow" } },
        "row.1": { x: 20, y: 0, width: 10, height: 10, placement: { kind: "flow" } },
      },
      lines: {},
      parents: {},
    };
    expect(review(broken, {}, cache).findings).toEqual(["boom"]);
  });

  it("judges an ambient member's bounds only where its box and frame are measured", () => {
    const unmeasured = directStage({
      beats: { show: [0, 400] },
      members: [
        {
          name: "flake",
          expect: "ambient",
          inputs: NO_INPUTS,
          kind: "actor",
          content: { kind: "box" },
        },
      ],
      scene: ({ time }) => ({ flake: { x: -10 + 5 * Math.sin(time.progress * 6) } }),
    });
    expect(review(unmeasured).findings.filter((line) => /bounds/.test(line))).toEqual([]);
    const cache: MeasureCache = {
      page: "flake.html",
      digest: "",
      frame: { width: 100, height: 100 },
      rest: { flake: { x: 5, y: 5, width: 4, height: 4, placement: { kind: "flow" } } },
      lines: {},
      parents: {},
    };
    expect(
      review(unmeasured, {}, cache).findings.filter((line) => /bounds/.test(line)),
    ).toHaveLength(1);
  });

  it("emits findings for frame shape_mismatch errors instead of throwing", () => {
    const mismatch = directStage({
      beats: { show: [0, 400] },
      members: [{ name: "dots", expect: "settle", inputs: NO_INPUTS, kind: "list" }],
      scene: () => ({ dots: [{ x: 0 }] }),
    });
    expect(review(mismatch).findings).toContain(
      'scene: "dots" is a list: give it `(index, count) => pose`, got an array.',
    );
  });

  it("exempts scroll-beat, trigger-beat, and input-driven settle members that move under their driver", () => {
    const sec = box("sec");
    const sb = beat("scroll", { scroll: [sec.top, sec.end] });
    const tb = beat("trigger", 400, { when: scrollPoint(300).reached, back: "reverse" });
    const smoothBeat = beat("smooth", { scroll: [scrollPoint(0), scrollPoint(500)], smooth: true });
    const slide = motion((t: Time): Pose2d => ({ x: 80 * t.progress }));
    const measured: MeasureCache = {
      page: "scroll.html",
      digest: "",
      frame: { width: 1000, height: 600 },
      rest: {
        sec: { x: 500, y: 800, width: 1000, height: 600, placement: { kind: "flow" } },
        "sList.0": { x: 10, y: 10, width: 10, height: 10, placement: { kind: "flow" } },
        "sList.1": { x: 30, y: 10, width: 10, height: 10, placement: { kind: "flow" } },
        "tList.0": { x: 10, y: 40, width: 10, height: 10, placement: { kind: "flow" } },
        "tList.1": { x: 30, y: 40, width: 10, height: 10, placement: { kind: "flow" } },
      },
      lines: {},
      parents: {},
    };
    const piece = scene(
      { length: 1000 },
      box("sActor").moves(slide.in(sb)),
      box("sList", { parts: true }).moves(stagger(slide, { spread: 0.2 }).in(sb)),
      box("tActor").moves(slide.in(tb)),
      box("tList", { parts: true }).moves(stagger(slide, { spread: 0.2 }).in(tb)),
      box("pointed").moves(bind({ x: (t, e) => pointer.x(t, e) * 40 })),
      box("scrolledBind").moves(bind({ y: (t, e) => scroll.y(t, e) * 0.2 })),
      box("smoothed").moves(slide.in(smoothBeat)),
    );

    expect(motionFindings(review(piece, {}, measured))).toEqual([]);
  });

  it("still flags genuinely static settle members even inside scroll or trigger beats", () => {
    const sb = beat("scroll", { scroll: [scrollPoint(100), scrollPoint(500)] });
    const tb = beat("trigger", 400, { when: scrollPoint(300).reached, back: "stay" });
    const noop = motion((): Pose2d => ({ x: 0 }));
    const piece = scene(
      { length: 1000 },
      box("staticScroll").moves(noop.in(sb)),
      box("staticTrigger").moves(noop.in(tb)),
      box("staticUnwindowed").moves(noop),
    );

    const findings = review(piece).findings;
    expect(findings).toContain(
      'cast member "staticScroll" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    );
    expect(findings).toContain(
      'cast member "staticTrigger" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    );
    expect(findings).toContain(
      'cast member "staticUnwindowed" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    );
  });

  it("expands 3D list objects from MeasureCache.counts during reviewSceneModule and sampleScene", () => {
    const enter = beat("enter", 400);
    const cache: MeasureCache = {
      page: "list3d.html",
      digest: "",
      frame: { width: 1000, height: 600 },
      rest: {},
      lines: {},
      parents: {},
      counts: { cookies: 3 },
    };
    const clean3d = scene(
      { length: 1000 },
      object("cookies", { parts: true }).moves(
        stagger(
          motion((t: Time): Pose3d => ({ z: 0.5 * t.progress })),
          { spread: 0.5 },
        ).in(enter),
      ),
    );
    expect(motionFindings(review(clean3d, {}, cache))).toEqual([]);

    const jumping3d = scene(
      { length: 1000 },
      object("cookies", { parts: true }).moves((t, ctx) => ({
        z: ctx.index === 1 && t.progress >= 0.4 ? 200 : 0,
      })),
    );
    const jumpFindings = review(jumping3d, {}, cache).findings;
    expect(jumpFindings.some((line) => line.startsWith("cookies[1].z jumps"))).toBe(true);
  });
});

describe("driver probing and --events in gerak review", () => {
  it("probes sticky scroll placement ranges on unmoved settle members", () => {
    const cache: MeasureCache = {
      page: "sticky.html",
      digest: "",
      frame: { width: 1440, height: 900 },
      rest: {
        slot: {
          x: 900,
          y: 450,
          width: 400,
          height: 400,
          placement: { kind: "sticky", minY: 1850, maxY: 4550, pinY: 450 },
        },
        footer: { x: 720, y: 10000, width: 1440, height: 800, placement: { kind: "flow" } },
      },
      lines: {},
      parents: {},
    };
    const piece = scene(
      { length: 400 },
      box("slot"),
      box("footer"),
      box("panel2").moves((_t, ctx) => {
        const y = scroll.y(ctx.time, ctx.events);
        const p = (y - 1850) / (4550 - 1850);
        return { opacity: p >= 0.48 && p < 0.74 ? 1 : 0 };
      }),
    );
    expect(motionFindings(review(piece, {}, cache))).toEqual([]);
  });

  it("probes pageInputs interaction values on unmoved settle members", () => {
    const hovered = value(pageInputs, "hovered", "btn");
    const piece = scene(
      { length: 400 },
      box("btn"),
      box("lid").moves((_t, ctx) => ({ y: hovered(ctx.time, ctx.events) > 0 ? -12 : 0 })),
    );
    expect(motionFindings(review(piece))).toEqual([]);
  });

  it("passes --events to reviewSceneModule and parses --events in CLI args", () => {
    const count = state(0, (cur, ev) => (ev.name === "jar-add" ? cur + 1 : cur));
    const countSpring = transition(count, { ms: 200 });
    const cache: MeasureCache = {
      page: "jar.html",
      digest: "",
      frame: { width: 1440, height: 900 },
      rest: {},
      lines: {},
      parents: {},
      counts: { cookies: 2 },
    };
    const piece = scene(
      { length: 900 },
      object("cookies", { parts: true }).moves((_t, ctx) => {
        const trans = countSpring(ctx.time, ctx.events);
        return { y: trans.current === 0 ? 0 : trans.progress * 0.2 };
      }),
    );

    expect(review(piece, {}, cache).findings).toContain(
      'cast member "cookies" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    );
    expect(
      review(piece, { events: [{ kind: "trigger", name: "jar-add", at: 100, value: 1 }] }, cache)
        .findings,
    ).toEqual([]);

    expect(parseSceneReviewArgs(["s.ts", "--events", "jar-add=0@200,jar-seal=1@400"])).toEqual({
      kind: "ok",
      file: "s.ts",
      hold: 500,
      jump: 150,
      turn: 150,
      ratio: 1.5,
      budget: 8,
      events: [
        { kind: "value", name: "jar-add", at: 200, value: 0 },
        { kind: "value", name: "jar-seal", at: 400, value: 1 },
      ],
    });
    expect(parseSceneReviewArgs(["s.ts", "--events", "bad-event"]).kind).toBe("usage");
  });

  it("exempts a member that moves only on a contract value", () => {
    const quiz = inputs({ values: { progress: {} } });
    const progress = value(quiz, "progress");

    const valueDriven = scene(
      { length: 400 },
      box("bar").moves((_t, ctx) => ({ scaleX: progress(ctx.time, ctx.events) })),
      box("springBar").moves(bind({ scaleX: springTo(progress, (v) => v) })),
    );
    expect(motionFindings(review(valueDriven))).toEqual([]);

    const onlyMovesFromOne = scene(
      { length: 400 },
      box("stepped").moves((_t, ctx) => ({
        y: progress(ctx.time, ctx.events) === 1 ? 0 : 12,
      })),
    );
    expect(
      motionFindings(
        review(onlyMovesFromOne, {
          events: [{ kind: "value", name: "progress", at: 0, value: 1 }],
        }),
      ),
    ).toEqual([]);
  });

  it("exempts a member that moves only on a contract trigger over 600 ms", () => {
    const quiz = inputs({ triggers: { finish: {} } });
    const finish = triggers(quiz, "finish");

    const triggerDriven = scene(
      { length: 400 },
      box("card").moves((_t, ctx) => {
        const last = finish(ctx.time, ctx.events).at(-1);
        if (last === undefined) return { opacity: 0, y: 20 };
        const elapsed = (elapsedOf(ctx.time.clock) ?? 0) - last.at;
        const p = clamp(elapsed / 600, 0, 1);
        return { opacity: p, y: 20 * (1 - p) };
      }),
    );
    expect(motionFindings(review(triggerDriven))).toEqual([]);
  });

  it("reports a member that reads a contract value or trigger and ignores it, naming what it read", () => {
    const quiz = inputs({
      values: { progress: {}, score: { targets: ["p1", "p2"] } },
      triggers: { finish: {} },
    });
    const progress = value(quiz, "progress");
    const p1Score = value(quiz, "score", "p1");
    const finish = triggers(quiz, "finish");

    const ignoredValue = scene(
      { length: 400 },
      box("bar").moves((_t, ctx) => {
        progress(ctx.time, ctx.events);
        return { scaleX: 1 };
      }),
    );
    expect(review(ignoredValue).findings).toContain(
      'cast member "bar" never moved, even when its inputs changed (value progress); move it, or mark it .static().',
    );

    const ignoredBoth = scene(
      { length: 400 },
      box("panel").moves((_t, ctx) => {
        p1Score(ctx.time, ctx.events);
        finish(ctx.time, ctx.events);
        return { opacity: 1 };
      }),
    );
    expect(review(ignoredBoth).findings).toContain(
      'cast member "panel" never moved, even when its inputs changed (value score:p1, trigger finish); move it, or mark it .static().',
    );
  });

  it("keeps today's never-moved message when a member reads no app input", () => {
    const readsNothing = scene(
      { length: 400 },
      box("plain").moves(() => ({ x: 0 })),
    );
    expect(review(readsNothing).findings).toContain(
      'cast member "plain" is never moved by the scene; move it, or mark it .static() and leave it out of the scene.',
    );
  });
});
