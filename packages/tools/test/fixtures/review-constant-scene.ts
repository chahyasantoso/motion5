import type { Time } from "@gerak/moves";

export const durationMs = 2000;

/** A step that costs the same at every ms. */
export const scene = (time: Time) => ({ ball: { x: time.progress * 100, y: 0 } });
