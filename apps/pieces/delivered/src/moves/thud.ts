import { attack, motion, taper, wave, type Motion, type Pose2d } from "@gerak/core";
import { squashed } from "@gerak/moves";

const rise = attack({ rate: 40 });
const fade = taper({ power: 2 });

/** Options of `thud`. */
export interface ThudOptions {
  /** Height lost at the first crush, as a share; default 0.2. */
  readonly squash?: number;
  /** Widest tip about its base, in degrees; default 5. */
  readonly tilt?: number;
  /** Crush-and-stretch cycles over the span; default 3. */
  readonly rings?: number;
}

/** A heavy body takes an impact on its base: it is crushed at once, then rings in height and tips side to side, each swing smaller. */
export function thud(options: ThudOptions = {}): Motion<Pose2d> {
  const { squash = 0.2, tilt = 5, rings = 3 } = options;
  return motion(({ progress }): Pose2d => {
    const built = rise(progress);
    const left = fade(progress);
    const crush = squash * built * left * wave({ count: rings, phase: 0.25 })(progress);
    const sway = tilt * built * left * wave({ count: rings * 0.7 })(progress);
    return { ...squashed({ squash: crush })(1), rotation: sway };
  });
}
