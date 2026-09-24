import type { ClosedFormQuality } from "./ik-result";
import type { Euler3d } from "./frame3d";

/**
 * The name of the solver's published pose channel, stated once for the solver that writes it and
 * the member that reads it. `rotations3d` rather than 2D's `rotations`, so a track registering both
 * solvers is refused as a duplicate output instead of one pose silently replacing the other.
 */
export const ROTATIONS3D_KEY = "rotations3d" as const;

/**
 * The internal 3D solver result. It reuses the closed-form quality union so reachability has one
 * vocabulary across dimensions, while keeping the renderer-neutral Euler pose under `rotations3d`.
 */
export type SolveResult3d = {
  readonly rotations3d: Readonly<Record<string, Euler3d>>;
  readonly residuals: Readonly<Record<string, number>>;
  readonly quality: ClosedFormQuality;
};
