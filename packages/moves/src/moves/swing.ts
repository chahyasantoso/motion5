import { motion, type Motion, taper, wave, type Anchor, type Pose2d } from "@gerak/core";
import { choiceOption, numberOption } from "./options";

const fade = taper({ power: 1 });
const ANCHORS: readonly Anchor[] = ["center", "bottom", "top", "left", "right"];

/** Options of `swing`. */
export interface SwingOptions {
  /** Start turned this far, in degrees; required. */
  readonly angle: number;
  /** Half-swings before it settles, from 0 to 8; default 2. */
  readonly swings?: number;
  /** The hinge, the point that stays put: center, bottom, top, left or right; default top. */
  readonly anchor?: Anchor;
}

/** Hangs in from a turn and swings to rest, each swing smaller than the last. */
export function swing(options: SwingOptions): Motion<Pose2d> {
  const angle = numberOption("swing", "angle", options.angle);
  const swings = numberOption("swing", "swings", options.swings, { default: 2, min: 0, max: 8 });
  const anchor = choiceOption("swing", "anchor", options.anchor, ANCHORS, "top");
  return motion(({ progress }) => {
    const turn = wave({ count: (swings + 0.5) / 2, phase: 0.25 })(progress);
    return { rotation: angle * fade(progress) * turn, anchor };
  });
}
