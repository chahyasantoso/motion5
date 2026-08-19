# Session status

**Captured:** 2026-08-19, Asia/Jakarta  
**Branch verified:** `main` at `d292076`  
**Phase:** runtime mutation model, trigger drivers through `T5`, compiled Track ownership, edge identity, trigger progress ownership, teardown ownership, single-track mutation atomicity, user documentation, declared package entrypoints, the shipped Scheduler with the public port contracts, clock tick error attribution, time loop semantics, and the GSAP-backed scroll source producer seam have landed.

This document reports current implementation reality. Plans and audits describe intent unless this file says they landed.

## Shipped runtime work

- Runtime mutation model W1 through W5 is complete through PRs [#109](https://github.com/chahyasantoso/motion5/pull/109), [#110](https://github.com/chahyasantoso/motion5/pull/110), [#111](https://github.com/chahyasantoso/motion5/pull/111), [#112](https://github.com/chahyasantoso/motion5/pull/112), and [#113](https://github.com/chahyasantoso/motion5/pull/113).
- Trigger drivers through `T5` are complete. Runtime-created Motions use the same factory and construction path as authored Motions, and declared `time` and `scroll` triggers do not fall back to manual behavior.
- Compiled Track ownership option C landed through PR [#126](https://github.com/chahyasantoso/motion5/pull/126). `Engine` owns compiled Tracks and `Motion` resolves them by id at every point of use.
- Edge identity, ordering, and labels were separated through issue [#137](https://github.com/chahyasantoso/motion5/issues/137). Edge identity is length-prefixed and injective.
- Trigger progress range ownership landed through PR [#140](https://github.com/chahyasantoso/motion5/pull/140). Source adapters normalize physical noise; `Motion.#scheduleProgress` validates the trigger input range.
- Failed-build Motion disposal landed through PR [#142](https://github.com/chahyasantoso/motion5/pull/142), closing issue [#134](https://github.com/chahyasantoso/motion5/issues/134).
- Rollback error precedence landed through PR [#144](https://github.com/chahyasantoso/motion5/pull/144), closing issue [#133](https://github.com/chahyasantoso/motion5/issues/133).
- Engine teardown ownership landed through PR [#146](https://github.com/chahyasantoso/motion5/pull/146), closing issues [#143](https://github.com/chahyasantoso/motion5/issues/143) and [#145](https://github.com/chahyasantoso/motion5/issues/145). Failed loads release the project clock subscription, and a throwing trigger disposal no longer prevents Motion disposal or map cleanup.
- Single-track mutation atomicity landed through PR [#148](https://github.com/chahyasantoso/motion5/pull/148), closing issue [#147](https://github.com/chahyasantoso/motion5/issues/147). Motion track entries resolve and seed before commit.
- `Track.setProgress` calls the injected timeline before committing its own progress, so a throwing interpolator does not leave Track progress ahead of the timeline.
- Clock tick error attribution landed by closing issue [#154](https://github.com/chahyasantoso/motion5/issues/154). `GraphRuntime` advances the clock consumers and flushes the graph inside separate error boundaries: a consumer failure reports `clock-consumer-failure` with the tick it happened on, only a real `GraphRuntime.flush` failure reports `flush-failure`, and the flush still runs on a tick whose consumers threw. Multi-consumer failures keep every cause in the message. Still one clock subscription and one reporting path. ADR-039 records the split.
- Time loop semantics landed through PR [#162](https://github.com/chahyasantoso/motion5/pull/162), closing issue [#156](https://github.com/chahyasantoso/motion5/issues/156). `createLoopCycle` is the single owner of loop state, the cycle index, direction, and the completion latch; `createTimeDriver` keeps the emission channel and disposal and no longer counts elapsed time. `Motion` is unmodified and gained no trigger-kind branch. `repeat` counts the passes after the initial one, so `repeat: 0` is the previous single-pass driver value for value; `-1` is infinite; ping-pong is `{ repeat: -1, yoyo: true }` rather than a third field. `trigger-time-repeat-unsupported` is deleted in favor of `trigger-time-repeat-shape`, `trigger-time-yoyo-shape`, and `trigger-time-yoyo-requires-repeat`. ADR-040 records the arithmetic.
- The GSAP-backed scroll source producer seam landed, closing issue [#163](https://github.com/chahyasantoso/motion5/issues/163). `createGsapScrollSource(scrollTrigger, options)` in `@motion5/core/adapters` owns lazy first-subscriber creation, fan-out through a copied listener set, and kill-on-last-unsubscribe. The React demo now contributes only a thin `createWalkScrollSource()` binding with `gsap.registerPlugin(ScrollTrigger)` at the app layer. Cases `G-1` through `G-4` cover the producer behavior with a fake `GsapScrollTriggerLike`; `G-5` asserts no file under `packages/core/src` imports gsap.

## Documentation and package surface

- Consumer documentation lives under `docs/guide/` and names only declared package entrypoints.
- `@motion5/core` declares the root, adapters, browser clock, transform plugin, FK plugin, and test-fakes entrypoints. ADR-036 records the widening.
- The Scheduler port has a shipped implementation, and the port contracts are nameable. `createMicrotaskScheduler` is exported from the root entry and the adapters barrel, and `Clock`, `ClockTick`, `Scheduler`, `Cancel` and `EngineOptions` are exported as types. Landed through PR [#160](https://github.com/chahyasantoso/motion5/pull/160), closing issues [#155](https://github.com/chahyasantoso/motion5/issues/155) and [#158](https://github.com/chahyasantoso/motion5/issues/158). ADR-038 records the scheduling semantics.
- The `exports` map is unchanged by that slice. The scheduler is named from two declared paths rather than through a new subpath, which is the shape `createDefaultTriggerFactory` already uses.
- The React demo uses `TrackHandle` mutation, no longer calls the owner-based adoption wrappers, and now composes the shipped scheduler instead of the test fake. No consumer-facing document builds a runtime on `createFakeScheduler`.
- The T4/T5 plan and its corrections are present under `docs/archived/`. Earlier status text claiming the plan existed only on another branch is obsolete.
- The authored schema, the v4 migration guide, and `docs/guide/errors-and-diagnostics.md` describe the three loop rules rather than the deleted `trigger-time-repeat-unsupported`.
- The packages remain private at `0.0.0`; packaged-consumer verification and publication remain Phase 6 work.

## Accepted behavior, not remaining defects

`ProjectHandle.seek(nodeId, progress)` is leaf-level scrubbing. On a driver-backed Motion, the next driver emission overwrites that value. ADR-021 owns this boundary and the trigger parity evidence pins it. Do not gate `seek` behind the Motion-level external-signal capability.

The owner-based `adopt` and `destroyAdopted` wrappers remain available for compatibility, but current consumer code should use `addTrack` and `TrackHandle`. Add deprecation annotations before removing the wrappers in the planned Phase 6 breaking change.

A scheduled job that throws is reported once, after every job in the pass has run, and a lone failure is rethrown verbatim. With the default microtask host that report reaches the environment as an unhandled rejection rather than at a caller's own drain site. `onError` is the interception point. ADR-038 owns this and the getting-started guide states it.

A tick whose clock consumers failed still publishes a batch. Progress is whatever was last committed, so a stalled driver reads as a held frame rather than a dropped one. ADR-039 owns this and it is the reason a consumer failure no longer suppresses the flush.

A Motion is destroyed empty. `destroyMotion` refuses a Motion that still owns tracks, and looping does not change that: remove the tracks, then destroy the Motion, and the released driver leaves the clock fanout with it.

A looping Motion has no pause of its own. Playback belongs to `Motion`, so a paused Motion detaches from its port while loop time keeps running and resuming lands on wall-clock loop time. ADR-040 owns this.

## Known remaining scope

- **Loop follow-ups:** per-cycle easing, a repeat delay, a loop completion callback, and playback pause are out of scope for ADR-040. Each is a separate authored field with its own owner question, and none of them is needed to make a loop run.
- **Phase 6 packaging:** neither package is published. Publication, packed-package consumer verification, API reporting, performance gates, and removal of transitional compatibility wrappers remain separate packaging work.

## Evidence anchors

- Runtime mutation model: run [31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456), seven checks green.
- Trigger drivers: PR [#124](https://github.com/chahyasantoso/motion5/pull/124), run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864).
- Option C Track ownership: PR [#126](https://github.com/chahyasantoso/motion5/pull/126), run [32084286445](https://github.com/chahyasantoso/motion5/actions/runs/32084286445).
- Runtime Motion ordering: PR [#131](https://github.com/chahyasantoso/motion5/pull/131), run [32087189826](https://github.com/chahyasantoso/motion5/actions/runs/32087189826).
- Edge identity red evidence: run [32129021992](https://github.com/chahyasantoso/motion5/actions/runs/32129021992).
- Trigger progress range: PR [#140](https://github.com/chahyasantoso/motion5/pull/140), red run [32129333099](https://github.com/chahyasantoso/motion5/actions/runs/32129333099).
- Failed-build disposal: PR [#142](https://github.com/chahyasantoso/motion5/pull/142), green run [32139209239](https://github.com/chahyasantoso/motion5/actions/runs/32139209239).
- Rollback precedence: PR [#144](https://github.com/chahyasantoso/motion5/pull/144), red run [32142133852](https://github.com/chahyasantoso/motion5/actions/runs/32142133852).
- Engine teardown ownership: PR [#146](https://github.com/chahyasantoso/motion5/pull/146), green run [32145446610](https://github.com/chahyasantoso/motion5/actions/runs/32145446610).
- Single-track mutation atomicity: PR [#148](https://github.com/chahyasantoso/motion5/pull/148), red run [32148713472](https://github.com/chahyasantoso/motion5/actions/runs/32148713472).
- Shipped scheduler and public port contracts: PR [#160](https://github.com/chahyasantoso/motion5/pull/160), cases `K-1` through `K-10`. Failing-first is replayed by dispatching `Recovery audit` with `base` set to `main`, because both new test files assert against modules that already exist on the parent commit rather than importing the module they introduce.
- Clock tick error boundaries: cases `B-1` through `B-7` in `packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts`. Failing-first is replayed by dispatching `Recovery audit` with `base` set to `main`, because the tests and the behavior land as separate commits on the branch.
- Time loop semantics: PR [#162](https://github.com/chahyasantoso/motion5/pull/162), red run [32221562839](https://github.com/chahyasantoso/motion5/actions/runs/32221562839) archived at `logs/32221562839/`, reporting `20 failed | 497 passed` in `quality` with every failure assertion-level or a contract throw. Cases `L-1` through `L-21`. `L-1` passes on the parent by design: it is the byte-for-byte single-pass compatibility guard and is not claimed as red.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility flags, facades, or placeholder tests.
- No renderer, DOM, or GSAP imports in core.
- Every behavioral recovery slice starts with failing-first evidence on its parent and archives the failing run when the pipeline supports it.
- Docs, public types, tests, and status move together.
- A cited evidence case id names exactly one plain `it` declaration in the whole suite.
- A rollback runs inside the failure it is undoing and never reports ahead of the original rejection.
- A single-track mutation resolves and seeds before it commits.
- A tick failure is attributed to the owner that failed; clock consumer advancement and graph flushing are separate boundaries and neither cancels the other.
- A source guard anchors on the structure it polices, never on where Prettier chose to wrap a line.
- Pull request checks are not filtered in a way that skips integration bases.
- Avoid hand-padded Markdown tables in this file; `format:check` is a hard gate inside `quality`.
- Consumer-facing documents live under `docs/guide/` and name only symbols or subpaths declared by the package exports map.
- Frame pacing belongs to `Clock` and applying belongs to `Scheduler`; a host primitive is injected rather than referenced.
