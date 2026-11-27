# Foundation: the app sets state, gerak moves it

## Goal

People and agents build a page normally (React, or plain HTML and CSS) and use gerak only for its motion; a reel is
the same kind of page played on a timed clock and rendered to video. The app owns interaction and state, and tells
gerak how things are through one port, `set`; a gerak scene says only how things move when a value changes. An
opt-in adapter sets hover, press, focus and pointer values for apps that want it.

The code replaces events with values on every surface an app or an author touches, stops gerak listening to the DOM
for user interaction, gives each player its own cursors, and on a live page keeps each value's current state plus
the changes a running motion still reads. A live page keeps flat memory and the same values for hours, through
re-renders and remounts; a reel gives the same frame at a time however that time is reached.

Scroll stays on gerak's side: it is a position the page reads, and the timeline plan (`plan/timeline-plan.md`,
after this one) makes it a timeline. Until then, `mount` keeps reading scroll once per frame as it does today.

Out of this plan: rewind (`"window"`), checkpoints, player snapshots, `onEvent` streaming, one 3D draw per frame
across mounts, ordering mounts that read each other's elements, and a separate input package. Studio has left the
repository (branch `studio/canvas-wip`, tag `studio-before-removal`); it returns as its own project on `set` and
`listen`.

Read `AGENTS.md` first. Every rule there applies.

## The boundary

| gerak (motion) | app (interaction and state) |
| --- | --- |
| how an element moves when a value changes, beats, timelines, how motions relate | what a click, a key or a form does to state; routing |
| the clock, and reading the page's scroll position | listening to the DOM, or opting into the adapter |
| when each value changed, for as long as a motion reads it | every value: what is in the jar, which flavour is chosen, whether the CTA is hovered |

```ts
// app
mounted.set("slot-3", FLAVOR.choc);
mounted.set("hovered", 1, "cta");

// scene: when the value changes, move between its looks
const hover = transition(value("hovered", "cta"), { ms: 200 });
cta.moves((t, ctx) => lift(hover(t, ctx.values).progress));
```

- `set(name, value, target?)` is the one inbound port, on `Mounted` and on every driver. There is no `send`, and no
  event on any surface an app or an author writes. A value is a number, as today.
- `set` records a change only when the value differs from the latest for that name and target, so setting the same
  value twice plays nothing.
- The stored entry looks much like today's event: a name, a target, a number and a time. What changes is the
  contract. An entry says a value became this, the latest entry per name and target is the current state, and
  nothing public reports a happening, so a scene cannot count or interpret interaction.
- Inside, gerak records when each value changed, because a 200 ms motion needs its start. That record is internal,
  as a tween's start time is.
- Something momentary is a value too: the adapter sets `pressed` to 1 on press and 0 on release, so a bounce plays
  on the change.
- A reel writes its input the same way: `cues` become values at times, `{ name: "slot-3", value: choc, at: 2000 }`.

## Invariants

Each has one owner and a test. I1 guards what reels already rely on and passes on `main`; the others fail on the
branch as it stands.

| # | Invariant | Owner | Test |
| --- | --- | --- | --- |
| I1 | On a timed or handed run, a scene's value at a time is the same whether reached by playing, by seeking forward or back, in a second player, or inside a probe. | `player` | `packages/player/test/timed-equivalence.test.ts`: frames rendered in order, in shuffled order and by two players match. |
| I2 | On a live clock, a scene's value is the same after `replace` as a fresh mount over the same retained values, and two mounts of one scene do not disturb each other. | `player` | `packages/dom/test/live-equivalence.test.ts` on a live mount with injected `now` and `frames`: `set("x", 0.4)`, six `set("slot-n", flavour)`, `set("hovered", 1, "cta")`, then 20 s of nothing, then `replace`, reads `x: 0.4`, the six slots, and the CTA lifted. |
| I3 | `mount` attaches no DOM listener for user interaction. Its one listener is a passive `scroll` listener that wakes an idle clock. | `mount` | a browser test counts listeners on a mount with no adapter: one passive `scroll`, none for pointer, enter, leave, down, up, click, focus or blur |
| I4 | On a live clock gerak keeps each value's latest state and drops a change only when it is older than the window. On a timed or handed clock it drops nothing. | the value log, `liveClock` | `packages/core/test/retention.test.ts` |
| I5 | Retained changes and work per frame do not grow with session length. | the value log, `dom` scheduler | soak test (Measure, below) |
| I6 | The live window is at least the longest time any move looks back: `max(settleMs, 4000)`. | `liveClock` | a `settleMs: 6000` live mount with injected `now` and `frames` keeps 6 s of changes |
| I7 | No motion file in `dom` imports the adapter. | boundary scan | a new boundary-scan rule, with a fixture that breaks it |
| I8 | No exported name in `core`, `stage`, `player`, `dom` or `react` takes or returns an event. | typecheck | `MotionEvent`, `Events`, `eventLog`, `send` and `emit` are gone from every package's public exports; a test lists the exports |
| I9 | Mounts that share one `liveClock` see one time and one set of values: a `set` reaches all of them in the same frame, the clock asks for one frame per tick, and the window's scroll is read once per frame. | `liveClock` | `packages/dom/test/shared-clock.test.ts` with two section mounts on one clock |

