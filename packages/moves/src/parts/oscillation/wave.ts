/** How far along a sine swing is: the sine of `count` full cycles over progress 0 to 1, shifted by `phase` in turns. */
export function wave(progress: number, count: number, phase = 0): number {
  return Math.sin(2 * Math.PI * (count * progress + phase));
}
