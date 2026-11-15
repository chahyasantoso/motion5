const SAMPLES = 32;

type Sample = { readonly length: number; readonly segment: number; readonly t: number };

/** The length of a curve made of segments, and the segment and local t at a distance along it. */
export type ArcLength = {
  readonly total: number;
  readonly locate: (distance: number) => { readonly segment: number; readonly t: number };
};

function distanceBetween(a: readonly number[], b: readonly number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += ((b[i] ?? 0) - (a[i] ?? 0)) ** 2;
  return Math.sqrt(sum);
}

/** A sampled arc-length table over `segments` curves of any dimension, read back by distance. */
export function arcLength(
  segments: number,
  pointAt: (segment: number, t: number) => readonly number[],
): ArcLength {
  const table: Sample[] = [{ length: 0, segment: 0, t: 0 }];
  let length = 0;
  for (let segment = 0; segment < segments; segment += 1) {
    let last = pointAt(segment, 0);
    for (let i = 1; i <= SAMPLES; i += 1) {
      const t = i / SAMPLES;
      const next = pointAt(segment, t);
      length += distanceBetween(last, next);
      table.push({ length, segment, t });
      last = next;
    }
  }
  const total = length;
  const locate = (distance: number): { readonly segment: number; readonly t: number } => {
    const goal = Math.max(0, Math.min(total, distance));
    let low = 0;
    let high = table.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if ((table[mid]?.length ?? 0) <= goal) low = mid;
      else high = mid;
    }
    const from = table[low];
    const to = table[high];
    if (from === undefined || to === undefined) return { segment: 0, t: 0 };
    const span = to.length - from.length;
    const fraction = span > 0 ? (goal - from.length) / span : 0;
    const fromT = from.segment === to.segment ? from.t : 0;
    return { segment: to.segment, t: fromT + (to.t - fromT) * fraction };
  };
  return { total, locate };
}
