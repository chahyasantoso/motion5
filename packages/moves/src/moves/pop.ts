import type { Pose2d, Time } from "@gerak/core";
import { numberOption } from "./options";

const PEAK_SHARE = 0.6;

/** Options of `pop`. */
export interface PopOptions {
  /** How far past full size it grows, as a share from 0 to 1; default 0.2. */
  readonly overshoot?: number;
}

/** Grows from nothing past full size, then settles to exactly full size. */
export function pop(options: PopOptions = {}): (time: Time) => Pose2d {
  const overshoot = numberOption("pop", "overshoot", options.overshoot, {
    default: 0.2,
    min: 0,
    max: 1,
  });
  return ({ progress }) => {
    if (progress < PEAK_SHARE) {
      const grow = progress / PEAK_SHARE;
      return { scale: (1 + overshoot) * (1 - (1 - grow) ** 2) };
    }
    const settle = (progress - PEAK_SHARE) / (1 - PEAK_SHARE);
    return { scale: 1 + overshoot * (1 - settle) ** 2 };
  };
}
