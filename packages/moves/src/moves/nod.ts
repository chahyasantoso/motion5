import { motion, type Motion, arch, type Pose2d } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `nod`. */
export interface NodOptions {
  /** How far down it dips, in px; at least 0, required. */
  readonly distance: number;
}

/** Dips down and comes back up, once. */
export function nod(options: NodOptions): Motion<Pose2d> {
  const distance = numberOption("nod", "distance", options.distance, { min: 0 });
  return motion(({ progress }) => ({ y: distance * arch(progress) ** 2 }));
}
