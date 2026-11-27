# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-27, Asia/Jakarta.
- **Read against:** `feat/foundation` (Slices 1–5 foundation consolidation over `main`).

## Now

- **A piece is a `scene(options, ...items)` of element bindings compiled with `compileScene`, split across thirteen packages in three enforced groups (`core`, `modules`, `library`), played by `mount` over `data-cast` nodes on a live, timed, or handed `Driver`.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`, `motion` ordering `.in()`/`.loop()` via a pipeline with `loopsForever`, `shared`), `RuntimeStore` (`createStore`, `withStore`, `withProbeStore`, `snapshot`, `restore`, `epochOf`) isolating cursors per player and isolating backward probes, bounded `RetentionPolicy` (`all`, `live` with monotonic `baseIndex` compaction and continuous channel baselines, `window` checkpoints) + synchronous `onEvent`, untimed-safe `keyframes`, `stillMoving()` on `trail`/`trailTurn`/`react`, `watchClock` + `watchInputs` (`scroll`, `pointer`, `events`), and stateless `seeded`/`state`/`scroll`/`pointer`/`transition`/`springTo`/`easeTo`;
  `@gerak/stage` owns pure per-scene element ownership inside `compileScene` (allowing sequential `shot()`s and independent scenes to reuse elements, honoring `shot` `length` and shifted `cues`), compiled member/part stack caching, per-member `InputNeed`, direct enumerable `Box.placement`, `box`/`shape`/`text`/`object` elements, `stagger`/`bind`/`bindEach`/`stayWith`/`carry`/`travel`/`slot3d`, `context.read`, and `frame`/`check`; `@gerak/player` (`play`, `Player` owning `RuntimeStore` + `snapshot`/`restore`, `Object.is` `subscribe` dedup, serial `on` notifications); `@gerak/dom` (modularized across `host`, `bind-dom`, `measure-dom`, `handoff`, `scheduler`, and `mount`, with default `"live"` retention `{ kind: "live", windowMs: Math.max(settleMs, 4000) }`, `onEvent`, 1/rAF `scroll`/`pointermove` coalescing, lazy `pointermove`, per-channel `InputNeed` frame routing, placement-aware `drawPaths`, root-scoped `BINDER_CASTS`, and Chromium compositor `ScrollTimeline`/trigger handoff); `@gerak/react` (`useSyncExternalStore`-based `useSignal`, wrapperless `useMount` + `<Stage>`, `usePlayer`, `useTarget`); and `@gerak/three` (`threeBinder` with full `Rest3d` capture/restore, shared-material isolation on `opacity`, dirty-gated `draw()`, `useTarget3d` list functions, and `createStage3d`).
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics`, `@gerak/rapier`) depend only on core (and paired core renderers); `@gerak/moves` adds plain moves, `squashed` couplings, `follow`, `react`, and stateless `noise1d`.
  `@gerak/tools` binds ephemeral port `0`, steps live mounts deterministically in held page tools via the host driver hook while keeping held-clock engine sync (ADR-196), shares one Vite server + Chromium browser in `gerak review <page>`, consolidates `gerak review <scene.ts>` to 3 passes under `withProbeStore`, deterministically hashes linked CSS/scripts/local imports/`.glb`/`.gltf` assets in `pageDigest` while excluding pure scene files, runs `talkPage` live with `"all"` retention, and removed retired `/__motion/source` and `/__motion/edit` endpoints.
  `@gerak/studio` source remains in place ahead of a revamp on this foundation (`packages/studio/test` was removed; studio contracts are unmaintained until its revamp).
  Decisions are ADR-170 to ADR-208; each package ships its docs and generated `packages/<package>/docs/reference` pages.

## Next in line

- **Studio revamp over the consolidated foundation:** rebuild `@gerak/studio` cards, drivers, and tests against the `RuntimeStore`, bounded live retention, modular `@gerak/dom`, and `@gerak/tools` changes.

## Open, and not scheduled

- Retargeting remains a proposed design only.
- React Three Fiber integration is deferred; `talk.html` is untried with a microphone.
- Browser tests run in Chromium only.
- `@gerak/studio` awaits a full revamp on top of the Slices 1–5 foundation refactor.

## Where the rest of it lives

- Exact commits, runs, decisions and evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier history remains in Git.
