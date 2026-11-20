import { motion, type Motion, type Pose2d } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `trace`. */
export interface TraceOptions {
  /** Share of the path that stays drawn behind the head, from 0.001 to 1; default 1 keeps all of it. */
  readonly tail?: number;
}

/** Draws a stroked path on from its start, keeping a share of it drawn behind the head. */
export function trace(
  options: TraceOptions = {},
): Motion<Required<Pick<Pose2d, "drawn" | "drawnFrom">>> {
  const tail = numberOption("trace", "tail", options.tail, { default: 1, min: 0.001, max: 1 });
  return motion(({ progress }) => ({ drawn: progress, drawnFrom: Math.max(0, progress - tail) }));
}
