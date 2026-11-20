import { combine } from "../fields/combine";
import { combine3d, type Pose3d } from "../fields/pose3d";
import type { Pose2d } from "../fields/pose";
import { velocity } from "../measure/velocity";
import { velocity3d } from "../measure/velocity3d";
import type { Signal } from "../time/shapes";
import { smear } from "./smear";
import { smear3d } from "./smear3d";

/** `stretch`: extra length per 1000 px/s (per unit a second in 3D), 0 or more; `max`: the longest stretch, 1 or more. */
export interface SquashStretchOptions {
  readonly stretch: number;
  readonly max: number;
}

function check(options: SquashStretchOptions, name: string): void {
  if (!(options.stretch >= 0)) throw new RangeError(`${name}: stretch must be 0 or more.`);
  if (!(options.max >= 1)) throw new RangeError(`${name}: max must be 1 or more.`);
}

/** The signal stretched along its own travel and squashed across it, area kept. */
export function squashStretch(
  options: SquashStretchOptions,
): (signal: Signal<Pose2d>) => Signal<Pose2d> {
  check(options, "squashStretch");
  const { stretch, max } = options;
  return (signal) => (time, events) =>
    combine([signal(time, events), smear(velocity(signal, time, events), { stretch, max }).pose]);
}

/** The 3D signal stretched along its own travel and squashed across it, volume kept. */
export function squashStretch3d(
  options: SquashStretchOptions,
): (signal: Signal<Pose3d>) => Signal<Pose3d> {
  check(options, "squashStretch3d");
  const { stretch, max } = options;
  return (signal) => (time, events) =>
    combine3d([
      signal(time, events),
      smear3d(velocity3d(signal, time, events), { stretch, max }).pose,
    ]);
}
