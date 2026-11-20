# @gerak/core: envelope

An envelope is an amount over time: an arch up and down, an attack, a decay, a taper or a wave. Reach for it to fade a quantity in or out or to pulse it.

- **`wave`** `(options: { readonly count: number; readonly phase?: number; }): Curve`: A sine curve of `count` full cycles over progress 0 to 1, shifted by `phase` in turns.
- **`arch`** `(progress: number): number`: How strong a swing is when it rises then falls: 0 at progress 0, 1 at the middle, 0 at 1.
- **`attack`** `(options: { readonly rate: number; }): Curve`: A curve that builds up exponentially from 0 at progress 0, approaching 1 at `rate`.
- **`decay`** `(options: { readonly rate: number; }): Curve`: A curve that dies away exponentially from 1 at progress 0, falling at `rate`.
- **`taper`** `(options: { readonly power: number; }): Curve`: A curve that shrinks from 1 at progress 0 down to 0 at 1, shaped by `power`.
