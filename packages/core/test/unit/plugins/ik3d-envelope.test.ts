import { describe, expect, it } from "vitest";
import { unreachable } from "../../../src/lang/exhaustive";
import { fabrikIterationCap } from "../../../src/plugins/fabrik-cap";
import type { ChainMember3d } from "../../../src/plugins/ik3d-chain";
import { chainShape3d, solveChain3d } from "../../../src/plugins/ik3d-solve";
import type { SolveQuality, SolveResult3d } from "../../../src/plugins/ik3d-result";
import { envelope3dScenarios, type Envelope3dScenario } from "../../support/ik3d-envelope";

const RIGS = 40;
const scenarios = envelope3dScenarios(RIGS);

function finite(result: SolveResult3d): boolean {
  return (
    Number.isFinite(result.quality.residual) &&
    Object.values(result.rotations3d).every((rotation) =>
      Object.values(rotation).every(Number.isFinite),
    ) &&
    Object.values(result.residuals).every(Number.isFinite)
  );
}

function iterationsOf(quality: SolveQuality): number | undefined {
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
      return undefined;
    case "converged":
    case "stalled":
    case "iteration-cap":
    case "conflicted":
    case "limited":
      return quality.iterations;
    default:
      return unreachable(quality);
  }
}

function serialDepth(members: readonly ChainMember3d[]): number {
  const byId = new Map(members.map((member) => [member.id, member]));
  let deepest = 0;
  for (const member of members) {
    let depth = 0;
    for (let at: ChainMember3d | undefined = member; at !== undefined; at = byId.get(at.base))
      depth += 1;
    deepest = Math.max(deepest, depth);
  }
  return deepest;
}

function solveAll(scenario: Envelope3dScenario): readonly SolveResult3d[] {
  return scenario.rigs.map((rig) => solveChain3d(rig.root, rig.members));
}

describe("IK 3D envelope (#500 phase 5)", () => {
  it("TH-71 each scenario dispatches to its named shape at its named arity", () => {
    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      "two-bone",
      "chain-8",
      "chain-32",
      "chain-64",
      "tree-14",
      "tree-14-conflicting",
    ]);
    for (const scenario of scenarios) {
      expect(scenario.rigs).toHaveLength(RIGS);
      for (const rig of scenario.rigs) {
        expect(rig.members).toHaveLength(scenario.members);
        expect(chainShape3d(rig.members).kind).toBe(scenario.shape);
      }
    }
  });

  it("TH-72 every rig answers finitely and the closed form reaches its in-band goals", () => {
    for (const scenario of scenarios) {
      for (const result of solveAll(scenario)) {
        expect(finite(result)).toBe(true);
        expect(Object.keys(result.rotations3d)).toHaveLength(scenario.members);
      }
    }
    const [twoBone] = scenarios;
    for (const result of solveAll(twoBone!)) {
      expect(result.quality.kind).toBe("reached");
      expect(result.quality.residual).toBe(0);
    }
  });

  it("TH-73 closed form has no iterations; iterative solves stay within the cap", () => {
    for (const scenario of scenarios) {
      const results = solveAll(scenario);
      scenario.rigs.forEach((rig, index) => {
        const iterations = iterationsOf(results[index]!.quality);
        if (scenario.shape === "two-bone") {
          expect(iterations).toBeUndefined();
          return;
        }
        expect(iterations).toBeGreaterThanOrEqual(1);
        expect(iterations).toBeLessThanOrEqual(fabrikIterationCap(serialDepth(rig.members)));
      });
    }
  });

  it("TH-74 the seeded envelope has the measured quality-kind census", () => {
    const counts = new Map<string, Record<string, number>>();
    for (const scenario of scenarios) {
      const result: Record<string, number> = {};
      for (const solved of solveAll(scenario))
        result[solved.quality.kind] = (result[solved.quality.kind] ?? 0) + 1;
      counts.set(scenario.id, result);
    }
    expect(counts.get("two-bone")).toEqual({ reached: 40 });
    expect(counts.get("chain-8")).toEqual({ converged: 40 });
    expect(counts.get("chain-32")).toEqual({ converged: 40 });
    expect(counts.get("chain-64")).toEqual({ converged: 40 });
    expect(counts.get("tree-14")).toEqual({ converged: 38, conflicted: 2 });
    expect(counts.get("tree-14-conflicting")).toEqual({ conflicted: 38, converged: 2 });
  });
});
