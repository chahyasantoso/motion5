import { arch, type Pose2d, type Time } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `nod`. */
export interface NodOptions {
  /** How far down it dips, in px; at least 0, required. */
  readonly distance: number;
}

/** Dips down and comes back up, once. */
export function nod(options: NodOptions): (time: Time) => Pose2d {
  const distance = numberOption("nod", "distance", options.distance, { min: 0 });
  return ({ progress }) => ({ y: distance * arch(progress) ** 2 });
}
