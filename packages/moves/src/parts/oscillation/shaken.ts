/** The greatest value `(1 - p)^2 * (1 - (1 - p)^8)` takes, so the envelope below peaks at 1. */
const PEAK = 0.8 * 0.2 ** 0.25;

/** Settings of `shaken`. */
export interface ShakenOptions {
  /** Cycles over the whole progress; required. */
  readonly count: number;
}

/** An oscillation of `count` cycles inside an envelope that rises fast to 1 and dies away; 0 at both ends. */
export function shaken(options: ShakenOptions): (progress: number) => number {
  const { count } = options;
  return (progress) => {
    const envelope = ((1 - progress) ** 2 * (1 - (1 - progress) ** 8)) / PEAK;
    return envelope * Math.sin(2 * Math.PI * count * progress);
  };
}
