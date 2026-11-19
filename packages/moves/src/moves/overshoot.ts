import {
  arch,
  motion,
  taper,
  withProgress,
  type Motion,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { numberOption } from "./options";
import { carried, pushed, whole } from "./whole";

const fade = taper({ power: 1 });

/** Options of `overshoot`. */
export interface OvershootOptions {
  /** Share of the progress spent past the end, from 0 to 0.9; default 0.3. */
  readonly share?: number;
  /** How far past the end, as a share of the input's whole travel from 0 to 1; default 0.1. */
  readonly amount?: number;
}

/** Plays another move, then goes a little past its end and settles back. */
export function overshoot(
  options: OvershootOptions = {},
): (signal: (time: Time) => Pose2d) => Motion<Pose2d> {
  const share = numberOption("overshoot", "share", options.share, {
    default: 0.3,
    min: 0,
    max: 0.9,
  });
  const amount = numberOption("overshoot", "amount", options.amount, {
    default: 0.1,
    min: 0,
    max: 1,
  });
  return (signal) =>
    motion((time) => {
      const at = (progress: number) => signal(withProgress(time, progress));
      const first = at(0);
      const last = at(1);
      const playing = 1 - share;
      if (time.progress <= playing) {
        const played = at(time.progress / playing);
        return whole(played, carried(first, last, played));
      }
      const v = (time.progress - playing) / share;
      return pushed(last, first, amount * arch(v) * fade(v), carried(first, last));
    });
}
