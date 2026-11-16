# @gerak/core: ease

Easing reshapes progress so motion accelerates or settles; spring and back are the eases with overshoot. Reach for it to give a move weight instead of a straight line.

- **`backEase`** `(options: { readonly amount: number; readonly direction: EaseDirection; }): (progress: number) => number`: A back curve that pulls back by `amount` before it goes (`"in"`), overshoots by it as it ends (`"out"`), or both (`"inOut"`); `amount: 0` is the cubic.
- **`ease`** `const ease: { linear, sineIn, sineOut, sineInOut, quadIn, quadOut, quadInOut, cubicIn, cubicOut, cubicInOut, quartIn, quartOut, quartInOut, expoIn, expoOut, expoInOut, backIn, backOut, backInOut, elasticOut, bounceOut, bounceIn }`: `linear`, `sine*`, `quad*`, `cubic*`, `quart*`, `expo*`, `back*` (`In`/`Out`/`InOut`), `elasticOut`, `bounceIn`, `bounceOut`. `In` starts slow, `Out` ends slow, `InOut` does both.
- **`springEase`** `(options: SpringOptions): (progress: number) => number`: A spring from 0 settling on 1, fitted to the span; lower `damping` rings more. Feed it to values, not to a move's progress.
- **`Ease`** `type Ease = (progress: number) => number`: A curve from progress 0 to 1 onto eased progress, 0 at 0 and 1 at 1; back and elastic overshoot.
- **`EaseDirection`** `type EaseDirection = "in" | "out" | "inOut"`: Which end of a curve is slow: `in` starts slow, `out` ends slow, `inOut` does both.
- **`spring`** `(offset: number, speed: number, seconds: number, options: SpringOptions): SpringState`: Where a spring is, `seconds` after it left `offset` from its goal at `speed`, and how fast it goes.
- **`SpringOptions`** `type SpringOptions = { stiffness: number; damping: number }`: A unit-mass spring: pull towards its goal per second squared, and drag on its speed per second.
- **`SpringState`** `type SpringState = { offset: number; speed: number }`: Where a spring is from its goal, and how fast it moves, in units and units a second.
- **`springMemory`** `(options: SpringOptions, rest: number): number`: Seconds until what a spring was doing shrinks below `rest` of its size, at half its decay rate to cover ringing.