## Decisions

### 1. Values replace events

- The value log replaces `eventLog`. Each entry is a change: a name, an optional target, the new value, and the ms
  it changed at. It is the only record of input, and it is internal to the runtime.
- A scene's second argument is `values`, read through `value(name, target?)` (the value at a time), `changesOf` and
  `transition`, which already exist and move from reading events to reading changes. `value` returns a `State`, so
  `changesOf` and `transition` take it directly.
- `follow` springs towards a value. `react` plays on a change. `pointer.x`, `pointer.y` and `scroll.y` read the
  `pointer-x`, `pointer-y` and `scroll` values.
- `state` and `tally` stay as folds over changes, for timed scenes. On a live page a fold sees the latest value
  and the window, and the docs say so: state that lasts is the app's.

### 2. The proof comes first

- Before anything else, `apps/pieces/cookie`'s builder section moves to values on a spike: `cookie-main.ts` holds
  the jar and sets each slot's flavour and the sealed flag; `builderState` stops folding the jar; `cookie-main.ts`
  stops asking gerak what is in the jar.
- It runs on today's runtime: the slot values go through today's `send`, whose entries already carry a name, a
  target and a number. It tests the authoring model before the runtime changes.
- It passes when a scripted session (add four cookies, remove one, seal) samples to the same poses as today and the
  builder scene and `cookie-main.ts` together are shorter than today. If it fails, the plan stops and comes back to
  the owner.

### 3. gerak stops listening to the DOM

- `mount` deletes its pointer listeners, `watch: true` listening, lazy pointer attaching and pointer coalescing.
  `watch` is deleted from `box`, `text` and `shape`.
- `Driver` becomes `now()`, `values()`, `set()` and `subscribe()`, all required. Every driver owns its value log:
  `liveClock`, `clockDriver` and `manualDriver`. `mounted.set` forwards to the mount's driver, so a handed driver
  and the shared clock of Decision 5b take values the same way.
- `watch` on `clockDriver` is deleted and its `send` becomes `set`. `eventDriver` is replaced by
  `liveClock({ introMs?, settleMs? })`: a live clock with `set` and no listening, for players outside `mount`.
  `useWatch` is deleted; `usePlayer` takes a `liveClock`, and `apps/pieces/card` exports
  `clock = () => liveClock(...)` and calls `listen` for its hover.
- The scroll position is read once per frame, as today, and recorded as a value on every clock, a handed one
  included: it is a position gerak reads, not input the app owns.

### 4. The adapter is opt-in and outside the motion

- `packages/dom/src/adapter/` exports `listen(port, { elements?, pointer? })`, where `port` is anything with `set`:
  a `Mounted` or a `liveClock`. For each element named it sets `hovered`, `pressed` and `focused` to 1 or 0, with
  the element's name as the target. With `pointer: true` it sets `pointer-x` and `pointer-y` once per frame,
  attaching the listener only then. It returns a function that detaches everything.
- The app decides whether to use it. `cookie`, `yuzu`, `yuzu-3d`, `card` and the browser tests that read the pointer
  or watched elements call it, and their scenes move from `enter`/`leave`/`down`/`up`/`click` to those values; a
  reel never does.

### 5. Retention: one rule, the log drops, the live clock decides the window

- The value log belongs to the driver (Decision 3). `clock: "live"` on `mount` builds a `liveClock`, so every live
  page has one, and only a `liveClock` gives its log a window: `max(settleMs, 4000)`. There is no option to set it; a page that
  needs more sets `settleMs`. A timed or handed clock keeps everything and forgets it when it loops or replays, as
  today.
- The log drops a change older than the window unless it is the latest of its name and target. A drop bumps
  `generation`, and readers refold the retained list. Drops run in batches, when the oldest droppable change is
  older than twice the window.
- `RetentionPolicy`, the `retention` option, the baseline map, `baseIndex`, `compactedBefore`, the `initialOf`
  reseed, `CONTINUOUS_CHANNELS`, the step trimming in `state`, `changesOf` and `tally`, and the trimming in the
  player, the scheduler and the event driver are deleted.

### 5b. Several mounts share one clock

- A started `liveClock` can be handed to several mounts: `const clock = liveClock(); mount(heroScene, { clock,
  root: heroEl }); mount(builderScene, { clock, root: builderEl })`. They share its time, its value log and its
  frame requests, so the app sets a value once and every section sees it in the same frame.
