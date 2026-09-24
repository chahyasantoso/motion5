import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { fkPlugin } from "../../../src/plugins/fk";
import { ikPlugin } from "../../../src/plugins/ik";
import { transformPlugin } from "../../../src/plugins/transform";
import { FABRIK_TOLERANCE, solveFabrik } from "../../../src/plugins/fabrik";
import { pivotFromBaseTip, type WorldFrame } from "../../../src/plugins/frame";
import type { JointRange } from "../../../src/plugins/ik-constraint";
import { solveLength, solveOffset, type SolveMember } from "../../../src/plugins/ik-member";
import type { SolveResult } from "../../../src/plugins/ik-result";
import {
  SOLVE_MAGNITUDE_CEILING,
  restoreResult,
  scaleRig,
  solveMagnitude,
} from "../../../src/plugins/ik-scale";
import { chainShape, solveChain } from "../../../src/plugins/ik-solve";

// Issue #349 phase 6 and ADR-111: stability and determinism of the 2D solve.
//
// Every case here is about a property the solve holds for every input rather than a number it
// publishes for one rig, so most of them read a seeded corpus. The generator is a fixed mulberry32
// stream, so a failure names a reproducible rig rather than a flaky one, and a corpus is small
// enough to run in the ordinary suite: the 200,000-rig byte-identity measurement lives in the pull
// request, not here.

const ORIGIN: WorldFrame = { x: 0, y: 0, rotation: 0 };

function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Rig {
  readonly root: WorldFrame;
  readonly members: readonly SolveMember[];
  readonly flip: boolean;
}

/**
 * One seeded rig of one to six members, parent first, linear or branching, with offsets, limits and
 * influence on some members and a goal on every leaf, which is what load guarantees.
 */
function rigFrom(random: () => number, scale = 1, limits = true): Rig {
  const pick = (low: number, high: number): number => low + (high - low) * random();
  const arity = 1 + Math.floor(random() * 6);
  const branching = arity >= 3 && random() < 0.4;
  const drafts: {
    id: string;
    base: string;
    length: number;
    pivot?: { x: number; y: number };
    limit?: JointRange;
  }[] = [];
  for (let index = 0; index < arity; index += 1) {
    const parent = branching ? Math.floor(random() * index) : index - 1;
    const draft: (typeof drafts)[number] = {
      id: `m${index}`,
      base: index === 0 ? "root" : `m${parent}`,
      length: random() < 0.05 ? 0 : pick(0.5, 200) * scale,
    };
    if (random() < 0.25) draft.pivot = { x: pick(-40, 40) * scale, y: pick(-40, 40) * scale };
    if (limits && random() < 0.25) {
      const min = pick(-180, 170);
      draft.limit = { kind: "range", min, max: pick(min, 180) };
    }
    drafts.push(draft);
  }
  const based = new Set(drafts.map((draft) => draft.base));
  const members = drafts.map((draft): SolveMember => {
    if (based.has(draft.id)) return draft;
    const goal = { x: pick(-400, 400) * scale, y: pick(-400, 400) * scale, rotation: 0 };
    return random() < 0.3 ? { ...draft, goal, influence: pick(0.01, 10) } : { ...draft, goal };
  });
  const root = {
    x: pick(-300, 300) * scale,
    y: pick(-300, 300) * scale,
    rotation: pick(-360, 360),
  };
  return { root, members, flip: random() < 0.5 };
}

function corpus(seed: number, count: number, scale = 1, limits = true): readonly Rig[] {
  const random = seeded(seed);
  return Array.from({ length: count }, () => rigFrom(random, scale, limits));
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    for (const key of Object.keys(value)) deepFreeze((value as Record<string, unknown>)[key]);
    Object.freeze(value);
  }
  return value;
}

