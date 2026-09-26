import type { ClosedFormQuality, SolveEvidence } from "./ik-result";
import type { Euler3d } from "./frame3d";

/**
 * The name of the solver's published pose channel, stated once for the solver that writes it and
 * the member that reads it. `rotations3d` rather than 2D's `rotations`, so a track registering both
 * solvers is refused as a duplicate output instead of one pose silently replacing the other.
 */
export const ROTATIONS3D_KEY = "rotations3d" as const;

/**
 * The internal 3D solver result. Its `quality` and `residuals` are the 2D result's own
 * `SolveEvidence`, narrowed to the closed-form kinds, so reachability has one vocabulary across
 * dimensions and the one inspection projection reads a 3D solve without a 3D copy (ADR-120). Only
 * the pose is dimensional: renderer-neutral Euler triples under `rotations3d`.
 */
export type SolveResult3d = SolveEvidence<ClosedFormQuality> & {
  readonly rotations3d: Readonly<Record<string, Euler3d>>;
};
