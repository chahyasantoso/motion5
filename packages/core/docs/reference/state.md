# @gerak/core: state

State from events: a fold of the event log up to a time, and values that spring or ease when the state changes. Reach for it when motion answers hover, press, click or cues.

- **`rawTime`** `(time: Time): Time`: The time a `watchedTime` stands for, read without telling the watcher; any other time as it is.
- **`stillMoving`** `(): void`: Tells the watcher that a value is still on its way with the clock, such as a spring not yet at rest.
- **`watchClock`** `<T>(onUse: (use: ClockUse) => void, run: () => T): T`: Runs `run`, telling `onUse` each time what it works out can change with the clock alone.
- **`watchedTime`** `(time: Time): Time`: A time that tells the watcher `maybe` when its clock or progress is read; `rawTime` reads it untold.
- **`ClockUse`** `type ClockUse = "time" | "maybe"`: How a value can change with the clock alone: `time` while it is still on its way; `maybe` when code read the clock and nothing says whether it settles.
- **`state`** `<S>(start: S, rule: (current: S, event: MotionEvent) => S, options?: StateOptions): State<S>`: The state `rule` folds the events into, from `start`, up to the time asked. Pure in time and events: it folds only new events, and starts again when an earlier one differs or time goes back.
- **`State`** `type State<S> = { (time: Time, events: Events): S; start: S; steps: (time: Time, events: Events) => readonly Step<S>[] }`: What the scene is in at a time, given its events: a signal of that, with `start` and the `steps`.
- **`StateOptions`** `type StateOptions = { target?: string | readonly string[] }`: Settings of a `state`: `target`, the event target, or targets, whose events reach the rule.
- **`Step`** `type Step<S> = { at: number; value: S }`: The moment a state changed, and what it became.
- **`createStore`** `(): RuntimeStore`: Allocates a fresh store for an independent player or scene run.
- **`restore`** `(store: RuntimeStore, snap: RuntimeSnapshot): void`: Restores `store` to the state captured in `snap`.
- **`snapshot`** `(store: RuntimeStore): RuntimeSnapshot`: Captures every cell populated in `store` as an immutable snapshot.
- **`storeCell`** `<T>(): StoreCell<T>`: Declares an isolated cell backed per RuntimeStore without closure mutation.
- **`storeFor`** `(): RuntimeStore`: Returns the active RuntimeStore for this evaluation scope.
- **`withProbeStore`** `<T>(fn: () => T): T`: Runs an off-time probe in a transient copy-on-write store without mutating caller cursors.
- **`withStore`** `<T>(store: RuntimeStore, fn: () => T): T`: Runs `fn` with `store` bound as the active RuntimeStore.
- **`RuntimeSnapshot`** `type RuntimeSnapshot = { kind: "runtime-snapshot" }`: Immutable point-in-time capture of a RuntimeStore.
- **`RuntimeStore`** `type RuntimeStore = { kind: "runtime-store" }`: Per-player mutable store backing stateful core primitives.
- **`StoreCell`** `type StoreCell<T> = { get: (store?: RuntimeStore) => T | undefined; set: (value: T, store?: RuntimeStore) => void }`: Stateful cell descriptor isolated by active RuntimeStore.
- **`INPUT_EVENTS`** `const INPUT_EVENTS: Readonly<{ readonly scroll: "scroll"; readonly pointerX: "pointer-x"; readonly pointerY: "pointer-y"; }>`: Sample event names folded by `scroll` and `pointer`: `"scroll"`, `"pointer-x"` and `"pointer-y"`.
- **`pointer`** `const pointer: PointerState`: Viewport pointer state, built on `state`; `pointer.x` and `pointer.y` run 0 to 1, starting at 0.5.
- **`scroll`** `const scroll: ScrollState`: Page scroll state, built on `state`; `scroll.y` reads `"scroll"` sample events in px.
- **`PointerState`** `type PointerState = { x: State<number>; y: State<number> }`: Viewport pointer position from 0 to 1, folded from `"pointer-x"` and `"pointer-y"` sample events.
- **`ScrollState`** `type ScrollState = { y: State<number> }`: Vertical scroll position in px, folded from `"scroll"` sample events.
- **`springTo`** `<S>(source: State<S>, pick: (state: S) => number, options?: SpringToOptions): Signal<number>`: A spring towards the number `pick` reads from `state`, turning at each change from where it is and as fast as it goes, with no jump; without a clock, the latest goal.
- **`SpringToOptions`** `type SpringToOptions = { stiffness?: number; damping?: number; rest?: number }`: Settings of a `springTo`: `stiffness` (default 170), `damping` (26) and `rest` (0.001).
- **`easeTo`** `<S>(source: State<S>, pick: (state: S) => number, options: EaseToOptions): Signal<number>`: The number `pick` reads from `state`, easing at each change from where it is to the new number, `delayMs` later and over `ms`; without a clock, the latest number.
- **`EaseToOptions`** `type EaseToOptions = { ms: UpDown; delayMs?: UpDown; ease?: Ease }`: Settings of an `easeTo`: `ms`, `delayMs` (default 0) and `ease` (default linear).
- **`UpDown`** `type UpDown = number | { readonly up: number; readonly down: number; }`: A time in ms, or one for a change upwards and one for a change downwards.
- **`transition`** `<S>(source: State<S>, options: TransitionOptions<S>): Signal<Transition<S>> (+1 overloads)`: Eased transition progress across discrete changes of `source` (or `pick(source)`).
- **`Transition`** `type Transition<S> = { current: S; previous: S; progress: number; active: boolean }`: A discrete transition's current and prior value, eased progress (`0..1`), and active flag.
- **`TransitionOptions`** `type TransitionOptions<S> = { ms: number | ((from: S, to: S) => number); ease?: Ease | undefined }`: Settings of `transition`: duration in ms (or per `(from, to)`) and an optional easing curve.
