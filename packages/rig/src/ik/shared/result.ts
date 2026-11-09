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
