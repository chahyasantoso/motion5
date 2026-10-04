import { describe, expect, it } from "vitest";
import {
  descendLegally,
  LEGAL_DESCENT_STEPS,
  LEGAL_DESCENT_TOLERANCE,
  type LegalDescent,
} from "../../../../plugins/src/ik-descent";
import { FABRIK_TOLERANCE } from "../../../../plugins/src/fabrik";

type ArmState = Readonly<{ first: number; second: number; degrees?: readonly number[] }>;
const RADIANS = Math.PI / 180;

function armTip(state: ArmState): readonly [number, number] {
  const first = state.first * RADIANS;
  const second = (state.first + state.second) * RADIANS;
  return [Math.cos(first) + Math.cos(second), Math.sin(first) + Math.sin(second)];
}

function armProblem(aim: readonly [number, number], costs: number[]): LegalDescent<ArmState> {
  return {
    dofs: 2,
    width: 2,
    reach: 2,
    misses(state) {
      const tip = armTip(state);
      const miss = [tip[0] - aim[0], tip[1] - aim[1]];
      // Probes are deliberately not counted as accepted walks; the returned states are still
      // evaluated by the kernel before it accepts or rejects their candidate.
      if (state.degrees === undefined || state.degrees.some((degrees) => Math.abs(degrees) > 1e-4))
        costs.push(miss[0]! ** 2 + miss[1]! ** 2);
      return miss;
    },
    turn(state, degrees) {
      return {
        first: state.first + degrees[0]!,
        second: state.second + degrees[1]!,
        degrees,
      };
    },
    bound: () => "interior",
  };
}

describe("legal descent kernel", () => {
  it("TH-197 reaches a free two-link planar aim monotonically and deterministically", () => {
    const start = { first: 0, second: 0 } as const;
    const aimAngles = [30, 30] as const;
    const aim = armTip({ first: aimAngles[0], second: aimAngles[1] });
    const firstCosts: number[] = [];
    const first = descendLegally(armProblem(aim, firstCosts), start);
    const secondCosts: number[] = [];
    const second = descendLegally(armProblem(aim, secondCosts), start);

    expect(first).toEqual(second);
    expect(firstCosts.length).toBeGreaterThan(0);
    for (let index = 1; index < firstCosts.length; index += 1)
      expect(firstCosts[index]!).toBeLessThanOrEqual(firstCosts[index - 1]!);
    const tip = armTip(first);
    expect(Math.hypot(tip[0] - aim[0], tip[1] - aim[1])).toBeLessThanOrEqual(
      LEGAL_DESCENT_TOLERANCE,
    );
  });

  it("TH-198 pins an outward gradient, keeps every state legal, and preserves no-op identity", () => {
    type State = Readonly<{ angle: number; degrees?: readonly number[] }>;
    const visited: number[] = [];
    const problem: LegalDescent<State> = {
      dofs: 1,
      width: 1,
      reach: 1,
      misses(state) {
        visited.push(state.angle);
        return [state.angle - 20];
      },
      turn(state, degrees) {
        const angle = Math.max(-10, Math.min(10, state.angle + degrees[0]!));
        return { angle, degrees };
      },
      bound: () => "upper",
    };
    const start = { angle: 10 } as const;
    expect(descendLegally(problem, start)).toBe(start);
    expect(visited.every((angle) => angle >= -10 && angle <= 10)).toBe(true);

    const zero: LegalDescent<State> = { ...problem, dofs: 0 };
    expect(descendLegally(zero, start)).toBe(start);
    const met: LegalDescent<State> = { ...problem, misses: () => [0] };
    expect(descendLegally(met, start)).toBe(start);
  });

  it("TH-199 keeps an unreachable bounded aim monotone through the damping ceiling", () => {
    type State = Readonly<{ angle: number; degrees?: readonly number[] }>;
    const costs: number[] = [];
    const visited: number[] = [];
    const problem: LegalDescent<State> = {
      dofs: 1,
      width: 1,
      reach: 1,
      misses(state) {
        visited.push(state.angle);
        const miss = state.angle - 20;
        if (state.degrees === undefined || Math.abs(state.degrees[0]!) > 1e-4)
          costs.push(miss * miss);
        return [miss];
      },
      turn(state, degrees) {
        const angle = Math.max(-10, Math.min(10, state.angle + degrees[0]!));
        return { angle, degrees };
      },
      bound: (state) => (state.angle >= 10 ? "upper" : "interior"),
    };
    const result = descendLegally(problem, { angle: 0 });
    expect(result.angle).toBe(10);
    expect(Math.abs(result.angle - 20)).toBeGreaterThan(LEGAL_DESCENT_TOLERANCE);
    expect(costs[costs.length - 1]!).toBeLessThanOrEqual(costs[0]!);
    expect(visited.every((angle) => angle >= -10 && angle <= 10)).toBe(true);
    expect(LEGAL_DESCENT_TOLERANCE).toBe(FABRIK_TOLERANCE / 10);
    expect(LEGAL_DESCENT_STEPS).toBeGreaterThan(0);
  });
});
