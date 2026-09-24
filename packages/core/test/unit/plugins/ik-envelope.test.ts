import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine } from "../../../src/engine";
import { unreachable } from "../../../src/lang/exhaustive";
import { createManualClock } from "../../../src/ports/clock";
import { FABRIK_MAX_ITERATIONS } from "../../../src/plugins/fabrik";
import { fkPlugin } from "../../../src/plugins/fk";
import { ikPlugin } from "../../../src/plugins/ik";
import type { SolveQuality, SolveResult } from "../../../src/plugins/ik-result";
import { chainShape, solveChain } from "../../../src/plugins/ik-solve";
import { transformPlugin } from "../../../src/plugins/transform";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import {
  envelopeScenarios,
  independentRigsProject,
  rigTrackIds,
  type EnvelopeScenario,
} from "../../support/ik-envelope";

// Issue #349 phase 7 and ADR-113: the deterministic half of the 2D IK envelope.
//
// `docs/BENCH-IK.md` publishes what a solve costs on each scenario in `test/support/ik-envelope.ts`,
// and a timing is only evidence about the scenario it names if the scenario is what it says. These
// cases pin that half, which is behaviour and holds on every machine: which strategy each scenario
// reaches, that every answer is finite and inside the iteration cap the cost bound is stated in,
// and that independent rigs sharing one runtime do not couple. The wall-clock half is measured by
// `scripts/bench-ik.mjs` under recorded conditions and is never asserted here, because a timing
// gate is a flaky gate and ADR-008 keeps gates on behaviour.

const RIGS = 40;
const scenarios = envelopeScenarios(RIGS);

function finite(result: SolveResult): boolean {
  return (
    Number.isFinite(result.quality.residual) &&
    Object.values(result.rotations).every(Number.isFinite) &&
    Object.values(result.residuals).every(Number.isFinite)
  );
}

/** The iterations a quality states, or `undefined` for the closed form, read exhaustively. */
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

function solveAll(scenario: EnvelopeScenario): readonly SolveResult[] {
  return scenario.rigs.map((rig) => solveChain(rig.root, rig.members, rig.flip));
}

describe("IK envelope (#349 phase 7, ADR-113)", () => {
  it("EN-1 every scenario reaches the strategy it names, at the arity it names", () => {
    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      "two-bone",
      "chain-8",
      "chain-32",
      "chain-64",
      "tree-14",
      "tree-30",
      "tree-14-conflicting",
      "constrained-8",
    ]);
    for (const scenario of scenarios) {
      expect(scenario.rigs).toHaveLength(RIGS);
      for (const rig of scenario.rigs) {
        expect(rig.members).toHaveLength(scenario.members);
        expect(chainShape(rig.members).kind).toBe(scenario.shape);
      }
    }
  });

  it("EN-2 every scenario answers finitely, and the closed form reaches every in-band goal", () => {
    for (const scenario of scenarios) {
      for (const result of solveAll(scenario)) {
        expect(finite(result)).toBe(true);
        expect(Object.keys(result.rotations)).toHaveLength(scenario.members);
      }
    }
    // Two-bone goals are drawn between 10% and 90% of full reach, inside the band, so the closed
    // form is exact on every one of them: the residual the envelope quotes for it is zero.
    const [twoBone] = scenarios;
    for (const result of solveAll(twoBone!)) {
      expect(result.quality.kind).toBe("reached");
      expect(result.quality.residual).toBe(0);
    }
  });

  it("EN-3 the closed form states no iterations and every iterative solve stays inside the cap", () => {
    for (const scenario of scenarios) {
      for (const result of solveAll(scenario)) {
        const iterations = iterationsOf(result.quality);
        if (scenario.shape === "two-bone") {
          expect(iterations).toBeUndefined();
          continue;
        }
        expect(iterations).toBeGreaterThanOrEqual(1);
        expect(iterations).toBeLessThanOrEqual(FABRIK_MAX_ITERATIONS);
      }
    }
  });

  it("EN-4 independent rigs in one runtime republish alone: a seek on one rig reaches no other", () => {
    const count = 24;
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    plugins.register(fkPlugin);
    plugins.register(ikPlugin);
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load(independentRigsProject(count));
    const published = new Map<string, number>();
    const latest = new Map<string, unknown>();
    for (let index = 0; index < count; index += 1) {
      for (const id of rigTrackIds(index)) {
        runtime.mount(id);
        runtime.subscribeNode(id, (patch) => {
          published.set(id, (published.get(id) ?? 0) + 1);
          if (patch.status === "ready") latest.set(id, patch.values);
        });
      }
    }
    for (let index = 0; index < count; index += 1) runtime.seek(`rig-${index}/goal`, 0.25);
    // Every rig solved, and solved finitely.
    for (let index = 0; index < count; index += 1) {
      const values = latest.get(`rig-${index}/solve`) as
        | { readonly rotations?: Readonly<Record<string, number>> }
        | undefined;
      const rotations = Object.values(values?.rotations ?? {});
      expect(rotations).toHaveLength(2);
      expect(rotations.every(Number.isFinite)).toBe(true);
    }
    const before = new Map(published);
    const snapshot = new Map(latest);
    const moved = 7;
    runtime.seek(`rig-${moved}/goal`, 0.75);
    for (let index = 0; index < count; index += 1) {
      for (const id of rigTrackIds(index)) {
        const republished = (published.get(id) ?? 0) - (before.get(id) ?? 0);
        if (index !== moved) {
          expect(republished, id).toBe(0);
          expect(latest.get(id), id).toBe(snapshot.get(id));
        }
      }
    }
    // Not vacuous: the moved rig's solver and both members did republish, with a new answer.
    for (const track of ["goal", "solve", "upper", "fore"]) {
      const id = `rig-${moved}/${track}`;
      expect((published.get(id) ?? 0) - (before.get(id) ?? 0), id).toBeGreaterThan(0);
    }
    expect(latest.get(`rig-${moved}/solve`)).not.toEqual(snapshot.get(`rig-${moved}/solve`));
  });
});
