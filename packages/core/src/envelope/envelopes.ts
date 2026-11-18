import type { Curve } from "../time/shapes";

/** A curve that shrinks from 1 at progress 0 down to 0 at 1, shaped by `power`. */
export function taper(options: { readonly power: number }): Curve {
  const { power } = options;
  return (progress) => (1 - progress) ** power;
}

/** A curve that dies away exponentially from 1 at progress 0, falling at `rate`. */
export function decay(options: { readonly rate: number }): Curve {
  const { rate } = options;
  return (progress) => Math.exp(-rate * progress);
}

/** A curve that builds up exponentially from 0 at progress 0, approaching 1 at `rate`. */
export function attack(options: { readonly rate: number }): Curve {
  const { rate } = options;
  return (progress) => 1 - Math.exp(-rate * progress);
}

/** How strong a swing is when it rises then falls: 0 at progress 0, 1 at the middle, 0 at 1. */
export function arch(progress: number): number {
  return Math.sin(Math.PI * progress);
}
