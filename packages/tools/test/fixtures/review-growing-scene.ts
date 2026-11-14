import { elapsedOf, type Time } from "@gerak/moves";

export const durationMs = 2000;

/** A step that sums a sine for each ms already elapsed, so it costs more the later it is called. */
export const scene = (time: Time) => {
  const elapsed = Math.floor(elapsedOf(time.clock) ?? 0);
  let sum = 0;
  for (let ms = 0; ms < elapsed; ms += 1)
    for (let index = 0; index < 3000; index += 1) sum += Math.sin(ms + index);
  return { ball: { x: time.progress * 100, y: 0, sum: sum * 0 } };
};
