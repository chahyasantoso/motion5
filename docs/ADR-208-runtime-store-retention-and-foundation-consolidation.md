# ADR-208: Per-player runtime store, bounded live retention, and foundation consolidation

**Date:** 2026-11-27
**Status:** Accepted and built, 2026-11-27.

## Context

Every scene is a pure function of time and events, yet several parts of the runtime had accumulated shared module-level caches and unbounded histories:

1. Core stateful primitives (`state`, `scroll.y`, `pointer.x/y`, `changesOf`, `springTo`, `easeTo`, `transition`, `tally`, `shared`) and `TriggerBeat` stored cursor caches in per-closure `WeakMap`s or mutable bindings. Running two players concurrently on the same scene, taking snapshots for rewind, or probing an earlier timestamp (`speedOf`, `anticipation`, `arc`, `trail`, `stayWith`, compositor sampling, `review`) leaked or rewound forward cursors.
2. Live pages never bounded their `eventLog` or `measures` history, coalesced `scroll` and `pointermove` bursts per input event instead of per animation frame, attached `pointermove` unconditionally, and evaluated the entire engine on any input frame.
3. `@gerak/stage` tracked scene ownership in module-global `OWNERS` and `INCLUDED_IN` `WeakMap`s, rebuilt per-member/per-part motion stacks on every frame, stored `Box.placement` behind a non-enumerable `WeakMap`, and kept vestigial `defineStage`/`CastBuilder` code.
4. `@gerak/three` only captured element position at bind time (`Point3d`), failed to isolate shared Three.js materials or reset opacity cleanly on `Group`s and material arrays, and called `renderer.render()` even when 3D outputs had not changed.
5. `@gerak/react`'s `useSignal` polled asynchronously in `useEffect` and `<Stage>` wrapped children in an extra `<div>`.
6. `@gerak/dom`'s `mount.ts` had grown into one monolithic file, `drawPaths` dropped parent placement/SVG origin offsets, and `BINDER_CASTS` overwrote global state across roots.
7. `@gerak/tools` bound fixed port `5280` in `openSite`, held live pages in Playwright via a paused `FakeClock` instead of a handed driver (disabling compositor tracks during checks), opened multiple servers/browsers in `gerak review <page>`, ran 6 redundant evaluation passes in `gerak review <scene.ts>`, hashed only `<name>.html` + sibling `.css` in `pageDigest`, ran `talkPage` on a resetting `"timed"` clock, and retained retired `/__motion/source` and `/__motion/edit` Vite endpoints.

## Decision

- **Per-player `RuntimeStore` and `RetentionPolicy` (`@gerak/core`, `@gerak/player`, `@gerak/moves`):**
  - `RuntimeStore` (`createStore`, `storeFor`, `withStore`, `withProbeStore`, `snapshot`, `restore`, `epochOf`) isolates all stateful primitive cells per `Player` and isolates off-time backward probes in transient copy-on-write stores so caller cursors are never mutated.
  - `RetentionPolicy` (`"all" | "live" | "window"`) read via an exhaustive `switch` bounds event history: `"live"` (default on live mounts with `windowMs: Math.max(settleMs, 4000)`) compacts older entries via monotonic `baseIndex` offsets while preserving latest continuous channel baselines (`scroll`, `pointer-x`, `pointer-y`); `"window"` captures sparse periodic `RuntimeSnapshot` checkpoints for bounded rewind; `"all"` keeps complete history for timed runs and tools. `onEvent` streams recorded events synchronously.
  - `Motion` preserves call order across `.in()` and `.loop()`, `nowOf` honors overtime `clock.elapsed`, `keyframes` accepts `UNTIMED` clocks, `trail`/`trailTurn`/`react` signal `stillMoving()`, and `Player.subscribe` deduplicates unchanged values by `Object.is`.
- **Pure `@gerak/stage` ownership and compiled caching:**
  - Removed module-global `OWNERS`/`INCLUDED_IN` maps in favor of pure per-scene ownership checks inside `compileScene` (allowing sequential `shot()`s and independent scenes to reuse elements), honored `shot` `length` and shifted `cues`, kept `context.read(el, { time })` non-mutating, tracked per-member `InputNeed`, cached compiled member/part stacks, stored `Box.placement` as an enumerable field, and deleted `defineStage` and `CastBuilder`.
- **`@gerak/three` and `@gerak/react` fixes:**
  - `captureRest3d`/`restoreRest3d` preserve full `Rest3d` (`position`, `quaternion`, `scale`, `visible`, `order`, and cloned base materials) and handle `Group`s and material arrays; `threeBinder` skips `draw()` when 3D outputs are unchanged; `useTarget3d` supports `(index, count) => Pose3d` list functions.
  - `useSignal` uses `useSyncExternalStore`; `useMount(ref, scene, options)` mounts onto an existing ref with reactive option updates and zero wrapper DOM node, with `<Stage>` built on top.
- **Modular `@gerak/dom` mount:**
  - Split `mount.ts` into an acyclic DAG (`host.ts`, `bind-dom.ts`, `measure-dom.ts`, `handoff.ts`, `scheduler.ts`, `mount.ts`).
  - Default live retention `{ kind: "live", windowMs }`, bounded `measures` history, 1/rAF `scroll`/`pointermove` coalescing, lazy `pointermove` attachment, per-channel `InputNeed` frame routing, placement-aware `drawPaths`, and root-scoped `BINDER_CASTS` cleanup. `eventDriver` shares the same retention and coalescing core.
- **Unified `@gerak/tools`:**
  - `openSite` binds ephemeral port `0`; page tools drive `"live"` mounts via the `@gerak/dom/driver` host hook so compositor `ScrollTimeline`/trigger animations stay active; `reviewPage` shares one Vite server and one Chromium browser; `reviewSceneModule` isolates `movedUnderDriver` probes under `withProbeStore` and consolidates evaluation into 3 passes; `pageDigest` deterministically hashes linked CSS, bootstrap scripts, local imports, and `.glb`/`.gltf` assets while excluding the page's pure scene file; `talkPage` runs on `"live"` with `{ kind: "all" }` retention; `/__motion/source` and `/__motion/edit` were removed from `@gerak/tools/vite`.

## Rejected alternatives

- **Keeping mutable state inside signal closures:** Cannot isolate concurrent `Player` instances, rewind snapshots, or backward time probes without corrupting forward cursors.
- **Capping live logs by slicing arrays without `baseIndex`:** Breaks incremental `state` fold cursors (`index` / `generation`) unless every fold rescans from 0 on every compaction.
- **Hashing scene files or `mtimeMs` in `pageDigest`:** Hashing pure scene files invalidates `.measure.json` on every motion tweak and breaks headless review; hashing `mtimeMs` breaks deterministic CI/checkout verification.

## Consequences

- Always-on live interactive pages stay O(1) in event memory, measure history, pointer listeners, and engine evaluations per input frame.
- Concurrent `Player` runs, historical reads (`stayWith`, `trail`, `anticipation`, `arc`), compositor handoff, and Playwright page tools remain free of cursor corruption and port collisions.
- `packages/studio/src` was left untouched and `packages/studio/test` was removed ahead of a separate Studio revamp on top of the consolidated foundation.
