import { seeded } from "@gerak/core";

function hashSample(seed: number, index: number): number {
  return seeded(Math.imul(Math.floor(seed) | 0, 0x9e3779b1) ^ index)() * 2 - 1;
}

/** A smooth wandering value from -1 to 1 over time in ms, easing to a fresh seeded target every `scale` ms; the
 * same seed wanders the same. */
export function noise1d(seed: number, scale = 400): (ms: number) => number {
  return (ms) => {
    const cell = Math.floor(ms / scale);
    const t = ms / scale - cell;
    const blend = t * t * (3 - 2 * t);
    const from = hashSample(seed, cell);
    return from + (hashSample(seed, cell + 1) - from) * blend;
  };
}
