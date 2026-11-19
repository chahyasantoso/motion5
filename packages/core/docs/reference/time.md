# @gerak/core: time

Time is a number over a span; this group reads it, shapes it (loop, chain, reversed, repeated) and arranges phases or lanes into one timeline. Reach for it whenever a move starts late, repeats or follows another.

- **`UNTIMED`** `const UNTIMED: Clock`: The untimed clock: no ms at all, as under scroll or manual control.
- **`atProgress`** `(progress: number): Time`: A `Time` at `progress` with no clock, for code that drives a move by hand.
- **`elapsedOf`** `(clock: Clock): number | undefined`: The ms a clock has run, or `undefined` for a clock that has none.
- **`liveAt`** `(elapsed: number): Time`: A live `Time` `elapsed` ms after the page started; it has no length, so its progress stays 0.
- **`Clock`** `type Clock = { readonly kind: "timed"; readonly elapsed: number; readonly length: number; } | { readonly kind: "live"; readonly elapsed: number; } | { readonly kind: "untimed"; }`: A clock: ms of a known length when timed, ms with no end when live, none under scroll or manual control.
- **`Time`** `type Time = { progress: number; clock: Clock }`: Where a move is: `progress` from 0 to 1, and the clock behind it.
- **`Curve`** `type Curve<T> = (progress: number) => T`: A value from progress 0 to 1, built once from its settings.
- **`Signal`** `type Signal<T> = (time: Time, events: Events) => T`: A value at the scene's `time` and the `events` so far; a signal of `time` alone may ignore `events`.
- **`span`** `(fromMs: number, toMs: number): Span`: A stretch in ms: `.of(time, ease?)` is a move's time inside it, counting from `fromMs`; `.at(share)` the ms a share falls on. Throws `RangeError` on an untimed time.
- **`Span`** `type Span = { from: number; to: number; of: (time: Time, ease?: Ease) => Time; at: (share: number) => number }`: A stretch of the scene in ms: `of` gives a move's time inside it, `at` the ms a share of it falls on.
- **`motion`** `<T, C = unknown>(fn: (time: Time, context?: C) => T): Motion<T, C>`: Gives `fn` the timing methods; called with no span or period it answers as `fn` does.
- **`Motion`** `type Motion<T, C> = { (time: Time, context?: C): T; span: Span | undefined; period: number | undefined; joins: Joins; in: (span: Span) => Motion<T, C>; loop: (ms: number) => Motion<T, C>; take: () => Motion<T, C> }`: A function of time with timing attached: `in` plays it over a span, `loop` repeats it, `take` makes it replace.
- **`Timing`** `type Timing<A> = { of: (time: Time, ...args: A) => Time }`: A time helper built once from its settings: `of` answers a move's time inside it.
- **`loop`** `(periodMs: number, options?: LoopOptions): Timing`: A cycle repeating every `periodMs`: `.of(time)` is the time inside the current cycle, progress 0 to 1 each period, 1 to 0 on odd cycles with `yoyo`. Throws `RangeError` on an untimed time.
- **`LoopOptions`** `type LoopOptions = { yoyo?: boolean }`: Settings of `loop`: `yoyo` runs every odd cycle backwards, so the motion turns instead of jumping.
- **`chain`** `(lengths: readonly number[], options?: ChainOptions): readonly Span[]`: Spans of these lengths in ms, the first at 0, each starting where the last ends plus `gap` or minus `overlap`. Throws `RangeError` on a negative length, both options, or too long an overlap.
- **`ChainOptions`** `type ChainOptions = { gap?: number; overlap?: number }`: Settings of `chain`: `gap` ms of rest between spans, or `overlap` ms each starts before the last ends; not both.
- **`timeAt`** `(time: Time, ms: number): Time`: `time` moved to `ms` on its own clock, for reading a signal a moment earlier or later; untimed stays as it is.
- **`sequence`** `<R>(time: Time, phases: readonly Phase<R>[]): R`: Answers the last phase that started, given its own time: an ended phase holds its end, before the first the first holds its start. An empty list throws.
- **`Phase`** `type Phase<R> = readonly [Span, (time: Time) => R]`: One phase of a sequence: the span it runs in, and what it answers given its own time there.
- **`lanes`** `(lengths: readonly number[], stagger: number, options?: LanesOptions): Lanes`: Lanes of these relative lengths, each starting `stagger` after the last in the order `from` or `by` gives; `.of(time, index)` is lane `index` inside `time`, a timed clock split among lanes.
- **`LaneOrigin`** `type LaneOrigin = "start" | "end" | "center" | "edges" | { readonly seed: number; }`: Which lanes start first: from one end, from the centre out, from both edges in, or shuffled by a seed.
- **`Lanes`** `type Lanes = { lengths: readonly number[]; stagger: number; starts: readonly number[]; span: number; of: (time: Time, index: number) => Time }`: Lanes started `stagger` lane-lengths apart in the order `from` or `by` gives; `span` reaches the last finish; `.of(time, index)` is lane `index` run inside `time`.
- **`LanesOptions`** `type LanesOptions = { from?: LaneOrigin; by?: readonly number[]; spacing?: Ease }`: Settings of `lanes`: `from` or `by` picks which start first (default `"start"`); `spacing`, an ease, bends the start times (default even).
- **`reversed`** `(time: Time): Time`: A time run backwards (progress `p` answers `1 - p`); a function of time, not a move, so any move or value plays through it.
- **`repeated`** `(time: Time, count: number): Time`: A time with its progress running 0 to 1 `count` times (rounded down, at least 1); a function of time, not a move.
- **`withProgress`** `(time: Time, progress: number): Time`: `time` moved to `progress`: a timed clock's elapsed follows it, so a move that reads the clock is moved too.
