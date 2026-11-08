/** Numbers from 0 up to 1 that look random but repeat for the same seed, so a scattered scene is the same each run. */
export function seeded(seed: number): () => number {
  let state = Math.floor(seed) | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
