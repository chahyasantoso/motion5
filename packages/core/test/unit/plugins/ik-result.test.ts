import { describe, expect, it } from "vitest";
import { unreachable } from "../../../src/lang/exhaustive";
import { solveFabrik } from "../../../src/plugins/fabrik";
import { composeWorld, type PivotOffset, type WorldFrame } from "../../../src/plugins/frame";
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
// holds that statement to the miss `fk`'s own composition leaves, measured independently here with
// `composeWorld`, the function `fk.compose` calls twice per bone. A residual that agreed with the
// band arithmetic and not with the composed tip would be a second convention, which is the drift
// ADR-054 exists to refuse. Lengths are drawn non-negative: a negative authored length is where
// the solve's extent and `fk`'s composition part ways, which `solveLength` owns and this series
// does not.

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

/** Where `fk` puts the second member's tip for the published rotations. */
function composedTip(
  root: WorldFrame,
  [first, second]: readonly [SolveMember, SolveMember],
  rotations: Readonly<Record<string, number>>,
): { x: number; y: number } {
  const zero = { x: 0, y: 0 };
  const p1 = composeWorld(root, { ...(first.pivot ?? zero), rotation: rotations[first.id]! });
  const t1 = composeWorld(p1, { x: first.length, y: 0, rotation: 0 });
  const p2 = composeWorld(t1, { ...(second.pivot ?? zero), rotation: rotations[second.id]! });
  return composeWorld(p2, { x: second.length, y: 0, rotation: 0 });
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

  it("IR-6 a finite non-negative sample: the stated residual is the miss fk composes", () => {
    const next = random(0x349_0002);
    const seen = new Set<string>();
    for (let index = 0; index < 4000; index += 1) {
      const l1 = next() < 0.05 ? 0 : next() * 120;
      const l2 = next() < 0.05 ? 0 : next() * 120;
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
    expect(Object.keys(tree).sort()).toEqual(["quality", "rotations"]);
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

    const lost = solveTwoBone(ROOT, { x: NaN, y: ROOT.y, rotation: 0 }, first, second);
    expect(lost.quality.kind).toBe("reached");
    expect(lost.quality.residual).toBeNaN();
    expect(lost.rotations[first.id]).toBeNaN();
    expect(lost.quality.residual <= 1e-6).toBe(false);
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
});
