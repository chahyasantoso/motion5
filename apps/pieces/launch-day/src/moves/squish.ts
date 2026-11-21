import { attack, decay, taper, wave, type Pose2d, motion, type Motion } from "@gerak/core";

const rise = attack({ rate: 60 });
const fall = decay({ rate: 4 });
const fade = taper({ power: 1 });

/** Options of `squish`. */
export interface SquishOptions {
  /** Height lost at the deepest squash, as a share. */
  readonly squash: number;
  /** How much it widens, as a share of the squash; default 0.7. */
  readonly bulge?: number;
  /** Swings between squash and stretch over the span; default 2. */
  readonly wobbles?: number;
}

/** Squashes against the floor on an impact and springs back through a few quick, dying wobbles of height and width. */
export function squish(options: SquishOptions): Motion<Pose2d> {
  const { squash, bulge = 0.7, wobbles = 2 } = options;
  return motion(({ progress: p }): Pose2d => {
    const envelope = rise(p) * fall(p) * fade(p);
    const h = squash * envelope * wave({ count: wobbles, phase: 0.25 })(p);
    return { scaleY: 1 - h, scaleX: 1 + bulge * h, anchor: "bottom" };
  });
}
