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
 */
export type FabrikAttempt = (
  root: WorldFrame,
  members: readonly SolveMember[],
  flip: boolean,
  compromiseRule: CompromiseRule,
) => FabrikSolution;

/**
 * The attempts a conflicted baseline pays for, in their recorded order (ADR-110, issue #490).
 *
 * `opposite` names the seed side relative to the authored `flip`. The order is part of the
 * contract, because an exact tie keeps the earlier candidate.
 */
const ALTERNATIVES: readonly { readonly opposite: boolean; readonly rule: CompromiseRule }[] = [
  { opposite: true, rule: "centroid" },
  { opposite: false, rule: "reach-circle" },
  { opposite: true, rule: "reach-circle" },
];

/**
 * The four-candidate gate for a conflicted authored-seed solve.
 *
 * The authored seed with the centroid rule is attempted first and returned as the same object for
 * every quality other than `conflicted`, so every rig that did not conflict before issue #490 is
 * bit-identical and pays nothing more. Only a conflict pays for the three fixed alternatives. The
 * baseline is itself a candidate, so the selected result is never worse than the baseline under the
 * comparator below. Losing candidates are dropped; no restart metadata is published (ADR-107), and
 * the selected result reports its own `quality.iterations`.
 */
export function selectFabrik(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip: boolean,
  attempt: FabrikAttempt,
): FabrikSolution {
  const baseline = attempt(root, members, flip, "centroid");
  if (baseline.quality.kind !== "conflicted") return baseline;
  let selected = baseline;
  for (const { opposite, rule } of ALTERNATIVES) {
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
