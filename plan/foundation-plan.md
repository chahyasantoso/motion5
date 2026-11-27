# Foundation: the app owns state, gerak owns motion

## Goal

People and agents build a page normally (React, or plain HTML and CSS) and use gerak only for its motion; a reel is
the same kind of page played on a timed clock and rendered to video. The app owns the rules and every state that
lasts, and tells gerak two things: values (how things are now) and triggers (something just happened that a motion
plays). A gerak scene only describes how things move, and never rebuilds the app's state.

The code gives the app one typed port, `set` and `trigger`, checked against a contract the piece declares; stops
gerak listening to the DOM for user interaction, with an opt-in adapter for hover, press, focus and the pointer;
gives each player its own cursors; and on a live page keeps each name's latest input plus the few seconds a running
motion still reads. A live page keeps flat memory and the same values for hours, through re-renders and remounts;
a reel gives the same frame at a time however that time is reached.

Scroll stays on gerak's side: it is a position the page reads, and the timeline plan (`plan/timeline-plan.md`,
after this one) makes it a timeline. Until then, `mount` keeps reading scroll once per frame as it does today.

Out of this plan: rewind (`"window"`), checkpoints, player snapshots, `onEvent` streaming, one 3D draw per frame
across mounts, ordering mounts that read each other's elements, and a separate input package. Studio has left the
repository (branch `studio/canvas-wip`, tag `studio-before-removal`).

Read `AGENTS.md` first. Every rule there applies.

## The boundary

| gerak (motion) | app (interaction, rules and state) |
| --- | --- |
| how elements move: beats, timelines, how motions relate | what a click, a key or a form does; every rule (capacity, what may happen when) |
| the clock, and reading the page's scroll position | listening to the DOM, or opting into the adapter |
| the input a running motion still reads, and the latest of each name | every state that lasts: what is in the jar, which flavour is chosen |

```ts
// contract.ts: declared once, read by the app and the scene
export const jar = inputs({
  values: { "jar-slot": { targets: ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"] }, "jar-sealed": {} },
  triggers: { "jar-add": {}, "jar-remove": {}, "jar-mix": {}, "jar-reset": {} },
});

// app: applies its rules, then tells gerak
mounted.trigger(jar, "jar-remove", 1);
mounted.set(jar, "jar-slot", 3, "slot-1");

// scene: reads, never folds the app's state
const sealed = value(jar, "jar-sealed");
const removes = triggers(jar, "jar-remove");
```

- A value is how something is now; the scene reads the latest, or the value as it was when a trigger arrived.
- A trigger is that something just happened; the scene reads each recent one's time and number while its motion
  plays.
- A piece declares a contract only when the app sends it input. A reel, a scroll page, and a page that only uses
  the adapter declare none.
- The proof is `apps/pieces/cookie`: its builder runs on this model, poses identical to the old fold at every
  sample, with every jar rule in the app and no motion bookkeeping in it.

## Invariants

Each has one owner and a test. I1 guards what reels already rely on and passes on `main`; the others fail on the
branch as it stands.

| # | Invariant | Owner | Test |
| --- | --- | --- | --- |
| I1 | On a timed or handed run, a scene's value at a time is the same whether reached by playing, by seeking forward or back, in a second player, or inside a probe. | `player` | `packages/player/test/timed-equivalence.test.ts`: frames rendered in order, in shuffled order and by two players match. |
| I2 | On a live clock, a scene's value is the same after `replace` as a fresh mount over the same retained input, and two mounts of one scene do not disturb each other. | `player` | `packages/dom/test/live-equivalence.test.ts` on a live mount with injected `now` and `frames`: six `set` slot values, `set` sealed, a `trigger` add, then 20 s of nothing, then `replace`, reads the same slots, the lid sealed, and no add motion playing. |
| I3 | `mount` attaches no DOM listener for user interaction. Its one listener is a passive `scroll` listener that wakes an idle clock. | `mount` | a browser test counts listeners on a mount with no adapter: one passive `scroll`, none for pointer, enter, leave, down, up, click, focus or blur |
| I4 | On a live clock gerak keeps each name and target's latest input and drops older input only past the window. On a timed or handed clock it drops nothing. | the input log, `liveClock` | `packages/core/test/retention.test.ts` |
| I5 | Retained input and work per frame do not grow with session length. | the input log, `dom` scheduler | soak test (Measure, below) |
| I6 | The live window is at least the longest time any move looks back: `max(settleMs, 4000)`. | `liveClock` | a `settleMs: 6000` live mount with injected `now` and `frames` keeps 6 s of input |
| I7 | No motion file in `dom` imports the adapter. | boundary scan | a new boundary-scan rule, with a fixture that breaks it |
| I8 | App input reaches a scene only through a declared contract: `set` takes only its values, `trigger` only its triggers, and only declared targets. | typecheck | `packages/core/test/inputs.types.test.ts` with `@ts-expect-error` on a typo, a trigger sent as a value, a value sent as a trigger, and an undeclared target; `MotionEvent`, `Events`, `eventLog`, `send` and `emit` are gone from every package's public exports |
| I9 | Mounts that share one `liveClock` see one time and one set of input: a `set` reaches all of them in the same frame, the clock asks for one frame per tick, and the window's scroll is read once per frame. | `liveClock` | `packages/dom/test/shared-clock.test.ts` with two section mounts on one clock |
| I10 | `valueAt(trigger)` reads the value as it was when the trigger arrived, by arrival order, even when a new value arrives in the same ms. | the input log | `packages/core/test/value-at.test.ts`: `trigger` then `set` at one ms reads the old value |

