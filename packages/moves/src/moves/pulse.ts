import { motion, type Motion, arch, type Pose2d } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `pulse`. */
export interface PulseOptions {
  /** How much it grows, as a share of its size from 0 to 2; default 0.15. */
  readonly amount?: number;
}

/** Grows a little and returns to its size. */
export function pulse(options: PulseOptions = {}): Motion<Pose2d> {
  const amount = numberOption("pulse", "amount", options.amount, { default: 0.15, min: 0, max: 2 });
  return motion(({ progress }) => ({ scale: 1 + amount * arch(progress) ** 2 }));
}
