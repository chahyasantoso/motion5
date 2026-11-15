/** How much of a swing is left when it shrinks to nothing: 1 at progress 0 down to 0 at 1, shaped by `power`. */
export function taper(progress: number, power: number): number {
  return (1 - progress) ** power;
}

/** How much of a swing is left when it dies away exponentially: 1 at progress 0, falling at `rate`. */
export function decay(progress: number, rate: number): number {
  return Math.exp(-rate * progress);
}

/** How much of a swing has built up when it rises exponentially: 0 at progress 0, approaching 1 at `rate`. */
export function attack(progress: number, rate: number): number {
  return 1 - Math.exp(-rate * progress);
}

/** How strong a swing is when it rises then falls: 0 at progress 0, 1 at the middle, 0 at 1. */
export function arch(progress: number): number {
  return Math.sin(Math.PI * progress);
}