## Decisions

### 1. One typed port and a declared contract

- `inputs({ values?, triggers? })` declares a piece's names, their kind, and optional targets. It returns a typed
  description and nothing else: no validation rules, no value ranges.
- `set(contract, name, value, target?)` records a value; it records a change only when the number differs from the
  latest for that name and target. `trigger(contract, name, value?, target?)` records a trigger every time. Both
  live on `Mounted` and on every driver. A value is a number, as today.
- The app sends a trigger before the values it changes, and `valueAt(trigger)` reads by arrival order (I10).
- There is one way to send input. Raw string names and today's `send` go.

### 2. How a scene reads input

- `value(contract, name, target?)` is the value at a time and returns a `State`, so `changesOf` and `transition`
  take it. `valueAt(contract, name, trigger, target?)` is the value when a trigger arrived.
- `triggers(contract, name, target?)` is the triggers at or before a time that a motion can still read: on a live
  clock the window, on a timed clock all of them.
- `follow` springs towards a value; `react` plays on a trigger; `pointer.x`, `pointer.y` and `scroll.y` read the
  adapter's and the page's values.
- `state` and `tally` stay as folds, for timed scenes. On a live page a fold sees the latest input and the window,
  and the docs say so: state that lasts is the app's.
- `stage.md` gets one short section, after the scene basics: values, triggers, the contract, and the rule that the
  app owns lasting state.

### 3. gerak stops listening to the DOM

- `mount` deletes its pointer listeners, `watch: true` listening, lazy pointer attaching and pointer coalescing.
  `watch` is deleted from `box`, `text` and `shape`.
- `Driver` becomes `now()`, `input()`, `set()`, `trigger()` and `subscribe()`, all required. Every driver owns its
  input log: `liveClock`, `clockDriver` and `manualDriver`. `mounted.set` and `mounted.trigger` forward to the
  mount's driver.
- `watch` on `clockDriver` is deleted. `eventDriver` is replaced by `liveClock({ introMs?, settleMs? })`, a live
  clock with the port and no listening, for players outside `mount`. `useWatch` is deleted; `usePlayer` takes a
  `liveClock`, and `apps/pieces/card` exports `clock = () => liveClock(...)` and calls `listen` for its hover.
- The scroll position is read once per frame, as today, and recorded as a value on every clock, a handed one
  included.

### 4. The adapter is opt-in and outside the motion

- `packages/dom/src/adapter/` exports `listen(port, { elements?, pointer? })`, where `port` is a `Mounted` or a
  driver. It carries its own contract: for each element named it sets `hovered`, `pressed` and `focused` to 1 or 0
  with the element's name as the target, and with `pointer: true` it sets `pointer-x` and `pointer-y` once per
  frame, attaching the listener only then. It returns a function that detaches everything.
- `cookie`, `yuzu`, `yuzu-3d`, `card` and the browser tests that read the pointer or watched elements call it, and
  their scenes move from `enter`/`leave`/`down`/`up`/`click` to those values; a reel never does.

### 5. Retention: one rule, the log drops, the live clock decides the window

- The input log belongs to the driver. `clock: "live"` on `mount` builds a `liveClock`, and only a `liveClock` gives
  its log a window: `max(settleMs, 4000)`, no option; a page that needs more sets `settleMs`. A timed or handed
  clock keeps everything and forgets it when it loops or replays, as today.
