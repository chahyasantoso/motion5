# Foundation consolidation and bounded live state

## Goal

People and agents building always-on web pages, interactive 3D scenes, React views, and rendered reels get flat O(1) memory and CPU on live pages, opt-in event recording and server streaming when needed, and predictable behavior across multiple mounts, shots, live edits, and browser checks — without changing how a scene is written. The code moves hidden closure caches into a per-player `RuntimeStore` with snapshot/restore support, bounds live event and layout history, deletes dead `defineStage` and `gerak live` remnants, modularizes `mount`, fixes 3D rest/opacity and React mount ergonomics, and unifies `tools` around handed drivers and shared browser sessions.

Status: Slices 1–5 implemented, 2026-11-27 (`feat/foundation`). Five slices in order. Studio source was left untouched and `packages/studio/test` was removed per user instruction ahead of a separate Studio revamp.

Read `AGENTS.md` first. Every rule there applies.

## Decisions

### 1. Per-player `RuntimeStore` and snapshot foundation

- `packages/core/src/state/store.ts` owns `RuntimeStore` (`createStore`, `withStore`, `withProbeStore`, `storeFor`, `snapshot`, `restore`).
- Stateful primitives (`state`, `scroll.y`, `pointer.x/y`, `changesOf`, `springTo`, `easeTo`, `transition`, `tally`, `shared`, `TriggerBeat`) hold zero mutable state in closures; each keys its immutable cell inside the active `RuntimeStore`.
- `play(scene, driver)` owns one `RuntimeStore` per `Player` and exposes `snapshot()` / `restore(snapshot)`.
- Backward/off-time probes (`speedOf`, `anticipation`, `arc`, `trail`, `stayWith`, `context.read(el, { time })`, compositor sampling, `movedUnderDriver`) run under `withProbeStore` so they never reset or overwrite live forward cursors.

### 2. Recording as a feature (`RetentionPolicy`, `onEvent`, input coalescing)

- Closed union `RetentionPolicy` read with an exhaustive `switch`:
  - `"all"`: full history from `t = 0` (`clock: "timed"`, handed drivers, `manualDriver`, `gerak review`/`sample`/`render`, bare `eventLog()`).
  - `"live"`: default for `mount(..., { clock: "live" })`; evicts events/steps/measures older than `now - windowMs` (default `Math.max(settleMs, 4000)`) via monotonic `baseIndex` compaction without bumping `generation`, preserving the latest sample per continuous channel (`scroll`, `pointer-x`, `pointer-y`) in `baselineOf`.
  - `"window"`: bounded rewind for games/replay; `Player` keeps `maxCheckpoints` periodic `(atMs, RuntimeSnapshot)` pairs (thinning 2× past cap) and compacts older events.
- `onEvent?: (event: MotionEvent) => void` on `EventLogOptions`, `EventDriverOptions`, and `MountOptions` streams every event synchronously for analytics/server replay.
- `state` drops duplicate `taken: MotionEvent[]` copying on `eventLog` inputs; `changesOf` drops duplicate `held.list`; `react()` binary-searches ordered logs and calls `stillMoving()`; `noise1d` uses stateless O(1) hashing.

### 3. Core time, player, and `motion` invariant fixes

- `Motion` preserves call order of `.in(window, ease)` and `.loop(ms)` via an ordered pipeline, exposing `loopsForever`; bounded loops inside finite windows settle cleanly.
- `nowOf` honors `clock.elapsed` during overtime (`progress === 1 && clock.elapsed > clock.length`), while keeping eased/reversed timed progress inside `[0, length]`.
- `keyframes` interpolates stops over `clamp(time.progress, 0, 1)` so it works on `UNTIMED` clocks (`ScrollBeat`) without throwing `RangeError`.
- `trail` and `trailTurn` call `stillMoving()` until spring rest; `Player.events()` caches merged cues+log with `derivedEvents`; `Player.on` announces live `eventLog` events on `clockDriver` and same-ms bursts via monotonic serial tracking; `Player.subscribe` skips unchanged values by `Object.is`.

### 4. `@gerak/stage` pure ownership, de-layering, and stack caching

