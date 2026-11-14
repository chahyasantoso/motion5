/** The greatest value `(1 - p)^2 * (1 - (1 - p)^8)` takes, so the envelope below peaks at 1. */
const PEAK = 0.8 * 0.2 ** 0.25;

/** An oscillation of `count` cycles inside an envelope that rises fast to 1 and dies away; 0 at both ends. */
export function shaken(count: number, progress: number): number {
  const envelope = ((1 - progress) ** 2 * (1 - (1 - progress) ** 8)) / PEAK;
  return envelope * Math.sin(2 * Math.PI * count * progress);
}