/** Structural identity under `Object.is`, key order included: the byte-identity comparison. */
function identical(a: unknown, b: unknown): boolean {
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null)
    return Object.is(a, b);
  const left = Object.keys(a);
  const right = Object.keys(b);
  if (left.length !== right.length || left.some((key, index) => key !== right[index])) return false;
  return left.every((key) =>
    identical((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
  );
}

function everyFinite(result: SolveResult): boolean {
  return (
    Number.isFinite(result.quality.residual) &&
    Object.values(result.rotations).every(Number.isFinite) &&
    Object.values(result.residuals).every(Number.isFinite)
  );
}

function twoBone(l1: number, l2: number, goal: WorldFrame): readonly SolveMember[] {
  return [
    { id: "upper", base: "root", length: l1 },
    { id: "lower", base: "upper", length: l2, goal },
  ];
}

function scaled(rig: Rig, factor: number): Rig {
  const frame = (f: WorldFrame): WorldFrame => ({
    x: f.x * factor,
    y: f.y * factor,
    rotation: f.rotation,
  });
  return {
    root: frame(rig.root),
    flip: rig.flip,
    members: rig.members.map((member) => ({
      ...member,
      length: member.length * factor,
      ...(member.pivot === undefined
        ? {}
        : { pivot: { x: member.pivot.x * factor, y: member.pivot.y * factor } }),
      ...(member.goal === undefined ? {} : { goal: frame(member.goal) }),
    })),
  };
}

/** The shortest signed turn from `from` to `to`, in `(-180, 180]`. */
function turn(from: number, to: number): number {
  const delta = ((((to - from + 180) % 360) + 360) % 360) - 180;
  return delta === -180 ? 180 : delta;
}

describe("IK stability and determinism (issue #349 phase 6)", () => {
  it("SD-1 the closed form is finite and scale-free at tiny, huge and mixed magnitudes", () => {
    // Before this phase all three published `NaN`: the law of cosines squared its sides, and
    // `1e160` squared to `Infinity` while `1e-170` squared to zero.
    const unit = twoBone(80, 60, { x: 120, y: 40, rotation: 0 });
    const reference = solveChain(ORIGIN, unit);
    for (const factor of [2 ** -700, 2 ** -560, 2 ** 480, 2 ** 530]) {
      const rig = scaled({ root: ORIGIN, members: unit, flip: false }, factor);
      const result = solveChain(rig.root, rig.members);
      expect(everyFinite(result)).toBe(true);
      expect(result.quality.kind).toBe("reached");
      // A power-of-two scale is exact, so the scale-free angles are the unit rig's bit for bit.
      expect(identical(result.rotations, reference.rotations)).toBe(true);
    }
    const mixed = solveChain(
      { x: 1, y: 0, rotation: 0 },
      twoBone(2e-200, 1e-200, { x: 1, y: 0, rotation: 0 }),
    );
    expect(everyFinite(mixed)).toBe(true);
    expect(mixed.quality.kind).toBe("too-near");
    expect(mixed.quality.residual).toBe(1e-200);
    // A second segment below `2 ** -1074` of the link has no extent even at unit magnitude, so the
    // elbow beside it reads nothing and answers the aligned angle rather than `0 / 0`.
    const sliver = twoBone(2 ** 500, 2 ** -600, { x: 2 ** 500, y: 0, rotation: 0 });
    const aligned = solveChain(ORIGIN, sliver);
    expect(aligned.rotations).toEqual({ upper: 0, lower: -180 });
    expect(aligned.quality).toEqual({ kind: "reached", residual: 0 });
    // The worked rig of ADR-051 still publishes its two pinned numbers through the scaled law.
    const worked = solveChain(
      { x: 200, y: 300, rotation: 0 },
      twoBone(80, 60, { x: 320, y: 340, rotation: 0 }),
    );
    expect(worked.rotations.upper).toBeCloseTo(40.168, 3);
    expect(worked.rotations.lower).toBeCloseTo(-51.3178, 4);
  });

  it("SD-2 a rig past the magnitude ceiling solves as its exact power-of-two image", () => {
    const huge: readonly SolveMember[] = [
      { id: "a", base: "root", length: Number.MAX_VALUE / 2 },
      { id: "b", base: "a", length: Number.MAX_VALUE / 2 },
      {
        id: "c",
        base: "b",
        length: Number.MAX_VALUE / 2,
        goal: { x: Number.MAX_VALUE / 2, y: 0, rotation: 0 },
      },
    ];
    const magnitude = solveMagnitude(ORIGIN, huge);
    expect(magnitude.kind).toBe("rescaled");
    if (magnitude.kind !== "rescaled") throw new Error("expected a rescaled magnitude");
    const result = solveChain(ORIGIN, huge);
    expect(everyFinite(result)).toBe(true);
    const image = scaleRig(ORIGIN, huge, magnitude.exponent);
    expect(Math.max(...image.members.map((member) => member.length))).toBeLessThanOrEqual(
      SOLVE_MAGNITUDE_CEILING,
    );
    const imageResult = solveChain(image.root, image.members);
    expect(identical(result.rotations, imageResult.rotations)).toBe(true);
    expect(identical(result, restoreResult(imageResult, magnitude.exponent))).toBe(true);
    // The ceiling itself is native and one binary order past it is not, by one order.
    const at = [{ id: "a", base: "root", length: SOLVE_MAGNITUDE_CEILING, goal: ORIGIN }];
    expect(solveMagnitude(ORIGIN, at)).toEqual({ kind: "native" });
    const past = [{ id: "a", base: "root", length: SOLVE_MAGNITUDE_CEILING * 2, goal: ORIGIN }];
    expect(solveMagnitude(ORIGIN, past)).toEqual({ kind: "rescaled", exponent: 1 });
    // Every world-unit field counts toward the magnitude and a rotation does not.
    const offsetOnly = [
      { id: "a", base: "root", length: 1, pivot: { x: 0, y: -(2 ** 510) }, goal: ORIGIN },
    ];
    expect(solveMagnitude(ORIGIN, offsetOnly).kind).toBe("rescaled");
    const turned = [{ id: "a", base: "root", length: 1, goal: { x: 1, y: 0, rotation: 2 ** 600 } }];
    expect(solveMagnitude({ x: 0, y: 0, rotation: 2 ** 600 }, turned).kind).toBe("native");
  });

  it("SD-3 a residual past the largest double saturates rather than overflowing", () => {
    const root = { x: -Number.MAX_VALUE, y: 0, rotation: 0 };
    const members = [
      { id: "a", base: "root", length: 1, goal: { x: Number.MAX_VALUE, y: 0, rotation: 0 } },
    ];
    const result = solveChain(root, members);
    expect(result.quality.residual).toBe(Number.MAX_VALUE);
    expect(result.residuals).toEqual({ a: Number.MAX_VALUE });
    expect(result.rotations.a).toBe(0);
  });

  it("SD-4 a solve does not depend on the order its members are listed in", () => {
    // `[child, parent]` used to reach the closed form as if the child hung from the root.
    const members = [
      { id: "a", base: "root", length: 2 },
      { id: "b", base: "a", length: 1, goal: { x: 2, y: 1, rotation: 0 } },
    ];
    const forward = solveChain(ORIGIN, members);
    const reversed = solveChain(ORIGIN, [members[1]!, members[0]!]);
    expect(identical(reversed, forward)).toBe(true);
    expect(chainShape([members[1]!, members[0]!]).kind).toBe("two-bone");
    // Two siblings off the root, and a goal on the parent, are not the closed form's pair.
    const siblings = [
      { id: "a", base: "root", length: 2, goal: { x: 2, y: 0, rotation: 0 } },
      { id: "b", base: "root", length: 1 },
    ];
    expect(chainShape(siblings).kind).toBe("tree");
    const parentGoal = [
      { id: "a", base: "root", length: 2, goal: { x: 2, y: 0, rotation: 0 } },
      { id: "b", base: "a", length: 1 },
    ];
    expect(chainShape(parentGoal).kind).toBe("tree");
    // Malformed pairs answer the same from either order: a cycle and a self-based member reach
    // FABRIK, which refuses them by name, and a goal on both members is not the closed form's pair.
    const goal = { x: 2, y: 1, rotation: 0 };
    const malformed: readonly (readonly [SolveMember, SolveMember])[] = [
      [
        { id: "a", base: "b", length: 2 },
        { id: "b", base: "a", length: 1, goal },
      ],
      [
        { id: "a", base: "a", length: 2 },
        { id: "b", base: "a", length: 1, goal },
      ],
      [
        { id: "a", base: "root", length: 2 },
        { id: "b", base: "b", length: 1, goal },
      ],
    ];
    for (const [x, y] of malformed) {
      expect(chainShape([x, y]).kind).toBe("tree");
      expect(chainShape([y, x]).kind).toBe("tree");
      expect(() => solveChain(ORIGIN, [x, y])).toThrow(/cycles at member/);
      expect(() => solveChain(ORIGIN, [y, x])).toThrow(/cycles at member/);
    }
    const bothAddressed = [
      { id: "a", base: "root", length: 2, goal },
      { id: "b", base: "a", length: 1, goal },
    ];
    expect(chainShape(bothAddressed).kind).toBe("tree");
    expect(
      identical(
        solveChain(ORIGIN, [bothAddressed[1]!, bothAddressed[0]!]),
        solveChain(ORIGIN, bothAddressed),
      ),
    ).toBe(true);
    const neither = [
      { id: "a", base: "root", length: 2 },
      { id: "b", base: "a", length: 1 },
    ];
    expect(() => chainShape(neither)).toThrow(
      "ikPlugin requires at least one goal; 2 members received none.",
    );
    const random = seeded(0x5d04);
    for (const rig of corpus(0x5d04, 400)) {
      const shuffled = [...rig.members];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const other = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other]!, shuffled[index]!];
      }
      expect(
        identical(
          solveChain(rig.root, shuffled, rig.flip),
          solveChain(rig.root, rig.members, rig.flip),
        ),
      ).toBe(true);
    }
  });

  it("SD-5 a solve is pure: repeated and interleaved solves agree, inputs untouched", () => {
    const rigs = corpus(0x5d05, 300).map(deepFreeze);
    const first = rigs.map((rig) => solveChain(rig.root, rig.members, rig.flip));
    // Interleaved in reverse, so every solve follows a different rig than it did the first time.
    const second = [...rigs]
      .reverse()
      .map((rig) => solveChain(rig.root, rig.members, rig.flip))
      .reverse();
    rigs.forEach((_, index) => expect(identical(second[index], first[index])).toBe(true));
    for (const result of first) {
      expect(Object.isFrozen(result.rotations)).toBe(true);
      expect(Object.isFrozen(result.residuals)).toBe(true);
      expect(Object.isFrozen(result.quality)).toBe(true);
    }
  });

  it("SD-6 FABRIK keeps every length and never moves the root", () => {
    for (const rig of corpus(0x5d06, 400)) {
      const solution = solveFabrik(rig.root, rig.members, rig.flip);
      const byId = new Map(rig.members.map((member) => [member.id, member]));
      for (const member of rig.members) {
        const pivot = solution.pivots[member.id]!;
        const tip = solution.tips[member.id]!;
        const length = solveLength(member);
        expect(Math.abs(Math.hypot(tip.x - pivot.x, tip.y - pivot.y) - length)).toBeLessThanOrEqual(
          1e-9 * Math.max(1, length),
        );
        if (!byId.has(member.base)) {
          const fixed = pivotFromBaseTip(rig.root, rig.root.rotation, solveOffset(member));
          expect(Object.is(pivot.x, fixed.x) && Object.is(pivot.y, fixed.y)).toBe(true);
        }
      }
    }
  });

  it("SD-7 a goal on the root answers a finite pose on both strategies", () => {
    const closed = solveChain(ORIGIN, twoBone(50, 50, ORIGIN));
    expect(closed.quality.kind).toBe("coincident");
    expect(closed.rotations).toEqual({ upper: 0, lower: 0 });
    expect(everyFinite(closed)).toBe(true);
    const members = [
      { id: "a", base: "root", length: 30 },
      { id: "b", base: "a", length: 30 },
      { id: "c", base: "b", length: 30, goal: ORIGIN },
    ];
    const iterative = solveChain(ORIGIN, members);
    expect(everyFinite(iterative)).toBe(true);
    expect(iterative.quality.residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
    const zero = [
      { id: "a", base: "root", length: 0 },
      { id: "b", base: "a", length: -0 },
      { id: "c", base: "b", length: 0, goal: ORIGIN },
    ];
    expect(solveChain(ORIGIN, zero).rotations).toEqual({ a: 0, b: 0, c: 0 });
  });

  it("SD-8 exact full extension reaches, and the band edge is continuous on both sides", () => {
    const at = solveChain(ORIGIN, twoBone(80, 60, { x: 140, y: 0, rotation: 0 }));
    expect(at.quality).toEqual({ kind: "reached", residual: 0 });
    expect(Object.is(at.rotations.lower, 0)).toBe(true);
    for (const epsilon of [1e-12, 1e-9]) {
      const inside = solveChain(ORIGIN, twoBone(80, 60, { x: 140 - epsilon, y: 0, rotation: 0 }));
      const outside = solveChain(ORIGIN, twoBone(80, 60, { x: 140 + epsilon, y: 0, rotation: 0 }));
      expect(inside.quality.kind).toBe("reached");
      expect(outside.quality.kind).toBe("too-far");
      expect(outside.quality.residual).toBe(140 + epsilon - 140);
      expect(Math.abs(inside.rotations.lower!)).toBeLessThan(0.01);
      expect(outside.rotations).toEqual(at.rotations);
    }
    const straight = [
      { id: "a", base: "root", length: 40 },
      { id: "b", base: "a", length: 50 },
      { id: "c", base: "b", length: 50, goal: { x: 0, y: 140, rotation: 0 } },
    ];
    const iterative = solveChain(ORIGIN, straight);
    expect(iterative.quality.kind).toBe("converged");
    expect(iterative.quality.residual).toBeLessThanOrEqual(FABRIK_TOLERANCE);
  });

  it("SD-9 unconstrained rotations stay unwrapped and a whole root turn is one pose", () => {
    // ADR-111 keeps the published angle unwrapped rather than folding it into (-180, 180]: folding
    // would move published bytes for every rig whose root turns past a half turn, and `lerpAngle`
    // already blends along the short arc whatever the separation.
    const goal = { x: 120, y: 40, rotation: 0 };
    for (const members of [
      twoBone(80, 60, goal),
      [...twoBone(80, 60, goal)].map((m, i) => (i === 0 ? m : { ...m, base: "upper" })),
      [
        { id: "upper", base: "root", length: 60 },
        { id: "mid", base: "upper", length: 40 },
        { id: "lower", base: "mid", length: 40, goal },
      ],
    ]) {
      const plain = solveChain({ x: 0, y: 0, rotation: 30 }, members);
      const turned = solveChain({ x: 0, y: 0, rotation: 30 + 720 }, members);
      expect(turned.rotations.upper! - plain.rotations.upper!).toBeCloseTo(-720, 9);
      expect(turned.rotations.upper).toBeLessThan(-180);
      for (const id of Object.keys(plain.rotations).filter((key) => key !== "upper"))
        expect(turned.rotations[id]).toBeCloseTo(plain.rotations[id]!, 9);
    }
  });

  it("SD-10 no rotation turns further per step than its goal as the goal sweeps the chain", () => {
    const steps = 720;
    const three = (goal: WorldFrame): readonly SolveMember[] => [
      { id: "a", base: "root", length: 40 },
      { id: "b", base: "a", length: 40 },
      { id: "c", base: "b", length: 40, goal },
    ];
    for (const [make, flip] of [
      [(goal: WorldFrame) => twoBone(80, 60, goal), false],
      [(goal: WorldFrame) => twoBone(80, 60, goal), true],
      [three, false],
      [three, true],
    ] as const) {
      let previous: Readonly<Record<string, number>> | undefined;
      let largest = 0;
      for (let step = 0; step <= steps; step += 1) {
        const angle = (2 * Math.PI * step) / steps;
        const goal = { x: 90 * Math.cos(angle), y: 90 * Math.sin(angle), rotation: 0 };
        const { rotations } = solveChain(ORIGIN, make(goal), flip);
        if (previous !== undefined)
          for (const id of Object.keys(rotations))
            largest = Math.max(largest, Math.abs(turn(previous[id]!, rotations[id]!)));
        previous = rotations;
      }
      // The goal turns half a degree per step about the root, and no rotation turns further.
      expect(largest).toBeLessThanOrEqual(360 / steps + 1e-9);
    }
    // Radially, through the full-extension edge and out past it, nothing jumps either. The bend
    // opens as the square root of the distance to the edge, so the step is fine enough for a
    // continuous answer to stay under a quarter degree and a jump of any size to fail.
    let previous: Readonly<Record<string, number>> | undefined;
    for (let step = 0; step <= 20000; step += 1) {
      const reach = 139 + step * 1e-4;
      const goal = { x: reach * 0.6, y: reach * 0.8, rotation: 0 };
      const { rotations } = solveChain(ORIGIN, twoBone(80, 60, goal));
      if (previous !== undefined)
        for (const id of Object.keys(rotations))
          expect(Math.abs(turn(previous[id]!, rotations[id]!))).toBeLessThan(0.25);
      previous = rotations;
    }
  });

  it("SD-11 limited members stay inside their bounds and every output is finite", () => {
    for (const rig of corpus(0x5d11, 600)) {
      const result = solveChain(rig.root, rig.members, rig.flip);
      expect(everyFinite(result)).toBe(true);
      for (const member of rig.members) {
        if (member.limit === undefined) continue;
        const rotation = result.rotations[member.id]!;
        expect(rotation).toBeGreaterThanOrEqual(member.limit.min);
        expect(rotation).toBeLessThanOrEqual(member.limit.max);
      }
    }
    for (const factor of [1e-200, 1e-160, 1e155, 1e300]) {
      for (const rig of corpus(0x5d12, 150, factor)) {
        expect(everyFinite(solveChain(rig.root, rig.members, rig.flip))).toBe(true);
      }
    }
  });

  it("SD-12 reverse scrub and random seek republish the forward pass byte for byte", () => {
    const stop = (p: number, v: number) => ({ p, v });
    const project: ProjectDefinition = {
      schemaVersion: 5,
      projectId: "ik-determinism",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "root",
              keyframes: {
                transform: {
                  values: {
                    x: [stop(0, 0), stop(1, 40)],
                    y: [stop(0, 0), stop(1, 20)],
                    rotation: [stop(0, 0), stop(1, 200)],
                  },
                },
              },
            },
            {
              id: "goal",
              keyframes: {
                transform: {
                  values: {
                    x: [stop(0, 90), stop(0.5, -60), stop(1, 120)],
                    y: [stop(0, 10), stop(0.5, 70), stop(1, -30)],
                    rotation: 0,
                  },
                },
              },
            },
            {
              id: "solve",
              keyframes: {
                ik: { values: { inspect: true }, requires: { root: "root", target: "goal" } },
              },
            },
            {
              id: "a",
              keyframes: {
                fk: { values: { length: 60 }, requires: { base: "root", solver: "solve" } },
              },
            },
            {
              id: "b",
              keyframes: {
                fk: { values: { length: 50 }, requires: { base: "a", solver: "solve" } },
              },
            },
          ],
        },
      ],
    };
    const ids = ["rig/root", "rig/goal", "rig/solve", "rig/a", "rig/b"];
    // A structural snapshot rather than `JSON.stringify`, which would read `-0` as `0` and `NaN` as
    // `null`, the two distinctions this series exists to hold; compared by `identical` below.
    const snapshot = (value: unknown): unknown => {
      if (typeof value !== "object" || value === null) return value;
      if (Array.isArray(value)) return value.map(snapshot);
      return Object.fromEntries(
        Object.entries(value).map(([key, entry]) => [key, snapshot(entry)]),
      );
    };
    const replay = (sequence: readonly number[]): ReadonlyMap<number, unknown> => {
      const plugins = new PluginRegistry();
      plugins.register(transformPlugin);
      plugins.register(fkPlugin);
      plugins.register(ikPlugin);
      const runtime = new Engine({
        clock: createManualClock(),
        interpolator: createFakeInterpolator(),
        scheduler: createFakeScheduler(),
        plugins,
      }).load(project);
      for (const id of ids) runtime.mount(id);
      let latest: unknown;
      runtime.subscribeNode("rig/solve", (patch) => {
        if (patch.status === "ready" && patch.values !== undefined) latest = snapshot(patch.values);
      });
      const seen = new Map<number, unknown>();
      for (const progress of sequence) {
        runtime.seek("rig/root", progress);
        runtime.seek("rig/goal", progress);
        seen.set(progress, latest);
      }
      return seen;
    };
    const stops = Array.from({ length: 21 }, (_, index) => index / 20);
    const random = seeded(0x5d12);
    const shuffled = [...stops].sort(() => random() - 0.5);
    const forward = replay(stops);
    const reverse = replay([...stops].reverse());
    const seek = replay([...shuffled, ...shuffled.slice(0, 7)]);
    // Not vacuous: the forward pass publishes a different patch at every stop.
    expect(new Set([...forward.values()].map((values) => JSON.stringify(values))).size).toBe(
      stops.length,
    );
    for (const progress of stops) {
      expect(forward.get(progress)).toBeDefined();
      expect(identical(reverse.get(progress), forward.get(progress))).toBe(true);
      expect(identical(seek.get(progress), forward.get(progress))).toBe(true);
    }
  });
});
