import type { WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";
import type { FabrikSolution } from "./fabrik";
import type { CompromiseRule } from "./ik-goal";
import type { IterativeQuality } from "./ik-result";
import { unreachable } from "../lang/exhaustive";

/**
 * One FABRIK attempt from a seed side and a compromise rule.
 *
 * Injected rather than imported so this module depends on `fabrik.ts` for types only: `fabrik.ts`
 * owns the arithmetic of one attempt and calls this selector, and a value import back would be a
 * module cycle. The harness and the tests pass a counting wrapper through the same seam.
 *
 * Generic over the rig and the solution, defaulting to the 2D ones, because the selector reads
 * nothing of either but the solution's `quality`: the 3D tree solve passes its own attempt through
 * the same gate, where `flip` names the seed's side of the bend plane (ADR-122), so a remedy stated
 * here holds in both dimensions from one statement (ADR-126).
 */
export type FabrikAttempt<
  R = WorldFrame,
  M = SolveMember,
  S extends Selectable = FabrikSolution,
> = (root: R, members: readonly M[], flip: boolean, compromiseRule: CompromiseRule) => S;

/** What the selector reads of a solution: its iterative quality, and nothing else. */
export interface Selectable {
  readonly quality: IterativeQuality;
}

/**
 * One alternative attempt a missed baseline pays for: the seed side relative to the authored `flip`
 * and the compromise rule it is attempted with.
 */
export interface FabrikAlternative {
  readonly opposite: boolean;
  readonly rule: CompromiseRule;
}

/**
 * The attempts a conflicted baseline pays for, in their recorded order (ADR-110, issue #490).
 *
 * `opposite` names the seed side relative to the authored `flip`. The order is part of the
 * contract, because an exact tie keeps the earlier candidate.
 */
const CONFLICTED_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([
  Object.freeze({ opposite: true, rule: "centroid" }),
  Object.freeze({ opposite: false, rule: "reach-circle" }),
  Object.freeze({ opposite: true, rule: "reach-circle" }),
]);

/**
 * The attempt a limited baseline pays for: the opposite seed side with the baseline's rule (ADR-126,
 * issue #514).
 *
 * A one-way range seeded on the side it forbids is projected onto its bound by the first outward
 * pass and held there, so the authored side can be a fixed point on a bound while the goal is
 * reachable from the other side. One opposite-side attempt is the whole of the remedy the selector
 * owns: the rule stays the baseline's `centroid`, because a limit is not a branch disagreement.
 */
const LIMITED_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([
  Object.freeze({ opposite: true, rule: "centroid" }),
]);

const NO_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([]);

/**
 * The alternatives a baseline of this quality pays for, read exhaustively over FABRIK's kinds.
 *
 * A met goal pays nothing. A stall or a cap pays nothing either: a stall is a fixed point that a
 * different seed side has no evidence of escaping, and a cap is still moving, so neither overrides
 * the authored bend. Only the two misses whose cause names a seed-side remedy pay: a conflict for
 * the three recorded alternatives (#490), and a bound for the opposite side (#514). So a free rig
 * that was not conflicted takes exactly the one attempt it always took, and limits outrank the bend
 * hint only when the authored side ends on a bound and the other side scores strictly better.
 */
export function fabrikAlternatives(quality: IterativeQuality): readonly FabrikAlternative[] {
  switch (quality.kind) {
    case "conflicted":
      return CONFLICTED_ALTERNATIVES;
    case "limited":
      return LIMITED_ALTERNATIVES;
    case "converged":
    case "stalled":
    case "iteration-cap":
      return NO_ALTERNATIVES;
    default:
      return unreachable(quality);
  }
}

/**
 * The candidate gate for an authored-seed solve.
 *
 * The authored seed with the centroid rule is attempted first and returned as the same object for
 * every quality whose alternatives are empty, so every such rig is bit-identical to a single attempt
 * and pays nothing more. A conflict pays for its three fixed alternatives and a bound for the
 * opposite side (`fabrikAlternatives`). The baseline is itself a candidate, so the selected result
 * is never worse than the baseline under the comparator below. Losing candidates are dropped; no
 * restart metadata is published (ADR-107), and the selected result reports its own
 * `quality.iterations`.
 */
export function selectFabrik<R, M, S extends Selectable>(
  root: R,
  members: readonly M[],
  flip: boolean,
  attempt: FabrikAttempt<R, M, S>,
): S {
  const baseline = attempt(root, members, flip, "centroid");
  let selected = baseline;
  for (const { opposite, rule } of fabrikAlternatives(baseline.quality)) {
    const candidate = attempt(root, members, opposite ? !flip : flip, rule);
    if (outranks(candidate.quality, selected.quality)) selected = candidate;
  }
  return selected;
}

/**
 * Whether a candidate strictly beats the current selection: one rule, read in two steps.
 *
 * First the tier, where a `converged` result outranks every miss whatever either residual is, `NaN`
 * included. Then, within a tier, the lower `residual`. An exact tie is not a win, so the earlier
 * candidate stays. A `NaN` residual cannot be ordered by `<`, so within a tier it ranks below every
 * number: a candidate with one never wins its tier and a selection with one loses its tier to any
 * number. Finite FABRIK output never produces one, and a `converged` kind never carries one because
 * `NaN <= FABRIK_TOLERANCE` is false; the rule is stated so the comparator is total rather than
 * order-dependent if that invariant is ever broken. `Infinity` orders by `<` like any number.
 */
export function outranks(candidate: IterativeQuality, selected: IterativeQuality): boolean {
  const tier = qualityTier(candidate) - qualityTier(selected);
  if (tier !== 0) return tier < 0;
  if (Number.isNaN(candidate.residual)) return false;
  if (Number.isNaN(selected.residual)) return true;
  return candidate.residual < selected.residual;
}

/** `0` for a met result and `1` for every miss, read exhaustively over FABRIK's kinds. */
function qualityTier(quality: IterativeQuality): 0 | 1 {
  switch (quality.kind) {
    case "converged":
      return 0;
    case "conflicted":
    case "limited":
    case "stalled":
    case "iteration-cap":
      return 1;
    default:
      return unreachable(quality);
  }
}
