import { type Pose2d, type Time } from "@gerak/core";

const CURVES = {
  linear: (p: number) => p,
  in: (p: number) => p * p * p,
  out: (p: number) => 1 - (1 - p) ** 3,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
} as const;

/** Options of `tint`. */
export interface TintOptions {
  /** The custom number's name; the page reads it as --<name>. */
  readonly name: string;
  /** Where the number ends; default 1, a full change of colour. */
  readonly amount?: number;
  /** How the change is spread over the span; default linear. */
  readonly curve?: "linear" | "in" | "out" | "inOut";
}

/** Turns a named custom number from 0 to an amount, for a colour charging, flipping or flashing that the page's CSS reads as --<name>. */
export function tint(options: TintOptions): (time: Time) => Pose2d {
  const { name, amount = 1, curve = "linear" } = options;
  return ({ progress }): Pose2d => ({
    custom: { [name]: amount * CURVES[curve](progress) },
  });
}
