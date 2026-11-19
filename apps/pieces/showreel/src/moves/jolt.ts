import { attack, decay, taper, wave, type Pose2d, type Time } from "@gerak/core";

const fade = taper({ power: 2 });
const fall = decay({ rate: 3 });
const rise = attack({ rate: 25 });

/** Options of `jolt`. */
export interface JoltOptions {
  /** The most it moves up or down, in px. */
  readonly distance: number;
  /** Up-and-down cycles over the span; default 4. */
  readonly count?: number;
  /** Side-to-side shudder as a share of the distance; default 0.35. */
  readonly sideways?: number;
}

/** Jolts up and down from an impact, with a smaller side-to-side shudder, dying away. */
export function jolt(options: JoltOptions): (time: Time) => Pose2d {
  const { distance, count = 4, sideways = 0.35 } = options;
  return ({ progress: p }): Pose2d => {
    const envelope = fade(p) * fall(p) * rise(p);
    return {
      y: distance * envelope * wave({ count })(p),
      x: distance * sideways * envelope * wave({ count: count * 0.64 })(p),
    };
  };
}
