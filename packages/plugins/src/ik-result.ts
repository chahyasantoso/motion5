import { INSPECT_KEY, INSPECTION_KEY, unreachable } from "@motion5/core/plugin-api";

/** One IK solve answer, same shape every strategy: rotations plus quality. */
export interface SolveResult<Q extends SolveQuality = SolveQuality> extends SolveEvidence<Q> {
  readonly rotations: Readonly<Record<string, number>>;
}

/** Solve outcome without pose: quality plus per-leaf residuals, independent of dimension. */
export interface SolveEvidence<Q extends SolveQuality = SolveQuality> {
  readonly residuals: Readonly<Record<string, number>>;
  readonly quality: Q;
}

/** How well rotations met the goal: one flat union over both strategies. Residual is distance left;
 * kind says why. */
export type SolveQuality =
  /** Goal inside reach band; hinge-limit pair recovery leaves a tiny residual of its recomposed pose. */
  | { readonly kind: "reached"; readonly residual: number }
  /** Goal beyond the outer reach; chain extended toward it, residual = clamp distance. */
  | { readonly kind: "too-far"; readonly residual: number }
  /** Goal inside the inner reach limit; chain folded toward it, residual = clamp distance. */
  | { readonly kind: "too-near"; readonly residual: number }
  /** Goal on the base with reach === l2: no aim direction, rest pose, residual = tip offset. */
  | { readonly kind: "coincident"; readonly residual: number }
  /** Residual inside tolerance after iterating; iterations states the count. */
  | { readonly kind: "converged"; readonly iterations: number; readonly residual: number }
  /** Fixed point outside tolerance; iterations states the count. */
  | { readonly kind: "stalled"; readonly iterations: number; readonly residual: number }
  /** Still moving at the hard cap; iterations states the count. */
  | { readonly kind: "iteration-cap"; readonly iterations: number; readonly residual: number }
  /** Branches pulled a shared member beyond tolerance apart; pose is their weighted compromise. */
  | { readonly kind: "conflicted"; readonly iterations: number; readonly residual: number }
  /** A joint rests on its bound; atBound names members. */
  | {
      readonly kind: "limited";
      readonly iterations: number;
      readonly residual: number;
      readonly atBound: readonly string[];
    };

/** Closed-form quality kinds: a subset of SolveQuality, not a second union. */
export type ClosedFormQuality = Extract<
  SolveQuality,
  { readonly kind: "reached" | "too-far" | "too-near" | "coincident" }
>;

/** FABRIK quality kinds: a subset of SolveQuality, not a second union. */
export type IterativeQuality = Extract<
  SolveQuality,
  { readonly kind: "converged" | "stalled" | "iteration-cap" | "conflicted" | "limited" }
>;

/** Fixed-shape inspection record, `residuals` on every kind. Alias, not interface: aliases alone
 * get the implicit index signature `ImmutableRecord` spreading requires. */
export type SolveInspection = {
  readonly kind: SolveQuality["kind"];
  readonly residual: number;
  readonly iterations: number;
  readonly atBound: readonly string[];
  readonly residuals: Readonly<Record<string, number>>;
};

const NO_BOUNDS: readonly string[] = Object.freeze([]);

/** Project into one frozen, renderer-neutral shape; residual and bound copies never alias solver state. */
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

/** What a solver adds for inspection: the record, or nothing. */
export type InspectionOutput =
  | Readonly<Record<typeof INSPECTION_KEY, SolveInspection>>
  | Readonly<Record<never, never>>;

const NO_INSPECTION: InspectionOutput = Object.freeze({});

/** One reading of the `inspect` opt-in: publish only when static `inspect` is exactly `true`.
 * Malformed switches are refused at load, so this strict compare is the whole runtime check. */
export function inspectionOutput(
  values: Readonly<Record<string, unknown>>,
  result: SolveEvidence,
): InspectionOutput {
  return values[INSPECT_KEY] === true
    ? Object.freeze({ [INSPECTION_KEY]: inspectSolve(result) })
    : NO_INSPECTION;
}
