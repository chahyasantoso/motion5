/** An oscillation of `count` cycles whose amplitude rises fast and dies away; 0 at both ends. */
export function shaken(count: number, progress: number): number {
  const envelope = (1 - progress) ** 2 * (1 - (1 - progress) ** 8);
  return envelope * Math.sin(2 * Math.PI * count * progress) * 1.8;
}
