import { definePart } from "../contract";
import { seeded } from "../utility/random";

/** A smooth wandering value from -1 to 1 over time in ms, easing to a fresh seeded target every `scale` ms; the
 * same seed wanders the same. */
export function noise1d(seed: number, scale = 400): (ms: number) => number {
  const cache = new Map<number, number>();
  const at = (index: number): number => {
    const known = cache.get(index);
    if (known !== undefined) return known;
    const value = seeded(Math.imul(Math.floor(seed) | 0, 0x9e3779b1) ^ index)() * 2 - 1;
    cache.set(index, value);
    return value;
  };
  return (ms) => {
    const cell = Math.floor(ms / scale);
    const t = ms / scale - cell;
    const blend = t * t * (3 - 2 * t);
    const from = at(cell);
    return from + (at(cell + 1) - from) * blend;
  };
}
definePart({ kind: "signal" }, noise1d);
