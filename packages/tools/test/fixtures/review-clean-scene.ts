import type { Time } from "@motion5/moves";

export const durationMs = 2000;

/** Slides and turns for half the run, then rests for a second. */
export const scene = (time: Time) => {
  const t = Math.min(1, time.progress * 2);
  return {
    ball: { x: 300 * t, y: 0, rotationY: 90 * t, scale: 1 },
    letters: [0, 1].map((index) => ({ x: index * 40 + 100 * t, opacity: t })),
  };
};
