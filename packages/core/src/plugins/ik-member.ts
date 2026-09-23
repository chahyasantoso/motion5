import { ZERO_PIVOT_OFFSET, type PivotOffset, type WorldFrame } from "./frame";

/**
 * One member as every solve strategy reads it: its id, the node it hangs from, its segment length,
 * its authored pivot offset, and the frame it reaches toward when it is a chain leaf the author
 * addressed.
 *
 * **One read model, built once, consumed by every strategy.** Before issue #349's first phase the
 * closed form read `MemberState.values.length` and `readPivotOffset(values)` straight out of the
 * opaque authored record while FABRIK read a narrow view built beside it, so the two strategies
 * answered "how long is this bone" through two different paths that happened to agree. The adapter
 * in `ik-chain.ts` now builds this record once per solve and both strategies read only it, which is
 * the drift `frame.ts` exists to refuse, one level up. See ADR-106.
 *
 * `base` may name another member or a node outside the member set. The one outside is the chain's
 * root, and it is read from the root frame rather than looked up: membership is derived once, in
 * `resolveSolvers`, and no strategy re-derives anything about the graph.
 *
 * `length` is the authored number exactly as `readNumber` read it, negative values included. The
 * clamp to zero is `solveLength`'s, below, so a strategy cannot read a negative extent by reading
 * the field directly and forgetting the clamp the other strategy applied.
 *
 * `pivot` is optional and absent means zero, which is what `fk` composes for a bone that authored
 * neither key. Optional rather than required because zero is the overwhelming majority and a
 * required field would put `{ x: 0, y: 0 }` on every fixture in the suite to say nothing; the
 * default is a documented value here rather than a field accepted and ignored, and `PV-6` pins that
 * an explicit zero and an absent offset solve to the same doubles. The adapter always supplies it.
 *
 * `goal` is present only on a chain leaf the author addressed, under either goal spelling.
 */
export interface SolveMember {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly pivot?: PivotOffset;
  readonly goal?: WorldFrame;
}

/**
 * The extent a strategy solves with: the authored length, never negative.
 *
 * The single owner of that clamp. The closed form and FABRIK each applied `Math.max(0, length)`
 * privately; a third strategy (constraints, or `ik3d`'s shared traversal) calling this instead of
 * restating it is what keeps a negative authored length meaning one thing on every path.
 */
export function solveLength(member: SolveMember): number {
  return Math.max(0, member.length);
}

/**
 * The pivot offset a strategy solves with, with absence read as the documented zero.
 *
 * Returns the shared frozen `ZERO_PIVOT_OFFSET` rather than a fresh `{ x: 0, y: 0 }`, so the
 * zero-offset short circuits in `frame.ts` see exactly what they saw before this owner existed.
 */
export function solveOffset(member: SolveMember): PivotOffset {
  return member.pivot ?? ZERO_PIVOT_OFFSET;
}