- The log drops input older than the window unless it is the latest of its name and target, which stays as a real
  entry. A drop bumps `generation`, and readers refold the retained list. Drops run in batches, when the oldest
  droppable entry is older than twice the window.
- `RetentionPolicy`, the `retention` option, the baseline map, `baseIndex`, `compactedBefore`, the `initialOf`
  reseed, `CONTINUOUS_CHANNELS`, the step trimming in `state`, `changesOf` and `tally`, and the trimming in the
  player, the scheduler and the event driver are deleted.

### 5b. Several mounts share one clock

- A started `liveClock` can be handed to several mounts. They share its time, its input log and its frame requests,
  so the app sets a value once and every section sees it in the same frame.
- The clock reads the window's scroll once per frame while any of its mounts reads scroll. A mount with its own
  `scrollTarget` records that scroll with the mount's root as the target.
- React passes the clock through `useMount`'s options; the comparator compares it by identity.
- Each mount still has its own player and cursors.

### 6. One record per input list

- The side `WeakMap`s become one record per list: `version`, `generation`, serials. A plain array gets a default
  record, so every reader has one code path and the `taken` path in `state` is deleted.
- A plain array is read as unchanged while its identity is unchanged. A test that pushes into a list it reuses
  passes a new array instead.
- Every merged list goes through `derivedEvents`, renamed for input, which carries a record, so a handed driver
  does not refold every frame.
- Core exports what another package reads and nothing else. Check `docs/ADR-INDEX.md` before adding one.

### 7. Cursors per player, written through one helper

- `RuntimeStore` stays as internal plumbing: one per `Player`, and a copy-on-write overlay for probes. Its
  `snapshot` and `restore`, and `Player.snapshot` and `Player.restore`, are deleted.
- One `store.ts` helper hands a primitive a cell it may mutate. The six hand-written `ownerEpoch` copies in `state`,
  `changesOf`, `tally`, `springTo`, `easeTo` and `TriggerBeat` use it, and `epochOf` stops being exported.
- No primitive returns an array it mutates later. `changesOf` returns a list that never changes after it is returned.

### 8. Fixes

- `react`: `sameMountOptions` becomes a comparator table typed over every key of `StageMountOptions`, so a new
  mount option fails typecheck until it is compared. Comparison happens inside the effect; no ref is written during
  render.
- `three`: captured material state belongs to the mount that captured it, not to module-wide maps. `threeBinder`
  accepts a custom writer for a `parts: true` object list, so a piece sets a list member's look from its pose (the
  cookie app subscribes to `builderExitCookies` only for want of this; it moves to the writer).
- `stage`: the shot-events cache keys on `version` and `generation`.
- `tools`: `gerak review` reads a whole-number custom field (a flavour index) as a step, not as a jump past its
  ratio limit.
- `onEvent` is deleted from `eventLog`, `clockDriver` and `mount`.

### 9. Work already on the branch that stays as built

These pass the gates. They stay, each reviewed as its own slice rather than rebuilt: `three` rest and opacity,
`react` `useSignal` and `useMount`, `motion` call order, `keyframes` on untimed clocks, the `defineStage` and
`CastBuilder` deletion, the `mount.ts` split, the `tools` changes (port `0`, the shared review session, `pageDigest`,
the retired endpoints), and cookie's builder on values and triggers. The pointer and watched-element code the split
moved into `scheduler.ts` is deleted by Decision 3, not reviewed.

### 10. Records

- ADR-209 records the boundary: the app owns rules and lasting state, values and triggers through one typed port,
  the contract, the adapter, and gerak not listening to the DOM. It supersedes ADR-208's retention, store, snapshot
  and `onEvent` decisions; ADR-207's rule that a mount on a handed driver records the page's real input (scroll is
  still read there); ADR-181's `send`; and ADR-175's events on a clock.
- `core.md`, `stage.md`, `page.md` and the guide teach the model. The cues in `explainer` and `reel` become values
  and triggers at times.
- `docs/SESSION-STATUS.md` is rewritten for the merged state. This plan carries no status.

### 11. Target API

The tests of slice 2 are written against these signatures; later slices build them as written.

