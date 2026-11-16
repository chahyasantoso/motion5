/** Repeatable random numbers from 0 up to 1 for a seed, so a scattered scene is the same each run; use
 * it, never `Math.random()`. */
export function seeded(seed: number): () => number {
  let state = Math.floor(seed) | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
