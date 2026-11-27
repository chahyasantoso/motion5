# ADR-209: App-owned state, typed input port, and opt-in DOM listening

**Date:** 2026-11-27
**Status:** Accepted and built, 2026-11-27.

## Context

Pages using gerak had no clean line between application logic and motion: `mount` attached pointer and focus listeners for `watch` elements and `pointermove`, `Mounted` exposed untyped string `send`/`events` alongside `clockDriver` and `eventDriver`, folds (`state`) were used to reconstruct app state from raw events, and `ADR-208` added `RetentionPolicy` (`"live" | "window" | "all"`), `RuntimeStore` `snapshot`/`restore`, `baseIndex` compaction, and `onEvent` streaming to support unbounded event histories and rewind.

Because lasting state belongs in the application (React state, plain DOM state, or domain rules) and motion only needs current values and recent triggers, keeping interaction listeners, untyped events, and rewind snapshots inside gerak complicated every layer and broke the rule of one owner per question.

## Decision

1. **The boundary.** The application owns interaction handling, domain rules, and all lasting state. gerak owns motion, the clock, reading page `scroll` once per frame, the latest value of each input name and target, and the recent trigger window that running motions still read. A scene only describes how things move and never reconstructs the application's lasting state.
2. **One typed port and a declared contract (`@gerak/core`, `@gerak/player`, `@gerak/dom`).**
   - `inputs({ values?, triggers? })` returns a typed `Contract<V, T>` declaring named `"value"` and `"trigger"` slots and optional `targets` lists (`TargetOf<S>`), with no runtime validation rules or ranges. `pageInputs` declares the built-in page values (`scroll`, `pointer-x`, `pointer-y`, `hovered`, `pressed`, `focused`).
   - `Driver` requires `now()`, `input()`, `set(contract, name, value, target?)`, `trigger(contract, name, value?, target?)`, and `subscribe(listener)`. `Mounted` forwards `set` and `trigger` to `mounted.driver`.
   - `set` records an `InputEntry` (`kind: "value"`) at the clock's time only when the finite number differs from the latest recorded for that `name` and `target`. `trigger` records an `InputEntry` (`kind: "trigger"`, defaulting `value` to `1`) on every call. Raw `MotionEvent`, `Events`, `eventLog`, `send`, and `emit` are removed from public exports.
3. **Scene readers (`@gerak/core`).**
   - `value(contract, name, target?)` returns a `State<number>` reading `"value"` entries (starting at `0`), accepted by `springTo`, `easeTo`, `transition`, and `@gerak/moves`'s `follow`.
   - `valueAt(contract, name, trigger, target?)` returns a `Signal<number>` reading the value held for `name` (and `target`) when `trigger` arrived, ordered by insertion `serial` (`inputSerialsOf`) even when a `set` shares the same millisecond as the trigger.
   - `triggers(contract, name, target?)` returns a `Signal<readonly Trigger[]>` of retained triggers with `at <= now` in arrival order, accepted by `@gerak/moves`'s `react`.
   - `state` and `tally` remain folds for timed scenes and cues; on a live clock, folds observe only the retained window and each name-and-target's latest entry.
4. **Input log window, driver ownership, and shared `liveClock`.**
   - Every driver (`liveClock`, `clockDriver`, `scrollDriver`, `manualDriver`) owns its own `inputLog({ windowMs? })` whose entries carry one `WeakMap`-backed record (`version`, `generation`, `serials`, `sourceStream`) shared with `derivedInput` and `shiftedInput`.
   - Without `windowMs` (timed and manual drivers), `inputLog` drops nothing and clears on replay or loop wrap. With `windowMs` (`liveClock` sets `Math.max(settleMs ?? 2000, 4000)`), `inputLog` keeps each `(name, target)` pair's latest entry regardless of age and drops older entries in batches once the oldest droppable entry is older than `2 * windowMs`, bumping `generation` so readers refold cleanly.
   - `liveClock({ introMs?, settleMs?, now?, frames? })` replaces `eventDriver` and `useWatch`. A started `liveClock` can be passed to multiple `{ kind: "driver", driver }` mounts so they share one clock, one `inputLog`, one `requestFrame` loop, and one window `scroll` read per frame (mounts with their own `scrollTarget` record scroll with their root as target), while each mount keeps its own `Player` and `RuntimeStore`.
   - `RuntimeStore` keeps per-player cells via `storeCell(...).own(...)` and `withProbeStore` copy-on-write isolation; `snapshot`, `restore`, `epochOf`, `RetentionPolicy`, `baseIndex`, and `onEvent` are deleted.
5. **Opt-in `listen` adapter and zero interaction listeners in `mount`.**
   - `mount` attaches no DOM listeners for user interaction beyond a single passive `scroll` listener to wake an idle clock; `watch` is removed from elements and `clockDriver`.
   - `packages/dom/src/adapter/` exports `listen(port, { elements?, pointer?, root?, frames?, viewport? })`, kept outside the motion engine by `scripts/boundary-scan.mjs`. It writes `pageInputs` `"hovered"`, `"pressed"`, and `"focused"` (`1` or `0` per named element) and rAF-coalesced `"pointer-x"` / `"pointer-y"` (`0..1`), returning a cleanup function.

## Supersessions

- **ADR-208 (in part):** supersedes `RetentionPolicy` (`"live" | "window" | "all"`), `baseIndex` compaction, `RuntimeStore`/`Player` `snapshot`/`restore`, `epochOf` export, `onEvent`, and `eventDriver`/mount pointer listeners.
- **ADR-207 (in part):** supersedes recording real pointer, watched-element, and `send` input on a mount given a handed driver (`scroll` is still read there); every driver owns its typed `inputLog`.
- **ADR-181 (in part):** supersedes `MountedStage.send`, `events()`, raw `MotionEvent` sample events, and `follow` reading `"value"` streams.
- **ADR-175 (in part):** supersedes events on a clock and `watch` listening on drivers.

## Rejected alternatives

- **Keeping `RetentionPolicy` and `snapshot`/`restore`:** maintained a second state-history model inside gerak for rewind and snapshot checkpoints that no player or live page needs once the app owns lasting state.
- **Allowing `mount` on a handed driver to merge DOM pointer/watch listeners:** duplicated driver input ownership and kept interaction listeners coupled into `mount`.
- **Untyped string names on `send`:** invited silent typos and blurred continuous state values with discrete triggers.

## Consequences

- `liveClock` keeps memory and per-frame work bounded across hours of continuous interaction while preserving current values and recent triggers across `replace` and shared mounts.
- Pages choose whether to call `listen`, bind React or DOM handlers to `mounted.set`/`mounted.trigger`, or pass timed `cues`, with compile-time checking against the piece's `Contract`.
- `Mounted` no longer exposes `send` or `events`; `useWatch` and `eventDriver` are removed.
