/**
 * Counter-based randomness: a value is a pure function of a seed and integer keys, never of call
 * order, so a simulated frame's corruption depends only on the seed and the frame index, and
 * replaying any frame alone gives the same value. The mixer is the 32-bit finaliser of MurmurHash3,
 * applied per key.
 */
function mix(state: number, key: number): number {
  let h = (state ^ Math.imul(key | 0, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

/** A uniform value in [0, 1) for `seed` and `keys`. */
export function uniformAt(seed: number, ...keys: readonly number[]): number {
  let state = mix(0x811c9dc5, seed);
  for (const key of keys) state = mix(state, key);
  return state / 2 ** 32;
}

/** A standard normal value for `seed` and `keys` (Box-Muller over two uniforms). */
export function gaussianAt(seed: number, ...keys: readonly number[]): number {
  const u = 1 - uniformAt(seed, ...keys, 0);
  const v = uniformAt(seed, ...keys, 1);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
