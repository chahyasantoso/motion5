/**
 * What one IK solve answers: the local rotations it publishes, and how well they answer the goal.
 *
 * **One result type for every strategy.** Before issue #349's second phase the closed form returned
 * a bare rotations record and FABRIK returned rotations beside a convergence record only it could
 * state, so "did this solve reach its goal" had an answer on one path and no answer on the other,
 * and a caller that wanted it had to know which strategy the dispatcher had picked. Both strategies
 * now return this record and `solveChain` returns it from both arms, so the question has one shape
 * whichever strategy answered it. See ADR-107.
 *
 * `rotations` is the only half anything publishes. `ik.ts` reads it and drops `quality`, because a
 * solver's patch shape must not become a function of its arity and `FB-9` pins the published keys;
 * the quality record is for a caller that diagnoses a solve, not for the patch.
 */
export interface SolveResult<Q extends SolveQuality = SolveQuality> {
  readonly rotations: Readonly<Record<string, number>>;
  readonly quality: Q;
}

/**
 * How well a solve's rotations answer its goal: one flat closed union across both strategies.
 *
 * Every variant carries `residual`, the world-unit distance the composed tip is left from the goal,
 * so a caller that only wants the miss reads it without a `switch`. The kind says why the miss is
 * what it is, and that is where the two strategies differ rather than where they agree:
 *
 * The closed form is exact, so its kinds describe the geometry. `reached` means the goal lies in
 * the reach band and the residual is zero. `too-far` and `too-near` mean the goal lies outside the
 * band `[|reach - l2|, reach + l2]` and the chain was extended or folded toward it; the residual is
 * `|d - clampedD|`, the distance the clamp already computes. `coincident` is the one geometric
 * miss inside the band: a goal on the chain's own base with `reach === l2`, which has no direction
 * to aim at, so the closed form answers with the rest pose and the residual is where that pose puts
 * the tip.
 *
 * FABRIK is iterative, so its kinds describe the iteration: a residual inside tolerance
 * `converged`, a fixed point outside it `stalled`, and a still-moving pose at the hard cap hit
 * `iteration-cap`. Those three moved here from `fabrik.ts`, whose `FabrikConvergence` is deleted
 * rather than aliased, and they keep the iteration count only they can state.
 *
 * Flat rather than nested under a strategy tag. A caller reads one discriminant and a `switch`
 * over it ending in `unreachable` is exhaustive over every answer any strategy gives; a nested
 * `{ strategy, quality }` would make that two reads and let a strategy tag disagree with the kinds
 * beside it. The strategy family is recoverable from the kind, which `IR-7` pins. See ADR-092.
 */
export type SolveQuality =
  | { readonly kind: "reached"; readonly residual: number }
  | { readonly kind: "too-far"; readonly residual: number }
  | { readonly kind: "too-near"; readonly residual: number }
  | { readonly kind: "coincident"; readonly residual: number }
  | { readonly kind: "converged"; readonly iterations: number; readonly residual: number }
  | { readonly kind: "stalled"; readonly iterations: number; readonly residual: number }
  | { readonly kind: "iteration-cap"; readonly iterations: number; readonly residual: number };

/** The kinds the closed form can answer with, as a subset of the union rather than a second one. */
export type ClosedFormQuality = Extract<
  SolveQuality,
  { readonly kind: "reached" | "too-far" | "too-near" | "coincident" }
>;

/** The kinds FABRIK can answer with, as a subset of the union rather than a second one. */
export type IterativeQuality = Extract<
  SolveQuality,
  { readonly kind: "converged" | "stalled" | "iteration-cap" }
>;
