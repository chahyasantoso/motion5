import type { Time } from "@gerak/moves";

export const durationMs = 2000;

/** One pose list jumps 400 units at 30%; a turn runs on until 90%, leaving 200 ms of rest. */
export const scene = (time: Time) => ({
  ball: { x: time.progress < 0.3 ? 0 : 400, rotationY: 90 * Math.min(1, time.progress / 0.9) },
  letters: [{ x: 0 }, { x: time.progress < 0.3 ? 0 : 400 }],
});
