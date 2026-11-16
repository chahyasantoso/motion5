/** A microphone's level from its root-mean-square: 0 at or under the floor, rising with the gain, at most 1. */
export function levelOf(rms: number, floor = 0.02, gain = 6): number {
  if (!(rms > floor)) return 0;
  return Math.min(1, (rms - floor) * gain);
}
