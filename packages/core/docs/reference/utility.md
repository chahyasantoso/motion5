# @gerak/core: utility

Small shared helpers: a seeded random, a clamp and an exhaustive-switch guard. Reach for them instead of writing your own.

- **`seeded`** `(seed: number): () => number`: Repeatable random numbers from 0 up to 1 for a seed, so a scattered scene is the same each run; use it, never `Math.random()`.
- **`unreachable`** `(value: never): never`: The sink of an exhaustive switch: a value TypeScript proves cannot arrive.
- **`clamp`** `(value: number, min: number, max: number): number`: `value` in `[min, max]`; `NaN` propagates.
