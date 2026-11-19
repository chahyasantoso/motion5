import type { Pose2d, Time } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `wipe`. */
export interface WipeOptions {
  /** Final circle radius, in px, at least 0; cover the stage's far corner; required. */
  readonly radius: number;
  /** Circle centre from the target's left edge, in px; required. */
  readonly x: number;
  /** Circle centre from the target's top edge, in px; required. */
  readonly y: number;
}

/** Reveals the target through a circle that grows from a point, easing in and out, answering `clipX`,
 * `clipY` and `clipRadius` in px from the target's top left. */
export function wipe(
  options: WipeOptions,
): (time: Time) => Required<Pick<Pose2d, "clipX" | "clipY" | "clipRadius">> {
  const radius = numberOption("wipe", "radius", options.radius, { min: 0 });
  const x = numberOption("wipe", "x", options.x);
  const y = numberOption("wipe", "y", options.y);
  return ({ progress }) => ({
    clipX: x,
    clipY: y,
    clipRadius: radius * progress * progress * (3 - 2 * progress),
  });
}
