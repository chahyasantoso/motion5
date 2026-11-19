import { motion, type Motion, type Pose2d } from "@gerak/core";
import { squashed } from "../parts/coupling/squashed";
import { numberOption } from "./options";

/** Share of the progress the fall takes; the drop lands at this share. */
export const DROP_LANDING = 0.75;

/** Options of `drop`. */
export interface DropOptions {
  /** Start this far above rest, in px; at least 0, required. */
  readonly distance: number;
  /** Height lost on landing, as a share from 0 to 1; default 0. */
  readonly squash?: number;
}

/** Falls from above, accelerating, then lands and recovers from its squash. */
export function drop(options: DropOptions): Motion<Pose2d> {
  const distance = numberOption("drop", "distance", options.distance, { min: 0 });
  const squash = numberOption("drop", "squash", options.squash, { default: 0, min: 0, max: 1 });
  const squeeze = squashed({ squash });
  return motion(({ progress }) => {
    const fall = Math.min(1, progress / DROP_LANDING);
    const settled = Math.max(0, (progress - DROP_LANDING) / (1 - DROP_LANDING));
    const weight = progress < DROP_LANDING ? 0 : (1 - settled) ** 2;
    return { y: 0 - distance * (1 - fall * fall), ...squeeze(weight) };
  });
}
