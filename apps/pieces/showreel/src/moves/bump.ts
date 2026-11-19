import { arch, type Pose2d, type Time } from "@gerak/core";

/** Options of `bump`. */
export interface BumpOptions {
  /** Furthest right it goes, in px (negative: left); default 0. */
  readonly dx?: number;
  /** Furthest down it goes, in px (negative: up); default 0. */
  readonly dy?: number;
  /** Furthest it turns, in degrees; default 0. */
  readonly turn?: number;
}

/** Eases out by an offset and a turn and eases back, once, in either direction. */
export function bump(options: BumpOptions = {}): (time: Time) => Pose2d {
  const { dx = 0, dy = 0, turn = 0 } = options;
  return ({ progress }): Pose2d => {
    const s = arch(progress) ** 2;
    return { x: dx * s, y: dy * s, rotation: turn * s };
  };
}
