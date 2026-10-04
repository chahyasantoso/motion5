import { segmentExtent, type WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";
import type { FabrikSolution } from "./fabrik";
import type { CompromiseRule } from "./ik-goal";
import type { IterativeQuality } from "./ik-result";
import { unreachable } from "@motion5/core/plugin-api";
import { fabrikResidualOutranks } from "./fabrik-cap";
import {
  CENTRE_LEGAL_SEED,
  type FabrikSeed,
  type LegalSeed,
  type LegalSeedFraction,
} from "./fabrik-seed";

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
> = (
  root: R,
  members: readonly M[],
  flip: boolean,
  compromiseRule: CompromiseRule,
  seed?: FabrikSeed,
) => S;

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
 * The attempt a limited or capped baseline pays for: the opposite seed side with the baseline's
 * rule (ADR-126, issue #514; ADR-128, issue #521).
 *
 * A one-way range seeded on the side it forbids is projected onto its bound by the first outward
 * pass and held there, so the authored side can be a fixed point on a bound while the goal is
 * reachable from the other side. A capped attempt never settled at all, so its seed side is as much
 * in question. The rule stays the baseline's `centroid`, because neither a limit nor a cap is a
 * branch disagreement. The legal starts that follow are the other half of the remedy
 * (`legalStages`), because a mixed-sign chain has no arc side that is legal for every range.
 */
const OPPOSITE_SIDE_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([
  Object.freeze({ opposite: true, rule: "centroid" }),
]);

const NO_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([]);

/**
 * A distant miss cannot justify more full attempts. In the reachable 1,802-rig #527 corpus,
 * a two-percent reach band buys 57 of the 113 quartile recoveries with 26,615 extra iterations,
 * instead of 121,663 for unrestricted quartiles. One q10 attempt only after unresolved gated
 * quartiles costs another 176 attempts / 11,044 iterations and recovers 14 on that corpus.
 * A symmetric q90 is now reserved for cases still unresolved after q10; it does not change the
 * measured historical counts above. These are attempt counts, not latency or reachability proofs.
 */
const LEGAL_RETRY_REACH_FRACTION = 0.02;

/**
 * Legal starts in stages. Every stage runs only while no candidate has converged: a legal start is
 * a remedy for a miss, so a rig the baseline or its opposite side already meets pays none of them
 * and keeps the pose it published before legal starts existed.
 */
type LegalStages = readonly (readonly LegalSeed[])[];

const legalRange = (fraction: LegalSeedFraction): LegalSeed =>
  Object.freeze({ kind: "legal-range", fraction });

/** The centre walked toward the aims in joint space (`ik-descent.ts`, ADR-132). */
const DESCENT: LegalSeed = Object.freeze({ kind: "legal-descent" });

/** The descent alone: a non-planar hinge path's distant miss (ADR-130, ADR-132). */
const DESCENT_STAGES: LegalStages = Object.freeze([Object.freeze([DESCENT])]);

/**
 * The legal-range starts a gated near miss on a non-planar 3D hinge pays for, in stages: both
 * quartiles, then q10, then q90 (#527, ADR-130). Four extra attempts on top of the baseline and
 * its opposite side, six in all.
 */
const LEGAL_RANGE_STAGES: LegalStages = Object.freeze([
  Object.freeze([legalRange(0.25), legalRange(0.75)]),
  Object.freeze([legalRange(0.1)]),
  Object.freeze([legalRange(0.9)]),
]);

/** The same stages then the descent, for a rig whose goals lie within reach: seven in all. */
const LEGAL_RANGE_THEN_DESCENT_STAGES: LegalStages = Object.freeze([
  ...LEGAL_RANGE_STAGES,
  ...DESCENT_STAGES,
]);

/** The centre alone, for a constrained rig with no addressed extent: nothing a descent can turn. */
const CENTRE_STAGES: LegalStages = Object.freeze([Object.freeze([CENTRE_LEGAL_SEED])]);

/**
 * The legal starts a limited or capped rig seeded by the arc pays for: every limited member at its
 * range's centre, then that centre walked by the legal descent (#524, ADR-131, ADR-132). A
 * mixed-sign chain's arc bends every joint one way, so a range that demands the other way is
 * projected onto its bound and held there; no arc side is legal for both signs, while the centre
 * is legal for every range. What the centre still misses is a FABRIK fixed point on a bound rather
 * than a minimum of the miss, and the descent follows the legal gradient out of it. Four attempts
 * at most: baseline, opposite side, centre, descent.
 */
const CENTRE_THEN_DESCENT_STAGES: LegalStages = Object.freeze([
  ...CENTRE_STAGES,
  ...DESCENT_STAGES,
]);

const NO_STAGES: LegalStages = Object.freeze([]);

/**
 * Which legal joint-space starts a rig can use, decided by the dimension's solve from the rig and
 * read here exhaustively: the selector alone decides which of them a baseline pays for.
 *
 * `none` for a rig with no limited member; `centre` for a constrained rig with no addressed extent,
 * which no walk can turn, or with a goal outside its reach (`goalsWithinReach`), which no start can
 * meet; `centre-then-descent` for a constrained rig whose default seed is the arc (every 2D and
 * planar 3D rig, and a non-planar hinge path whose pole-side arc is legal) and whose goals lie
 * within reach; and `staged` or `staged-then-descent` for a non-planar 3D hinge path whose default
 * seed is already the legal centre, whose off-centre starts stay gated on the baseline's miss
 * against `reach`, followed by the descent only when every goal lies within reach (ADR-130,
 * ADR-132).
 */
export type LegalStarts =
  | { readonly kind: "none" }
  | { readonly kind: "centre" }
  | { readonly kind: "centre-then-descent" }
  | { readonly kind: "staged"; readonly reach: number }
  | { readonly kind: "staged-then-descent"; readonly reach: number };

export const NO_LEGAL_STARTS: LegalStarts = Object.freeze({ kind: "none" });

export const CENTRE_LEGAL_START: LegalStarts = Object.freeze({ kind: "centre" });

export const CENTRE_THEN_DESCENT: LegalStarts = Object.freeze({ kind: "centre-then-descent" });

/** A member the reach helpers read: its path to the root, its extent and whether it has a goal. */
interface ReachMember {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly goal?: unknown;
}

/** The extent of one leaf's root path, lengths plus offsets, in world units. */
function pathExtent<M extends ReachMember>(
  leaf: M,
  byId: ReadonlyMap<string, M>,
  offsetExtent: (member: M) => number,
): number {
  let extent = 0;
  let current: M | undefined = leaf;
  const seen = new Set<string>();
  while (current !== undefined && !seen.has(current.id)) {
    seen.add(current.id);
    extent += segmentExtent(current.length) + offsetExtent(current);
    current = byId.get(current.base);
  }
  return extent;
}

/** Scale of addressed paths only: unrelated siblings cannot enlarge the near-miss retry band. */
export function addressedReach<M extends ReachMember>(
  members: readonly M[],
  offsetExtent: (member: M) => number,
): number {
  const byId = new Map(members.map((member) => [member.id, member]));
  let reach = 0;
  for (const leaf of members)
    if (leaf.goal !== undefined) reach = Math.max(reach, pathExtent(leaf, byId, offsetExtent));
  return reach;
}

/**
 * Whether every addressed goal lies within its own path's extent of the root: a necessary
 * condition for any pose to meet it (ADR-132). A goal outside it is unreachable from every start,
 * so a walk toward it buys nothing a convergence can use; an infinite (direction) or `NaN` distance
 * is outside too. `goalDistance` is the dimension's straight-line distance from the root point.
 */
export function goalsWithinReach<M extends ReachMember>(
  members: readonly M[],
  offsetExtent: (member: M) => number,
  goalDistance: (leaf: M) => number,
): boolean {
  const byId = new Map(members.map((member) => [member.id, member]));
  return members.every(
    (leaf) => leaf.goal === undefined || goalDistance(leaf) <= pathExtent(leaf, byId, offsetExtent),
  );
}

/**
 * The legal starts of a constrained arc-seeded rig: the centre alone when it has no addressed
 * extent or a goal lies outside its reach, else the centre then the descent. One rule, so the 2D
 * solve and the 3D planar path cannot state it twice.
 */
export function arcLegalStarts(reach: number, withinReach: boolean): LegalStarts {
  return reach > 0 && withinReach ? CENTRE_THEN_DESCENT : CENTRE_LEGAL_START;
}

/** Whether a baseline of this quality may pay for legal starts, read exhaustively. */
function legalRangeRetries(quality: IterativeQuality): boolean {
  switch (quality.kind) {
    case "limited":
    case "iteration-cap":
      return true;
    case "converged":
    case "stalled":
    case "conflicted":
      return false;
    default:
      return unreachable(quality);
  }
}

/** Whether a baseline's miss is within the inclusive near-miss band of the addressed reach. */
function nearMiss(baseline: IterativeQuality, reach: number): boolean {
  return baseline.residual <= LEGAL_RETRY_REACH_FRACTION * reach;
}

/** The legal stages a baseline pays for: none unless it is limited or capped (`legalRangeRetries`). */
function legalStages(starts: LegalStarts, baseline: IterativeQuality): LegalStages {
  if (!legalRangeRetries(baseline)) return NO_STAGES;
  switch (starts.kind) {
    case "none":
      return NO_STAGES;
    case "centre":
      return CENTRE_STAGES;
    case "centre-then-descent":
      return CENTRE_THEN_DESCENT_STAGES;
    case "staged":
      return nearMiss(baseline, starts.reach) ? LEGAL_RANGE_STAGES : NO_STAGES;
    case "staged-then-descent":
      return nearMiss(baseline, starts.reach) ? LEGAL_RANGE_THEN_DESCENT_STAGES : DESCENT_STAGES;
    default:
      return unreachable(starts);
  }
}

/**
 * The alternatives a baseline of this quality pays for, read exhaustively over FABRIK's kinds.
 *
 * A met goal pays nothing, and neither does a stall: it settled at a fixed point that a different
 * seed side has no evidence of escaping. Three misses name a seed-side remedy: a conflict pays the
 * three recorded alternatives (#490), a bound the opposite side (#514), and a cap the opposite side
 * too (#521). A capped attempt publishes its best completed pass (ADR-128), which can sit off every
 * bound and so read `iteration-cap` where the last pass read `limited`; the attempt never settled,
 * so its seed side stays in question. A free rig that converges or stalls takes exactly the one
 * attempt it always took.
 */
export function fabrikAlternatives(quality: IterativeQuality): readonly FabrikAlternative[] {
  switch (quality.kind) {
    case "conflicted":
      return CONFLICTED_ALTERNATIVES;
    case "limited":
      return OPPOSITE_SIDE_ALTERNATIVES;
    case "converged":
    case "stalled":
      return NO_ALTERNATIVES;
    case "iteration-cap":
      return OPPOSITE_SIDE_ALTERNATIVES;
    default:
      return unreachable(quality);
  }
}

/**
 * The candidate gate for an authored-seed solve.
 *
 * The authored seed with the centroid rule is attempted first and returned as the same object for
 * every quality whose alternatives are empty, so every such rig is bit-identical to a single attempt
 * and pays nothing more. A conflict pays for its three fixed alternatives, and a bound or a cap for
 * the opposite side (`fabrikAlternatives`). The baseline is itself a candidate, so the selected
 * result is never worse than the baseline under the comparator below. Losing candidates are
 * dropped; no restart metadata is published (ADR-107), and the selected result reports its own
 * `quality.iterations`. A limited or capped baseline then pays the legal starts its rig can use
 * (`legalStages`): the centre for an arc-seeded rig, then off-centre starts if its best arc
 * candidate is near enough; a non-planar path retains its baseline-gated off-centre starts.
 * A free rig names `none` and keeps exactly the attempts it had.
 */
export function selectFabrik<R, M, S extends Selectable>(
  root: R,
  members: readonly M[],
  flip: boolean,
  attempt: FabrikAttempt<R, M, S>,
  legalStarts: LegalStarts = NO_LEGAL_STARTS,
): S {
  const baseline = attempt(root, members, flip, "centroid");
  let selected = baseline;
  for (const { opposite, rule } of fabrikAlternatives(baseline.quality)) {
    const candidate = attempt(root, members, opposite ? !flip : flip, rule);
    if (outranks(candidate.quality, selected.quality)) selected = candidate;
  }
  for (const seeds of legalStages(legalStarts, baseline.quality)) {
    if (selected.quality.kind === "converged") break;
    for (const seed of seeds) {
      const candidate = attempt(root, members, flip, "centroid", seed);
      if (outranks(candidate.quality, selected.quality)) selected = candidate;
    }
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
  return fabrikResidualOutranks(candidate.residual, selected.residual);
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
