import { describe, expect, it } from "vitest";
import { FABRIK_TOLERANCE } from "../../../../plugins/src/fabrik";
import { fabrikIterationCap } from "../../../../plugins/src/fabrik-cap";
import { canonicalChain } from "../../../../plugins/src/ik-topology";
import { constrains } from "../../../../plugins/src/ik3d-constraint";
import { chainShape3d, solveChain3d } from "../../../../plugins/src/ik3d-solve";
import type { SolveResult3d } from "../../../../plugins/src/ik3d-result";
import { composeChain3d, frameDistance3d } from "../../support/fk3d-compose";
import { envelope3dScenarios, type Envelope3dScenario } from "../../support/ik3d-envelope";
import { iterationsOf } from "../../support/solve-quality";

const RIGS = 40;

/** Every scenario with each rig's solve, solved once and read by every case below. */
const solved = envelope3dScenarios(RIGS).map((scenario) => ({
  scenario,
  results: scenario.rigs.map((rig) => solveChain3d(rig.root, rig.members)),
}));

function finite(result: SolveResult3d): boolean {
  return (
    Number.isFinite(result.quality.residual) &&
    Object.values(result.rotations3d).every((rotation) =>
      Object.values(rotation).every(Number.isFinite),
    ) &&
    Object.values(result.residuals).every(Number.isFinite)
  );
}

function census(scenario: Envelope3dScenario["id"]): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const result of solved.find((entry) => entry.scenario.id === scenario)!.results)
    counts[result.quality.kind] = (counts[result.quality.kind] ?? 0) + 1;
  return counts;
}

describe("IK 3D envelope (#500 phase 5)", () => {
  it("TH-71 each scenario dispatches to its named shape at its named arity", () => {
    expect(solved.map(({ scenario }) => scenario.id)).toEqual([
      "two-bone",
      "chain-8",
      "chain-32",
      "chain-64",
      "tree-14",
      "tree-14-conflicting",
    ]);
    for (const { scenario } of solved) {
      expect(scenario.rigs).toHaveLength(RIGS);
      for (const rig of scenario.rigs) {
        expect(rig.members).toHaveLength(scenario.members);
        expect(chainShape3d(rig.members).kind).toBe(scenario.shape);
      }
    }
  });

  it("TH-72 every rig answers finitely, and fk3d composes every leaf onto its published residual", () => {
    for (const { scenario, results } of solved) {
      scenario.rigs.forEach((rig, index) => {
        const result = results[index]!;
        expect(finite(result)).toBe(true);
        expect(Object.keys(result.rotations3d)).toHaveLength(scenario.members);
        // The published residual is what the composed pose actually misses by, for every leaf
        // of every rig, whatever kind the solve reported; a converged leaf is inside tolerance.
        const frames = composeChain3d(rig.root, rig.members, result);
        for (const member of rig.members) {
          if (member.goal === undefined) continue;
          const miss = frameDistance3d(frames[member.id]!, member.goal);
          expect(Math.abs(miss - result.residuals[member.id]!)).toBeLessThan(1e-6);
          if (result.quality.kind === "converged") expect(miss).toBeLessThan(FABRIK_TOLERANCE);
        }
      });
    }
    for (const result of solved[0]!.results) {
      expect(result.quality.kind).toBe("reached");
      expect(result.quality.residual).toBe(0);
    }
  });

  it("TH-73 closed form has no iterations; iterative solves stay within the cap", () => {
    for (const { scenario, results } of solved) {
      scenario.rigs.forEach((rig, index) => {
        const iterations = iterationsOf(results[index]!.quality);
        if (scenario.shape === "two-bone") {
          expect(iterations).toBeUndefined();
          return;
        }
        expect(iterations).toBeGreaterThanOrEqual(1);
        const constraint = rig.members.some(({ limit }) => limit !== undefined && constrains(limit))
          ? "limited"
          : "free";
        const cap = fabrikIterationCap(canonicalChain(rig.members).serialDepth(), constraint);
        expect(iterations).toBeLessThanOrEqual(cap);
      });
    }
  });

  it("TH-74 the seeded envelope has the measured quality-kind census", () => {
    expect(census("two-bone")).toEqual({ reached: 40 });
    expect(census("chain-8")).toEqual({ converged: 40 });
    expect(census("chain-32")).toEqual({ converged: 40 });
    expect(census("chain-64")).toEqual({ converged: 40 });
    expect(census("tree-14")).toEqual({ converged: 38, conflicted: 2 });
    expect(census("tree-14-conflicting")).toEqual({ conflicted: 38, converged: 2 });
  });
});