- Delete module-global `OWNERS` and `INCLUDED_IN` `WeakMap`s; enforce single binding and single sub-scene inclusion per compiled `Scene`. Sequential `shot()`s can animate the same element, and `shot()` honors `length` and shifts shot-local `cues`.
- Historical `context.read(el, { time })` (e.g. `stayWith`) probes without mutating `env.moves`; `bindEach` memoizes `signal(index)` and `bind`/`bindEach` respect windowed `_time`; `shotEvents` requires `version !== undefined`; `ScrollBeat.moving` checks `stillMoving()`; `withMeta` preserves `.travel` for 3D `stagger`, `travel3d` wraps `watchClock`, `partCounts` counts 3D lists, `drawStrokes` keeps `ObjectRest`.
- Delete vestigial `defineStage`, `CastBuilder`, `each`, and `Modifiers.on`; compile `Scene` directly to `Stage`.
- Store `placement?: BoxPlacement` directly on `Box`; track per-element `InputNeed` (`scroll`, `pointer`, `events`); cache compiled element/part motion stacks on the compiled plan; hoist `carryFor` timestamp indexing once per frame.

### 5. `@gerak/three`, `@gerak/react`, `@gerak/dom`, and `@gerak/tools`

- `@gerak/three`: capture/restore full `Rest3d` (`position`, `quaternion`, `scale`, `visible`, base materials) per `Object3D`; fix `opacity` across `Group`s, `Material[]`, cloned shared materials, and rest reset; skip `renderer.render` when 3D outputs are unchanged; support stage `(index, count) => Pose3d` lists in `useTarget3d`.
- `@gerak/react`: rewrite `useSignal` on `useSyncExternalStore`; add `useMount(ref, scene, options)` with no wrapper `<div>` and reactive options; rebuild `<Stage>` on `useMount`.
- `@gerak/dom`: split `mount.ts` into `host.ts`, `bind-dom.ts`, `measure-dom.ts`, `handoff.ts`, `scheduler.ts`, and `mount.ts`; coalesce `scroll`/`pointer` to 1 sample per rAF; attach `pointermove` lazily; route input frames only to elements reading the changed channel; fix `drawPaths` page coords + `BoxPlacement`; scope `BINDER_CASTS` cleanup on thrown mounts; unify `eventDriver` onto the same retention/coalescing core.
- `@gerak/tools`: use `port: 0`; drive `"live"` page mounts in tools via `DRIVER_HOOK` with compositor `ScrollTimeline`/`TriggerRun` active; share one Vite + browser session across `gerak review <page>`; prune redundant passes in `gerak review <scene.ts>`; extend `pageDigest` to linked CSS, `-main.ts`, local imports, and `.glb`/`.gltf` metadata; mount `talkPage` live with `"all"` retention; delete retired `/__motion/source` and `/__motion/edit` endpoints.

## Slices

| PR | Scope | Decisions | Done when |
| --- | --- | --- | --- |
| 1 | `core`, `player`, `moves` | 1, 2, 3 | `RuntimeStore` + snapshots + `live`/`window`/`all` retention; 100k events stay O(1); `motion.in().loop()`, `keyframes` untimed, `player.on`, `stillMoving` on `trail`/`react` green |
| 2 | `stage` | 4 | Pure ownership across `replace`/`shot`; `stayWith` idle rAF gone; `bindEach` memoized; `defineStage` deleted; stack caching & `InputNeed` tracking green |
| 3 | `three`, `react` | 5 (`three`, `react`) | Full `Rest3d` & `opacity` fixed; idle 3D skips `render`; `useTarget3d` list fn works; `useSignal` synchronous; `useMount` & `<Stage>` green |
| 4 | `dom` | 2, 5 (`dom`) | `mount.ts` modularized; 1/rAF input coalescing & lazy `pointermove`; per-input element routing; `drawPaths` & `BINDER_CASTS` fixed |
| 5 | `tools`, docs, ADRs, skills | 5 (`tools`) | Handed driver in page tools; shared `gerak review <page>` session; `pageDigest` extended; retired vite live endpoints deleted; `check`, `test:browser`, `pack:check`, cold review green |
