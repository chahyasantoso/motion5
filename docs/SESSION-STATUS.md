# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-27, Asia/Jakarta.
- **Read against:** `feat/foundation` (Foundation plan merged state; ADR-209).

## Now

- **A piece is a `scene(options, ...items)` of element bindings compiled with `compileScene`, split across twelve packages in three enforced groups (`core`, `modules`, `library`), played by `mount` over `data-cast` nodes on a live, timed, or handed `Driver`.**
  `@gerak/core` owns fields, time (`span`, `chain`, `lanes`, `loop`, `sequence`, `repeated`, `reversed`, `timeAt`, `motion` ordering `.in()`/`.loop()` via a pipeline with `loopsForever`, `shared`), `RuntimeStore` (`createStore`, `withStore`, `withProbeStore`, `storeCell` with copy-on-write `own`, without `snapshot`/`restore`/`epochOf`) isolating cursors per player and isolating backward probes, typed `inputs`/`Contract`/`pageInputs` with single-record `inputLog` (batch-dropping past twice `windowMs` while keeping each name-and-target's latest, with `set`/`trigger`/`clear`) + `derivedInput` + `shiftedInput`, contract readers (`value`, `valueAt`, `triggers`, `Trigger`), untimed-safe `keyframes`, `stillMoving()` on `trail`/`trailTurn`/`react`, `watchClock` + `watchInputs` (`scroll`, `pointer`, `events`), and stateless `seeded`/`state`/`scroll`/`pointer`/`transition`/`springTo`/`easeTo`;
  `@gerak/stage` owns pure per-scene element ownership inside `compileScene` (allowing sequential `shot()`s and independent scenes to reuse elements, honoring `shot` `length` and shifted `cues`), compiled member/part stack caching, per-member `InputNeed`, direct enumerable `Box.placement`, `box`/`shape`/`text`/`object` elements (without `watch`), `stagger`/`bind`/`bindEach`/`stayWith`/`carry`/`travel`/`slot3d`, `context.read`, and `frame`/`check`; `@gerak/player` (`play`, `Player` owning `RuntimeStore`, `Object.is` `subscribe` dedup, serial `on` notifications, `Driver` with `input()`/`set()`/`trigger()`, `manualDriver` owning its `inputLog` without re-entrant `notify` double-stepping); `@gerak/dom` (modularized across `host`, `bind-dom`, `measure-dom`, `handoff`, `live-clock`, `scheduler`, `mount`, and opt-in `adapter/listen`, where `mount` attaches no user-interaction DOM listeners beyond a passive `scroll` listener, `listen(port, options)` opts into `hovered`/`pressed`/`focused` and rAF-coalesced `pointer-x`/`pointer-y` values guarded by `scripts/boundary-scan.mjs`, `liveClock`/`clockDriver`/`scrollDriver` own their `inputLog`s, `clock: "live"` builds a `liveClock`, shared `liveClock` across `{ kind: "driver", driver }` mounts shares one frame loop and scroll read, and Chromium compositor `ScrollTimeline`/trigger handoff runs alongside); `@gerak/react` (`useSyncExternalStore`-based `useSignal`, wrapperless `useMount` with typed option-table comparison in its effect + `<Stage>`, `usePlayer` taking `liveClock`, `useTarget`); and `@gerak/three` (`threeBinder` with full `Rest3d` capture/restore, per-binder material isolation on `opacity`, `parts: true` list `writers`, dirty-gated `draw()`, `useTarget3d` list functions, and `createStage3d`).
  Opt-in modules (`@gerak/rig`, `@gerak/rig-three`, `@gerak/physics`, `@gerak/rapier`) depend only on core (and paired core renderers); `@gerak/moves` adds plain moves, `squashed` couplings, `follow(State)`/`react(Signal<readonly Trigger[]>)`, and stateless `noise1d`.
  Pieces (`cookie`, `yuzu`, `yuzu-3d`, `card`, `explainer`, `reel`, `overlay3d`) declare typed contracts with `value`/`triggers` or `listen`; `test/pending.json` is empty (`PENDING_CEILING` 0).
  `@gerak/tools` binds ephemeral port `0`, steps live mounts deterministically in held page tools via the host driver hook while keeping held-clock engine sync (ADR-196), shares one Vite server + Chromium browser in `gerak review <page>`, consolidates `gerak review <scene.ts>` to 3 passes under `withProbeStore` with `.limits({ steps })` support, deterministically hashes linked CSS/scripts/local imports/`.glb`/`.gltf` assets in `pageDigest` while excluding pure scene files, runs `talkPage` live with typed `set`/`input()`, and removed retired `/__motion/source` and `/__motion/edit` endpoints.
  `@gerak/studio` has left the repository; its last state is the `studio/canvas-wip` branch and the `studio-before-removal` tag.
  Decisions are ADR-170 to ADR-209; each package ships its docs and generated `packages/<package>/docs/reference` pages teaching the app-owned state and typed input model.

## Next in line

- **Timeline plan (`plan/timeline-plan.md`):** unify clock, scroll, view, smooth, and triggered beats behind a `Timeline` port in `@gerak/core` and handable browser timelines.

## Open, and not scheduled

- Retargeting remains a proposed design only.
- React Three Fiber integration is deferred; `talk.html` is untried with a microphone.
- Browser tests run in Chromium only.
- Studio returns as its own project once the packages are published.

## Where the rest of it lives

- Exact commits, runs, decisions and evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier history remains in Git.
