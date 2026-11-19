import { motion, type Motion, type Pose2d } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `smudge`. */
export interface SmudgeOptions {
  /** The blur it ends at, in px; at least 0, required. */
  readonly amount: number;
  /** Share of the span the blur takes to build, then holds, from 0.05 to 1; default 1. */
  readonly build?: number;
}

/** Blurs from sharp to a given blur as speed builds, for motion blur on something leaping or thrown. */
export function smudge(options: SmudgeOptions): Motion<Pose2d> {
  const amount = numberOption("smudge", "amount", options.amount, { min: 0 });
  const build = numberOption("smudge", "build", options.build, { default: 1, min: 0.05, max: 1 });
  return motion(({ progress }) => {
    const q = Math.min(1, progress / build);
    return { blur: amount * q * q };
  });
}