- The clock reads the window's scroll once per frame while any of its mounts reads scroll. A mount with its own
  `scrollTarget` records that scroll with the mount's root as the target.
- React passes the clock through `useMount`'s options; the comparator compares it by identity.
- Each mount still has its own player and cursors. Ordering mounts that read each other's elements, and one 3D draw
  per frame, wait for the section-players plan.

### 6. One record per value list

- The side `WeakMap`s become one record per list: `version`, `generation`, serials. A plain array gets a default
  record, so every reader has one code path and the `taken` path in `state` is deleted.
- A plain array is read as unchanged while its identity is unchanged. A test that pushes into a list it reuses
  passes a new array instead.
- Every merged list goes through `derivedEvents`, renamed for values, which carries a record, so a handed driver
  does not refold every frame.
- Core exports what another package reads and nothing else. Check `docs/ADR-INDEX.md` before adding one.

### 7. Cursors per player, written through one helper

- `RuntimeStore` stays as internal plumbing: one per `Player`, and a copy-on-write overlay for probes. Its
  `snapshot` and `restore`, and `Player.snapshot` and `Player.restore`, are deleted.
- One `store.ts` helper hands a primitive a cell it may mutate. The six hand-written `ownerEpoch` copies in `state`,
  `changesOf`, `tally`, `springTo`, `easeTo` and `TriggerBeat` use it, and `epochOf` stops being exported.
- No primitive returns an array it mutates later. `changesOf` returns a list that never changes after it is returned.

### 8. Fixes to work already on the branch

- `react`: `sameMountOptions` becomes a comparator table typed over every key of `StageMountOptions`, so a new
  mount option fails typecheck until it is compared. Comparison happens inside the effect; no ref is written during
  render.
- `three`: captured material state belongs to the mount that captured it, not to module-wide maps.
- `stage`: the shot-events cache keys on `version` and `generation`.
- `onEvent` is deleted from `eventLog`, `clockDriver` and `mount`.

### 9. Work already on the branch that stays as built

These pass the gates. They stay, each reviewed as its own slice rather than rebuilt: `three` rest and opacity,
`react` `useSignal` and `useMount`, `motion` call order, `keyframes` on untimed clocks, the `defineStage` and
`CastBuilder` deletion, the `mount.ts` split, and the `tools` changes (port `0`, the shared review session,
`pageDigest`, the retired endpoints). The pointer and watched-element code the split moved into `scheduler.ts` is
deleted by Decision 3, not reviewed.

### 10. Records

- ADR-209 records the boundary: values instead of events, the one `set` port, the app owning interaction and state,
  the adapter, and gerak not listening to the DOM. It supersedes ADR-208's retention, store, snapshot and `onEvent`
  decisions; ADR-207's rule that a mount on a handed driver records the page's real input (scroll is still read
  there); ADR-181's `send`; and ADR-175's events on a clock.
- `core.md`, `stage.md`, `page.md` and the guide teach values: the app sets, the scene moves on change. The cues in
  `explainer` and `reel` become values at times.
- `docs/SESSION-STATUS.md` is rewritten for the merged state. This plan carries no status.

## Measure

- Decision 2's proof: same poses, shorter code.
- Soak, in `packages/dom/test/soak.test.ts` on a live mount with injected `now` and `frames`: three simulated
  hours of 60 Hz `pointer-x` and scroll values plus one slot change a second.
- It gates on counters, not wall time. It passes when:
  - retained changes stay at or below the window times the change rate, plus one per name and target;
  - rule calls per frame, averaged over each drop, stay within the retained change count;
  - the jar the scene shows matches the jar the app holds.
- Wall time per frame is reported but does not gate.
- Reels: I1's shuffled-order render. No interaction: I3. No events anywhere public: I8.

## Slices

One pull request for the plan. Each slice gets its own cold review. A slice that moves code changes no behaviour.

| Slice | Scope | Done when |
| --- | --- | --- |
| 1 | Decision 2: the cookie builder proof | Same poses, shorter code; otherwise stop and report |
| 2 | Tests first: I1–I9 and the soak test | I1 passes on `main`; the others fail on the branch for the reasons above, and only for those |
| 3 | Decisions 6–7 (value-list record, store helper) | I1 green; existing tests green |
| 4 | Decisions 1 and 5 (values replace events, retention, `set`) | I2, I4–I6, I8 and the soak test green |
| 5 | Decisions 3–4 and 5b (stop listening, `liveClock`, the adapter, the shared clock, pieces moved) | I3, I7 and I9 green; every piece and browser test green |
| 6 | Decision 8 | Each fix has a test that failed before it |
| 7 | Decision 9 reviews, Decision 10 records | Cold reviews done; `check`, `test:browser` and `pack:check` green |
