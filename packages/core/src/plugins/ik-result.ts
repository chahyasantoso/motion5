import { INSPECT_KEY, INSPECTION_KEY } from "../contract/solver-constraints";
import { unreachable } from "../lang/exhaustive";

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
 * `rotations` is always published. An opted-in `inspection` output is a fixed-shape projection of
 * `quality` and `residuals`, and this module owns both the projection and the reading of the opt-in
 * (`inspectionOutput`), so the solver's patch shape stays stable across arity, strategy and
 * dimension. Unopted rigs keep the phase 3 output byte for byte.
 *
 * `residuals` holds one entry per addressed leaf, the world-unit distance its tip is left from its
 * own goal, keyed by member id in the solve's canonical order. `quality.residual` stays the worst
 * of them, so a caller that wants one number still reads one, and a caller asking which goal paid
 * for a compromise reads the record instead of re-composing the pose. The closed form addresses
 * exactly one leaf, so its record has exactly one entry, equal to its residual. See ADR-110.
 */
export interface SolveResult<Q extends SolveQuality = SolveQuality> extends SolveEvidence<Q> {
  readonly rotations: Readonly<Record<string, number>>;
}

/**
 * How well a solve answered its goals, without the pose it answered with: the part of a result
 * that does not depend on the dimension the solve ran in.
 *
 * The pose does depend on it. A 2D solve publishes one angle per member under `rotations`, and the
 * 3D closed form publishes one Euler triple per member under `rotations3d` (ADR-114), so the two
 * results cannot share a pose field. They do share every word of this one: `quality` is the same
 * closed union, `residuals` the same per-leaf record, and the inspection projection reads nothing
 * else. Stating it once here is what lets `inspectSolve` and `inspectionOutput` serve both
 * dimensions from one owner instead of a 3D copy (ADR-120), and `SolveResult` and `SolveResult3d`
 * each extend it with their own pose rather than restating it.
 */
export interface SolveEvidence<Q extends SolveQuality = SolveQuality> {
  readonly residuals: Readonly<Record<string, number>>;
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
 * rather than aliased, and they keep the iteration count only they can state. `limited` (ADR-108)
 * names a miss with a joint resting on its bound. `conflicted` (ADR-110) names a miss where the
 * branches of a multi-goal chain still pulled a shared member to places more than tolerance apart
 * in the last pass, so the published pose is their influence-weighted compromise. It says this
 * solve did not satisfy the goals together, not that no pose could: FABRIK is not a global solver,
 * and `residuals` says which goal paid.
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
  | { readonly kind: "iteration-cap"; readonly iterations: number; readonly residual: number }
  | { readonly kind: "conflicted"; readonly iterations: number; readonly residual: number }
  | {
      readonly kind: "limited";
      readonly iterations: number;
      readonly residual: number;
      readonly atBound: readonly string[];
    };

/** The kinds the closed form can answer with, as a subset of the union rather than a second one. */
export type ClosedFormQuality = Extract<
  SolveQuality,
  { readonly kind: "reached" | "too-far" | "too-near" | "coincident" }
>;

/** The kinds FABRIK can answer with, as a subset of the union rather than a second one. */
export type IterativeQuality = Extract<
  SolveQuality,
  { readonly kind: "converged" | "stalled" | "iteration-cap" | "conflicted" | "limited" }
>;

/**
 * The fixed-shape inspection record exposed when an IK author opts into solve inspection.
 *
 * A type alias rather than an interface on purpose: `PluginComposer` returns `ImmutableRecord`, an
 * index-signature type, and TypeScript grants the implicit index signature to aliases only, so an
 * interface here fails `typecheck` where `ik.ts` spreads it into the published values.
 *
 * `residuals` is the result's per-leaf record, present on every kind so the shape stays fixed: one
 * entry on the closed form, one per addressed leaf on FABRIK. See ADR-110.
 */
export type SolveInspection = {
  readonly kind: SolveQuality["kind"];
  readonly residual: number;
  readonly iterations: number;
  readonly atBound: readonly string[];
  readonly residuals: Readonly<Record<string, number>>;
};

const NO_BOUNDS: readonly string[] = Object.freeze([]);

/**
 * Projects every solve result into one frozen shape suitable for a renderer-neutral output.
 *
 * `residuals` is copied and frozen like `atBound`, so the published record never aliases the
 * solver's own state whoever produced the result.
 */
export function inspectSolve(result: SolveEvidence): SolveInspection {
  const { quality } = result;
  const residuals: Readonly<Record<string, number>> = Object.freeze({ ...result.residuals });
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
      return Object.freeze({
        kind: quality.kind,
        residual: quality.residual,
        iterations: 0,
        atBound: NO_BOUNDS,
        residuals,
      });
    case "converged":
    case "stalled":
    case "iteration-cap":
    case "conflicted":
      return Object.freeze({
        kind: quality.kind,
        residual: quality.residual,
        iterations: quality.iterations,
        atBound: NO_BOUNDS,
        residuals,
      });
    case "limited":
      return Object.freeze({
        kind: quality.kind,
        residual: quality.residual,
        iterations: quality.iterations,
        atBound: Object.freeze([...quality.atBound]),
        residuals,
      });
    default:
      return unreachable(quality);
  }
}

/** What a solver adds to its published values for inspection: the record, or nothing at all. */
export type InspectionOutput =
  | Readonly<Record<typeof INSPECTION_KEY, SolveInspection>>
  | Readonly<Record<never, never>>;

const NO_INSPECTION: InspectionOutput = Object.freeze({});

/**
 * The one reading of a solver's inspection opt-in, shared by every solver that publishes one.
 *
 * `inspection` is published only when the solver's own static `inspect` is exactly `true`, so its
 * presence is a function of authoring rather than of arity, strategy or dimension, and an unopted
 * patch keeps the keys and bytes it had before ADR-109. The graph's `ik-inspect-malformed`
 * refuses a non-boolean or keyframed switch at load, so the strict comparison is the whole runtime
 * reading rather than a second validator. A solver spreads the answer after its pose, so the key
 * order of an opted patch is the same in 2D and in 3D. It lived inline in `ik.ts` until the 3D
 * solver needed the same decision, and a second inline copy would have been a second owner of what
 * `inspect: true` means (ADR-120).
 */
export function inspectionOutput(
  values: Readonly<Record<string, unknown>>,
  result: SolveEvidence,
): InspectionOutput {
  return values[INSPECT_KEY] === true
    ? Object.freeze({ [INSPECTION_KEY]: inspectSolve(result) })
    : NO_INSPECTION;
}
