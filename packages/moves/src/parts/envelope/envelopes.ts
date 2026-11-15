import { definePart } from "../contract";

/** How much of a swing is left when it shrinks to nothing: 1 at progress 0 down to 0 at 1, shaped by `power`. */
export function taper(progress: number, power: number): number {
  return (1 - progress) ** power;
}
definePart(
  {
    kind: "envelope",
    samples: [0.5, 1, 2, 4].map((power) => ({
      run: (progress: number) => taper(progress, power),
      at0: 1,
      at1: 0,
    })),
  },
  taper,
);

/** How much of a swing is left when it dies away exponentially: 1 at progress 0, falling at `rate`. */
export function decay(progress: number, rate: number): number {
  return Math.exp(-rate * progress);
}
definePart(
  {
    kind: "envelope",
    samples: [0, 1, 4].map((rate) => ({
      run: (progress: number) => decay(progress, rate),
      at0: 1,
      at1: Math.exp(-rate),
    })),
  },
  decay,
);

/** How much of a swing has built up when it rises exponentially: 0 at progress 0, approaching 1 at `rate`. */
export function attack(progress: number, rate: number): number {
  return 1 - Math.exp(-rate * progress);
}
definePart(
  {
    kind: "envelope",
    samples: [0, 1, 4].map((rate) => ({
      run: (progress: number) => attack(progress, rate),
      at0: 0,
      at1: 1 - Math.exp(-rate),
    })),
  },
  attack,
);

/** How strong a swing is when it rises then falls: 0 at progress 0, 1 at the middle, 0 at 1. */
export function arch(progress: number): number {
  return Math.sin(Math.PI * progress);
}
definePart({ kind: "envelope", samples: [{ run: arch, at0: 0, at1: 0 }] }, arch);