```ts
// @gerak/core
interface InputSpec { readonly targets?: readonly string[] }        // no targets: any target, or none
interface Contract<V extends Record<string, InputSpec>, T extends Record<string, InputSpec>> {
  readonly values: V; readonly triggers: T;
}
function inputs<const V, const T>(spec: { readonly values?: V; readonly triggers?: T }): Contract<V, T>;
type TargetOf<S> = S extends { targets: readonly (infer U extends string)[] } ? U : string;

interface InputEntry {                       // replaces MotionEvent; `serial` is arrival order in its log
  readonly kind: "value" | "trigger"; readonly name: string; readonly at: number;
  readonly value: number; readonly target?: string; readonly serial: number;
}
type Input = readonly InputEntry[];          // replaces Events
type Signal<T = Pose2d> = (time: Time, input: Input) => T;
interface Trigger { readonly at: number; readonly value: number; readonly target?: string; readonly serial: number }

function value(contract, name, target?): State<number>;            // 0 before any set
function valueAt(contract, name, trigger: Trigger, target?): Signal<number>;
function triggers(contract, name, target?): Signal<readonly Trigger[]>;  // arrival order, `at` <= now
const pageInputs: Contract<{ scroll: {}; "pointer-x": {}; "pointer-y": {};
  hovered: {}; pressed: {}; focused: {} }, {}>;                    // read by scroll.y, pointer.x, pointer.y

interface InputLog {
  set(at: number, contract, name, value: number, target?): void;   // records only a changed number
  trigger(at: number, contract, name, value?: number, target?): void;  // value defaults to 1
  readonly input: Input;
}
function inputLog(options?: { readonly windowMs?: number }): InputLog;  // no window: drops nothing

// @gerak/player
interface Driver {
  now(): Time; input(): Input; subscribe(listener: () => void): () => void;
  set(contract, name, value: number, target?): void;               // recorded at now()
  trigger(contract, name, value?: number, target?): void;
  readonly options?: object;
}
// manualDriver({ durationMs? }) implements all of Driver.

// @gerak/dom
interface LiveClock extends Driver { dispose(): void }
function liveClock(options?: { readonly introMs?: number; readonly settleMs?: number;
  readonly now?: () => number; readonly frames?: FrameSource }): LiveClock;   // window max(settleMs ?? 2000, 4000)
// mount(piece, { clock: "live", settleMs, now, frames }) builds a liveClock; a LiveClock is handed to
// one or more mounts as { kind: "driver", driver }. Mounted gains set and trigger, forwarding to
// mounted.driver, and loses send and events.
function listen(port: Pick<Driver, "set">, options: { readonly elements?: readonly string[];
  readonly pointer?: boolean }): () => void;                       // in packages/dom/src/adapter/
```

## Measure

- Soak, in `packages/dom/test/soak.test.ts` on a live mount with injected `now` and `frames`: three simulated
  hours of 60 Hz `pointer-x` and scroll values plus one jar trigger and its slot values a second. It gates on
  counters, not wall time:
  - retained input stays at or below twice the window times the input rate, since drops run in batches, plus one per name and target;
  - rule calls per frame, averaged over each drop, stay within the retained input count;
  - the jar the scene shows matches the jar the app holds.
- Tokens: one interactive brief, a small cart or quiz page whose own state drives motion, built by a Claude Sonnet
  subagent on `main`, on this branch, and as plain HTML and JS, each from a cold start with the same brief. The
  branch must cost no more tokens than `main` and beat the plain build; the counts go in the pull request.
- Reels: I1's shuffled-order render. No interaction: I3.

## Slices

One pull request for the plan. Each slice gets its own cold review. A slice that moves code changes no behaviour.

| Slice | Scope | Done when |
| --- | --- | --- |
| 1 | The cookie builder proof | Same poses at every sample; jar rules in the app; no motion bookkeeping in the app |
| 2 | Tests first: I1–I10 and the soak test, written against Decision 11 | I1 passes on `main`; the others fail on the branch for the reasons above, and only for those, and sit in `test/pending.json` under the slice that turns them green, which removes them |
| 3 | Decisions 6–7 (input-list record, store helper) | I1 green; existing tests green |
| 4 | Decisions 1, 2 and 5 (the port and contract, readers, retention) | I2, I4–I6, I10 and the soak test green |
| 5 | Decisions 3–4 and 5b (stop listening, `liveClock`, the adapter, the shared clock, pieces moved) | I3, I7, I8 and I9 green; every piece and browser test green |
| 6 | Decision 8 | Each fix has a test that failed before it |
| 7 | Decision 9 reviews, Decision 10 records, the token measure | Cold reviews done; tokens recorded; `check`, `test:browser` and `pack:check` green |
