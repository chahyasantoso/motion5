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

/** One FABRIK attempt from a seed side and a compromise rule. Injected, not imported: `fabrik.ts` calls this selector, so a value import back would cycle. Only `quality` is read. */
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

/** One alternative attempt a missed baseline pays for: the seed side relative to the authored `flip`, and the rule it runs under. */
export interface FabrikAlternative {
  readonly opposite: boolean;
  readonly rule: CompromiseRule;
}

/** The attempts a conflicted baseline pays, in recorded order: an exact tie keeps the earlier candidate, so order is part of the contract. */
const CONFLICTED_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([
  Object.freeze({ opposite: true, rule: "centroid" }),
  Object.freeze({ opposite: false, rule: "reach-circle" }),
  Object.freeze({ opposite: true, rule: "reach-circle" }),
]);

/** Limited or capped: opposite seed side, rule kept -- neither is a branch disagreement. A forbidden-side seed is held on its bound, so the authored side can be a fixed point; a cap never settles. */
const OPPOSITE_SIDE_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([
  Object.freeze({ opposite: true, rule: "centroid" }),
]);

const NO_ALTERNATIVES: readonly FabrikAlternative[] = Object.freeze([]);

/** Near-miss band, as a fraction of the addressed reach: a miss beyond it cannot justify more full attempts. */
const LEGAL_RETRY_REACH_FRACTION = 0.02;

/** Legal joint-space starts in stages: a stage runs only while no candidate has converged, so a rig the baseline meets pays none. */
type LegalStages = readonly (readonly LegalSeed[])[];

const legalRange = (fraction: LegalSeedFraction): LegalSeed =>
  Object.freeze({ kind: "legal-range", fraction });

/** The centre walked toward the aims in joint space. */
const DESCENT: LegalSeed = Object.freeze({ kind: "legal-descent" });

/** The descent alone: a non-planar hinge path's distant miss. */
const DESCENT_STAGES: LegalStages = Object.freeze([Object.freeze([DESCENT])]);

/** Staged legal-range starts a gated near miss on a non-planar 3D hinge pays for: both quartiles, then q10, then q90. */
const LEGAL_RANGE_STAGES: LegalStages = Object.freeze([
  Object.freeze([legalRange(0.25), legalRange(0.75)]),
  Object.freeze([legalRange(0.1)]),
  Object.freeze([legalRange(0.9)]),
]);

/** The same stages, then the descent, for a rig whose goals lie within reach. */
const LEGAL_RANGE_THEN_DESCENT_STAGES: LegalStages = Object.freeze([
  ...LEGAL_RANGE_STAGES,
  ...DESCENT_STAGES,
]);

/** The centre alone, for a constrained rig with no addressed extent: nothing a descent can turn. */
const CENTRE_STAGES: LegalStages = Object.freeze([Object.freeze([CENTRE_LEGAL_SEED])]);

/** Centre then the descent, for an arc-seeded rig: no arc side is legal for both signs of a mixed-sign chain, while the centre is legal for every range. */
const CENTRE_THEN_DESCENT_STAGES: LegalStages = Object.freeze([
  ...CENTRE_STAGES,
  ...DESCENT_STAGES,
]);

const NO_STAGES: LegalStages = Object.freeze([]);

/** Which legal joint-space starts a rig can use: decided by the dimension's solve from the rig, read here exhaustively; only this selector decides which of them a baseline pays for. */
export type LegalStarts =
  | { readonly kind: "none" }
  | { readonly kind: "centre" }
  | { readonly kind: "centre-then-descent" }
  | { readonly kind: "staged"; readonly reach: number }
  | { readonly kind: "staged-then-descent"; readonly reach: number };

/** The `none` start: a rig with no limited member. */
export const NO_LEGAL_STARTS: LegalStarts = Object.freeze({ kind: "none" });

/** The `centre` start: a constrained rig no start can turn. */
export const CENTRE_LEGAL_START: LegalStarts = Object.freeze({ kind: "centre" });

/** The `centre-then-descent` start, for an arc-seeded rig whose goals lie within reach. */
export const CENTRE_THEN_DESCENT: LegalStarts = Object.freeze({ kind: "centre-then-descent" });

/** Members the reach helpers read; a `goal` marks an addressed leaf. */
interface ReachMember {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly goal?: unknown;
}

/** One leaf's root-path extent in world units: lengths plus offsets over `base`, stopping on a repeat. */
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

/** Each addressed goal within its own root path's extent: necessary for any pose to meet it. Beyond that, or a `NaN` or infinite distance, no start reaches and a walk buys nothing. */
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

/** Arc-seeded constrained rig: centre alone without an addressed extent or with a goal out of reach, else centre then descent. One owner, so 2D and planar 3D cannot state it twice. */
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

/** Alternatives by quality: none for `converged`/`stalled` -- a settled fixed point gives no evidence another side escapes it; three for `conflicted`; opposite side for `limited`/`iteration-cap`. */
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

/** Gate: authored seed first and incumbent throughout -- a candidate wins only by `outranks`, so the result never ranks below the baseline. Then `fabrikAlternatives`, then `legalStages`. */
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

/** Strict beat, two steps: tier first -- `converged` outranks any miss whatever its residual -- then lower `residual`. Exact tie keeps the earlier candidate; `NaN` ranks last within a tier. */
export function outranks(candidate: IterativeQuality, selected: IterativeQuality): boolean {
  const tier = qualityTier(candidate) - qualityTier(selected);
  if (tier !== 0) return tier < 0;
  return fabrikResidualOutranks(candidate.residual, selected.residual);
}

/** Tier: `0` when the goal is met, `1` for every miss, read exhaustively. */
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
