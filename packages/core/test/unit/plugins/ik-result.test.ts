import { describe, expect, it } from "vitest";
import { unreachable } from "../../../src/lang/exhaustive";
import { solveFabrik } from "../../../src/plugins/fabrik";
import { fkPlugin } from "../../../src/plugins/fk";
import {
  composeWorld,
  segmentExtent,
  type PivotOffset,
  type WorldFrame,
} from "../../../src/plugins/frame";
import { solveTwoBone } from "../../../src/plugins/ik-analytic";
import type { SolveMember } from "../../../src/plugins/ik-member";
import type {
  ClosedFormQuality,
  IterativeQuality,
  SolveQuality,
} from "../../../src/plugins/ik-result";
import { solveChain } from "../../../src/plugins/ik-solve";

// Issue #349 phase 2: one `SolveResult` for every strategy, owned by ADR-107.
//
// The closed form states its residual from the reach band rather than measuring it, so the series
// holds that statement to the miss `fk`'s own composition leaves, measured by calling
// `fkPlugin.compose` itself with the published rotations. A residual that agreed with the band
// arithmetic and not with the composed tip would be a second convention, which is the drift ADR-054
// exists to refuse. Lengths are drawn signed as well as non-negative: `segmentExtent` owns what a
// negative length means for `fk` and both solves alike (issue #482), so the composed tip is where
// the solve put it for every finite length, and `IR-11` and `IR-12` pin that owner directly.

const ROOT: WorldFrame = { x: 200, y: 300, rotation: 0 };
const HAND: WorldFrame = { x: 320, y: 340, rotation: 0 };

function pair(
  l1: number,
  l2: number,
  pivot1?: PivotOffset,
  pivot2?: PivotOffset,
): readonly [SolveMember, SolveMember] {
  const first: SolveMember = { id: "arm/upper", base: "arm/shoulder", length: l1 };
  const second: SolveMember = { id: "arm/fore", base: "arm/upper", length: l2 };
  return [
    pivot1 === undefined ? first : { ...first, pivot: pivot1 },
    pivot2 === undefined ? second : { ...second, pivot: pivot2 },
  ];
}

/** One bone through `fk`'s own composition, authored with the rotation the solve published. */
function composeBone(base: WorldFrame, member: SolveMember, rotation: number): WorldFrame {
  const values = { length: member.length, rotation, ...(member.pivot ?? {}) };
  const composed = fkPlugin.compose(values, 1, { base: { ...base } }, member.id);
  return { x: Number(composed.x), y: Number(composed.y), rotation: Number(composed.rotation) };
}

/** Where `fk` puts the second member's tip for the published rotations. */
function composedTip(
  root: WorldFrame,
  [first, second]: readonly [SolveMember, SolveMember],
  rotations: Readonly<Record<string, number>>,
): WorldFrame {
  const elbow = composeBone(root, first, rotations[first.id]!);
  return composeBone(elbow, second, rotations[second.id]!);
}

function composedMiss(
  root: WorldFrame,
  target: WorldFrame,
  members: readonly [SolveMember, SolveMember],
  flip = false,
): { readonly quality: ClosedFormQuality; readonly miss: number } {
  const { rotations, quality } = solveTwoBone(root, target, members[0], members[1], flip);
  const tip = composedTip(root, members, rotations);
  return { quality, miss: Math.hypot(tip.x - target.x, tip.y - target.y) };
}

/** xorshift32, so the sample is the same on every run and every machine. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x1_0000_0000;
  };
}

/** Which strategy family a quality kind belongs to, read exhaustively. */
function family(quality: SolveQuality): "closed-form" | "iterative" {
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
      return "closed-form";
    case "converged":
    case "stalled":
    case "iteration-cap":
    case "conflicted":
    case "limited":
      return "iterative";
    default:
      return unreachable(quality);
  }
}

