import { type Pose2d, type Time } from "@gerak/core";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));
const inOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/** Options of `dash`. */
export interface DashOptions {
  /** The box's full length along its axis, in px; the tail travels it. */
  readonly length: number;
  /** The end the head runs out from; default bottom, a trail going up. */
  readonly from?: "bottom" | "top" | "left" | "right";
  /** Share of the span at which the head reaches the far end; default 0.5. */
  readonly arrive?: number;
  /** Share of the span before the tail starts to follow; default 0.2. */
  readonly lag?: number;
}

/** A straight box drawn as a moving stretch of itself: the head runs out from one end, the tail follows and catches it, leaving nothing. */
export function dash(options: DashOptions): (time: Time) => Pose2d {
  const { length, from = "bottom", arrive = 0.5, lag = 0.2 } = options;
  return ({ progress }): Pose2d => {
    const head = 1 - (1 - clamp01(progress / arrive)) ** 2;
    const tail = inOut(clamp01((progress - lag) / (1 - lag)));
    const shown = Math.max(0, head - tail);
    switch (from) {
      case "bottom":
        return { scaleY: shown, y: -length * tail, anchor: "bottom" };
      case "top":
        return { scaleY: shown, y: length * tail, anchor: "top" };
      case "left":
        return { scaleX: shown, x: length * tail, anchor: "left" };
      case "right":
        return { scaleX: shown, x: -length * tail, anchor: "right" };
      default: {
        const none: never = from;
        return none;
      }
    }
  };
}
