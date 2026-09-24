import { INFLUENCE_KEY, readInfluenceValue } from "../contract/solver-constraints";
import type { WorldPoint } from "./frame";
import type { SolveMember } from "./ik-member";

/**
 * The one runtime owner of goal influence: how strongly each addressed goal pulls on the members
 * its branch shares with other branches, and the weighted compromise those pulls settle on. See
 * ADR-110.
 *
 * **Influence is the goal's, never the bone's.** A member's blend `weight` says how much of the
 * solved angle the bone composes with, after the solve (ADR-055). Influence says how much a goal's
 * branch counts when branches disagree about a shared member, inside the solve. The two questions
 * sit on opposite sides of the line ADR-055 draws, so neither reads the other.
 *
 * **A compromise, not a priority.** FABRIK settles a sub-base on one point from its branches'
 * proposals, and influence turns the equal mean into a weighted one. Strict priorities (goal A is
 * met exactly and goal B only in what is left) need a null-space projection that FABRIK does not
 * have, so they are withdrawn rather than approximated. See ADR-110.
 */

/** The influence a goal has when its leaf authored none. */
export const DEFAULT_INFLUENCE = 1;

/**
 * The influence a member's live values declare, or `undefined` for anything outside the domain.
 *
 * Total over any live value, as `readJointLimit` is, because a value-tier write bypasses load:
 * load refuses every malformed authored influence, and an out-of-domain live one reads as absent
 * and so as the default rather than as a weight the compromise cannot divide by.
 */
export function readInfluence(values: Readonly<Record<string, unknown>>): number | undefined {
  return readInfluenceValue(values[INFLUENCE_KEY]);
}

/** The influence a solve uses for one member's goal, absence read as the documented default. */
export function goalInfluence(member: SolveMember): number {
  return member.influence ?? DEFAULT_INFLUENCE;
}

/**
 * Each member's pull: the mean influence of the addressed leaves in the subtree it roots.
 *
 * The mean rather than the sum, because a branch's say over a shared member is what its goals
 * want, not how many of them there are, and because with every influence at its default the mean
 * is exactly `1` for every member, which is what keeps an unweighted rig's compromise the equal
 * average it always was, bit for bit. A member no addressed leaf hangs under pulls with the
 * default, which is what an unaddressed branch contributed before influence existed.
 *
 * The mean is taken relative to the subtree's largest influence, `max · (Σ(v / max) / n)`, rather
 * than as `Σv / n`, because every admitted influence is finite but their sum need not be: two
 * leaves at `Number.MAX_VALUE` overflow `Σv` to `Infinity`, and the compromise would then divide
 * `Infinity` by `Infinity`. Each ratio is at most `1` and the largest is exactly `1`, so the scaled
 * sum is finite and at least `1`, and the pull is finite and positive. With every influence at `1`
 * the scale is `1`, every ratio is `1`, and the pull is `1 · (n / n)`, exactly `1`.
 *
 * `addressed` is the caller's own list of the leaves it seeds from goals, so this function answers
 * about exactly the leaves the solve reaches toward rather than re-deriving leafhood.
 */
export function branchPulls(
  byId: ReadonlyMap<string, SolveMember>,
  addressed: readonly string[],
): ReadonlyMap<string, number> {
  const under = new Map<string, number[]>();
  for (const leaf of addressed) {
    const member = byId.get(leaf);
    if (member === undefined) continue;
    const influence = goalInfluence(member);
    const seen = new Set<string>();
    for (let id: string | undefined = leaf; id !== undefined && !seen.has(id); ) {
      seen.add(id);
      const list = under.get(id) ?? [];
      list.push(influence);
      under.set(id, list);
      id = byId.get(id)?.base;
      if (id !== undefined && !byId.has(id)) id = undefined;
    }
  }
  const pulls = new Map<string, number>();
  for (const id of byId.keys()) pulls.set(id, scaledMean(under.get(id) ?? []));
  return pulls;
}

/** The mean of positive finite influences without overflow, or the default for none. */
function scaledMean(influences: readonly number[]): number {
  if (influences.length === 0) return DEFAULT_INFLUENCE;
  let scale = 0;
  for (const influence of influences) scale = Math.max(scale, influence);
  let ratios = 0;
  for (const influence of influences) ratios += influence / scale;
  return scale * (ratios / influences.length);
}

/** One branch's proposal for a shared member's tip, and the pull it is weighed by. */
export interface Pull {
  readonly point: WorldPoint;
  readonly weight: number;
}

/**
 * Where a shared member settles, and how far its branches disagreed about it.
 *
 * `spread` is the largest distance from the settled point to any branch's proposal. It is zero
 * wherever one branch proposed, and it stays above tolerance after the last pass only when the
 * branches still pull the member to different places, which is the witness FABRIK's `conflicted`
 * kind reads rather than an inference from the goal count.
 */
export interface Compromise {
  readonly point: WorldPoint;
  readonly spread: number;
}

/**
 * The influence-weighted mean of one member's proposals, `Σw·p / Σw`.
 *
 * A lone proposal is weighed by `1` whatever its pull, because a branch with nobody to compromise
 * with settles where it proposed, and `(w·x) / w` is not `x` in floating point. Several proposals
 * are weighed relative to the largest pull, `w / max`, which leaves the mean unchanged in exact
 * arithmetic and keeps it finite in floating point: every relative weight is at most `1`, the
 * largest is exactly `1`, so `Σw` is at least `1` and never overflows or vanishes, where raw pulls
 * near `Number.MAX_VALUE` would overflow `Σw` and settle the member on `NaN`. With every weight
 * exactly `1` the scale is `1` and the sums are the ones FABRIK always took (`0 + 1·x` is `0 + x`,
 * including the `-0` the zero-seeded sum normalises to `+0`) and the divisor is the proposal
 * count, so an unweighted rig settles on the equal mean bit for bit. Weights are positive and
 * finite by construction (`readInfluenceValue` admits nothing else and a pull is a scaled mean of
 * admitted values), and `pulls` is never empty because FABRIK asks only about a member that
 * received a proposal.
 */
export function compromise(pulls: readonly Pull[]): Compromise {
  const lone = pulls.length === 1;
  let scale = 0;
  for (const { weight } of pulls) scale = Math.max(scale, weight);
  let sumX = 0;
  let sumY = 0;
  let sumW = 0;
  for (const { point, weight } of pulls) {
    const w = lone ? 1 : weight / scale;
    sumX += w * point.x;
    sumY += w * point.y;
    sumW += w;
  }
  const point: WorldPoint = Object.freeze({ x: sumX / sumW, y: sumY / sumW });
  let spread = 0;
  for (const pull of pulls) {
    spread = Math.max(spread, Math.hypot(pull.point.x - point.x, pull.point.y - point.y));
  }
  return { point, spread };
}
