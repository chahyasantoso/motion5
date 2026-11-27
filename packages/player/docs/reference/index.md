# @gerak/player: index

- **`manualDriver`** `(options?: { readonly durationMs?: number; }): ManualDriver`: A driver moved by hand: `.seek(progress)`, `.seekMs(ms)`. Timed when given `durationMs`, untimed otherwise.
- **`play`** `<T extends object>(scene: Signal<T>, driver: Driver, options?: PlayOptions): Player<T>`: Runs `scene` against `driver`, telling each target's subscribers its value on every step.
- **`Driver`** `type Driver = { now: () => Time; events?: () => Input; subscribe: (listener: () => void) => () => void; options?: object }`: What drives a scene: the time now, the input so far when it watches any, and a signal each time it moves.
- **`ManualDriver`** `type ManualDriver = { seek: (progress: number) => void; seekMs: (ms: number) => void; now: () => Time; events?: () => Input; subscribe: (listener: () => void) => () => void; options?: object }`: A driver moved by hand, timed when it knows its length in ms.
- **`Player`** `type Player<T> = { time: Time; values: T; subscribe: <K extends keyof T>(target: K, listener: (value: T[K]) => void) => () => void; observe: <V>(signal: Signal<V>, listener: (value: V) => void) => () => void; refresh: () => void; replace: (next: Signal<T>, cues?: Input) => void; on: (name: string, listener: (event: InputEntry) => void) => () => void; dispose: () => void }`: A scene's values by target, rerun whole on each step of its driver.
- **`PlayOptions`** `type PlayOptions = { cues?: Input }`: Options of `play`: `cues`.
