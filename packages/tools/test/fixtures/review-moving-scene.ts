import type { Time } from "@motion5/moves";

export const durationMs = 2000;

/** One target settles at 50% while another is still moving on the last frame. */
export const scene = (time: Time) => ({
  still: { x: 100 * Math.min(1, time.progress * 2) },
  drift: { y: 100 * time.progress },
});