describe("one solve result for every strategy", () => {
  it("IR-1 the worked rig reaches with a zero residual and keeps its published doubles", () => {
    const [first, second] = pair(80, 60);
    const solved = solveTwoBone(ROOT, HAND, first, second);

    expect(solved.quality).toEqual({ kind: "reached", residual: 0 });
    expect(solved.rotations[first.id]).toBeCloseTo(40.168, 3);
    expect(solved.rotations[second.id]).toBeCloseTo(-51.318, 3);
    expect(Object.keys(solved.rotations)).toEqual([first.id, second.id]);
    expect(Object.isFrozen(solved)).toBe(true);
    expect(Object.isFrozen(solved.rotations)).toBe(true);
    expect(Object.isFrozen(solved.quality)).toBe(true);
  });

  it("IR-2 a goal past the outer bound is too far by the distance the clamp removed", () => {
    const members = pair(80, 60);
    const far: WorldFrame = { x: ROOT.x + 200, y: ROOT.y, rotation: 0 };
    const { quality, miss } = composedMiss(ROOT, far, members);

    expect(quality.kind).toBe("too-far");
    expect(quality.residual).toBeCloseTo(60, 12);
    expect(miss).toBeCloseTo(quality.residual, 9);
  });

  it("IR-3 a goal inside the inner bound is too near by the distance the clamp added", () => {
    const members = pair(80, 30);
    const near: WorldFrame = { x: ROOT.x, y: ROOT.y + 20, rotation: 0 };
    const { quality, miss } = composedMiss(ROOT, near, members);

    expect(quality.kind).toBe("too-near");
    expect(quality.residual).toBeCloseTo(30, 12);
    expect(miss).toBeCloseTo(quality.residual, 9);
  });

  it("IR-4 a goal on the base of an equal pair is coincident and names the rest pose miss", () => {
    const straight = pair(50, 50);
    const onBase = composedMiss({ ...ROOT, rotation: 30 }, { ...ROOT, rotation: 0 }, straight);
    expect(onBase.quality.kind).toBe("coincident");
    expect(onBase.quality.residual).toBeCloseTo(onBase.miss, 9);
    expect(onBase.miss).toBeCloseTo(100, 9);

    // A twisted link: offsets fuse into a link of length 60 at 90 degrees, equal to `l2`.
    const twisted = pair(0, 60, undefined, { x: 0, y: 60 });
    const folded = composedMiss(ROOT, ROOT, twisted);
    expect(folded.quality.kind).toBe("coincident");
    expect(folded.quality.residual).toBeCloseTo(folded.miss, 9);
    expect(folded.miss).toBeCloseTo(60 * Math.SQRT2, 9);
  });

  it("IR-5 the degenerate exits read the collapsed band rather than a band of their own", () => {
    const noForearm = pair(80, 0);
    expect(
      composedMiss(ROOT, { x: ROOT.x + 80, y: ROOT.y, rotation: 0 }, noForearm).quality,
    ).toEqual({ kind: "reached", residual: 0 });
    const past = composedMiss(ROOT, { x: ROOT.x, y: ROOT.y + 100, rotation: 0 }, noForearm);
    expect(past.quality.kind).toBe("too-far");
    expect(past.quality.residual).toBeCloseTo(20, 12);
    expect(past.miss).toBeCloseTo(20, 9);

    const noLink = pair(0, 60);
    const short = composedMiss(ROOT, { x: ROOT.x + 30, y: ROOT.y, rotation: 0 }, noLink);
    expect(short.quality.kind).toBe("too-near");
    expect(short.quality.residual).toBeCloseTo(30, 12);
    expect(short.miss).toBeCloseTo(30, 9);
  });

  it("IR-6 a finite sample, non-negative and signed: the stated residual is the miss fk composes", () => {
    // The non-negative draw keeps its seed and its sequence from before issue #482; the signed draw
    // is the half that was red while `fk.compose` read a negative length raw.
    const nonNegative = (next: () => number): number => (next() < 0.05 ? 0 : next() * 120);
    const signed = (next: () => number): number => {
      const pick = next();
      if (pick < 0.05) return 0;
      if (pick < 0.1) return -0;
      return next() * 240 - 120;
    };
    const samples: readonly (readonly [number, (next: () => number) => number])[] = [
      [0x349_0002, nonNegative],
      [0x349_0482, signed],
    ];
    for (const [seed, draw] of samples) {
      const next = random(seed);
      const seen = new Set<string>();
      for (let index = 0; index < 4000; index += 1) {
        const l1 = draw(next);
        const l2 = draw(next);
        const offset = (): PivotOffset | undefined =>
          next() < 0.5 ? undefined : { x: next() * 60 - 30, y: next() * 60 - 30 };
        const members = pair(l1, l2, offset(), offset());
        const root = { x: next() * 400, y: next() * 400, rotation: next() * 720 - 360 };
        const target = { x: next() * 800 - 200, y: next() * 800 - 200, rotation: 0 };
        const { quality, miss } = composedMiss(root, target, members, next() < 0.5);

        seen.add(quality.kind);
        expect(Math.abs(miss - quality.residual)).toBeLessThan(1e-7 * (1 + miss));
        if (quality.kind === "reached") expect(quality.residual).toBe(0);
        else expect(quality.residual).toBeGreaterThan(0);
      }
      expect([...seen].sort()).toEqual(["reached", "too-far", "too-near"]);
    }
  });

  it("IR-7 each strategy answers with its own family, and both dispatch arms pass it through", () => {
    const [first, second] = pair(80, 60);
    const closed = solveChain(ROOT, [first, { ...second, goal: HAND }]);
    const direct = solveTwoBone(ROOT, HAND, first, second);
    expect(closed).toEqual(direct);
    expect(family(closed.quality)).toBe("closed-form");

    const chain: SolveMember[] = [
      { id: "tail/1", base: "tail/root", length: 40 },
      { id: "tail/2", base: "tail/1", length: 40 },
      { id: "tail/3", base: "tail/2", length: 40, goal: { x: 280, y: 360, rotation: 0 } },
    ];
    const tree = solveChain(ROOT, chain);
    const fabrik = solveFabrik(ROOT, chain);
    expect(family(tree.quality)).toBe("iterative");
    expect(tree.quality).toEqual(fabrik.quality);
    expect(tree.rotations).toEqual(fabrik.rotations);
    expect(Object.keys(tree).sort()).toEqual(["quality", "residuals", "rotations"]);
    expect(Object.isFrozen(tree)).toBe(true);

    const closedKinds: readonly ClosedFormQuality["kind"][] = [
      "reached",
      "too-far",
      "too-near",
      "coincident",
    ];
    const iterativeKinds: readonly IterativeQuality["kind"][] = [
      "converged",
      "stalled",
      "iteration-cap",
      "conflicted",
      "limited",
    ];
    for (const kind of closedKinds) expect(family({ kind, residual: 0 })).toBe("closed-form");
    for (const kind of iterativeKinds)
      expect(
        family(
          kind === "limited"
            ? { kind, iterations: 0, residual: 0, atBound: [] }
            : { kind, iterations: 0, residual: 0 },
        ),
      ).toBe("iterative");
  });

  it("IR-8 a value outside the union is refused by name rather than read as a family", () => {
    const forged = { kind: "unreached", residual: 1 } as unknown as SolveQuality;
    expect(() => family(forged)).toThrow(/Unhandled variant: .*unreached/);
  });

  it("IR-9 a non-finite goal is reported as the geometry it is, never laundered to zero", () => {
    const [first, second] = pair(80, 60);
    const east = solveTwoBone(ROOT, { x: Infinity, y: ROOT.y, rotation: 0 }, first, second);
    expect(east.quality).toEqual({ kind: "too-far", residual: Infinity });
    expect(east.rotations[first.id]).toBe(0);
    expect(east.rotations[second.id]).toBe(0);

    const south = solveTwoBone(ROOT, { x: ROOT.x, y: -Infinity, rotation: 0 }, first, second);
    expect(south.quality).toEqual({ kind: "too-far", residual: Infinity });
    expect(south.rotations[first.id]).toBeCloseTo(-90, 12);

    expect(() => solveTwoBone(ROOT, { x: NaN, y: ROOT.y, rotation: 0 }, first, second)).toThrow(
      'Solver goal on member "arm/fore" has a NaN x coordinate, which names no point or direction to solve toward.',
    );
  });

  it("IR-10 a negative authored length answers exactly as a zero one, on every exit", () => {
    const targets: readonly WorldFrame[] = [
      { x: ROOT.x + 60, y: ROOT.y, rotation: 0 },
      { x: ROOT.x + 30, y: ROOT.y, rotation: 0 },
      { x: ROOT.x, y: ROOT.y + 200, rotation: 0 },
      ROOT,
    ];
    const shapes: readonly (readonly [number, number, number, number])[] = [
      [-80, 60, 0, 60],
      [80, -60, 80, 0],
      [-50, -50, 0, 0],
    ];
    for (const target of targets) {
      for (const [n1, n2, z1, z2] of shapes) {
        const negative = pair(n1, n2);
        const zero = pair(z1, z2);
        expect(solveTwoBone(ROOT, target, negative[0], negative[1])).toEqual(
          solveTwoBone(ROOT, target, zero[0], zero[1]),
        );
      }
    }
  });
  it("IR-11 a negative first bone composes through fk onto the goal the solve reached", () => {
    const root: WorldFrame = { x: 0, y: 0, rotation: 0 };
    const goal: WorldFrame = { x: 80, y: 0, rotation: 0 };
    const negative = pair(-20, 80);
    const zero = pair(0, 80);
    const solved = solveTwoBone(root, goal, negative[0], negative[1]);
    expect(solved.quality).toEqual({ kind: "reached", residual: 0 });

    const elbow = composeBone(root, negative[0], solved.rotations[negative[0].id]!);
    const tip = composeBone(elbow, negative[1], solved.rotations[negative[1].id]!);
    // Red while `fk.compose` read the length raw: the elbow sat at (-20, 0) and the tip at (60, 0).
    expect(elbow.x).toBe(0);
    expect(elbow.y).toBe(0);
    expect(tip.x).toBe(80);
    expect(tip.y).toBe(0);

    const zeroSolved = solveTwoBone(root, goal, zero[0], zero[1]);
    const zeroElbow = composeBone(root, zero[0], zeroSolved.rotations[zero[0].id]!);
    const zeroTip = composeBone(zeroElbow, zero[1], zeroSolved.rotations[zero[1].id]!);
    for (const [left, right] of [
      [elbow, zeroElbow],
      [tip, zeroTip],
    ] as const) {
      expect(Object.is(left.x, right.x)).toBe(true);
      expect(Object.is(left.y, right.y)).toBe(true);
      expect(Object.is(left.rotation, right.rotation)).toBe(true);
    }
  });

  it("IR-12 the length matrix: one owner answers for fk's composition and for segmentExtent", () => {
    // The owner itself, including the signed zero it keeps and the non-finite values it passes.
    expect(Object.is(segmentExtent(-20), 0)).toBe(true);
    expect(Object.is(segmentExtent(-Infinity), 0)).toBe(true);
    expect(Object.is(segmentExtent(-0), -0)).toBe(true);
    expect(Object.is(segmentExtent(0), 0)).toBe(true);
    expect(segmentExtent(35)).toBe(35);
    expect(segmentExtent(Infinity)).toBe(Infinity);
    expect(segmentExtent(Number.NaN)).toBeNaN();

    // Through `fk.compose`: what the bone publishes for each spelling, against the frame an
    // extent of `expected` composes. `readNumber` reads a non-finite length as zero first, so the
    // owner never sees one from a bone.
    const base: WorldFrame = { x: 12, y: -4, rotation: 30 };
    const bone: SolveMember = {
      id: "arm/upper",
      base: "arm/shoulder",
      length: 0,
      pivot: { x: 3, y: -2 },
    };
    const cases: readonly (readonly [number, number])[] = [
      [Number.NaN, 0],
      [Infinity, 0],
      [-Infinity, 0],
      [-0, -0],
      [-20, 0],
      [0, 0],
      [47.5, 47.5],
    ];
    for (const rotation of [0, -0, 17, -163]) {
      const pivot = composeWorld(base, { x: 3, y: -2, rotation });
      for (const [length, expected] of cases) {
        const composed = composeBone(base, { ...bone, length }, rotation);
        const oracle = composeWorld(pivot, { x: expected, y: 0, rotation: 0 });
        expect(Object.is(composed.x, oracle.x)).toBe(true);
        expect(Object.is(composed.y, oracle.y)).toBe(true);
        expect(Object.is(composed.rotation, oracle.rotation)).toBe(true);
      }
    }
  });
});
