# @gerak/core: envelope

An envelope is an amount over time: an arch up and down, an attack, a decay, a taper or a wave. Reach for it to fade a quantity in or out or to pulse it.

- **`wave`** `(progress: number, count: number, phase?: number): number`: How far along a sine swing is: the sine of `count` full cycles over progress 0 to 1, shifted by `phase` in turns.
- **`arch`** `(progress: number): number`: How strong a swing is when it rises then falls: 0 at progress 0, 1 at the middle, 0 at 1.
- **`attack`** `(progress: number, rate: number): number`: How much of a swing has built up when it rises exponentially: 0 at progress 0, approaching 1 at `rate`.
- **`decay`** `(progress: number, rate: number): number`: How much of a swing is left when it dies away exponentially: 1 at progress 0, falling at `rate`.
- **`taper`** `(progress: number, power: number): number`: How much of a swing is left when it shrinks to nothing: 1 at progress 0 down to 0 at 1, shaped by `power`.
