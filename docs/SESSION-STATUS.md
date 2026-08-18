# Session status

**Captured:** 2026-08-18, Asia/Jakarta  
**Branch:** `feat/adopt-motion-track`  
**Phase:** runtime mutation model (W1-W5) complete; trigger drivers (T3) complete; compiled Track ownership (option C) merged; trigger slice `T4` in review. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** land `T4`, then `T5` (removal of inert trigger semantics) as its own pull request.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`.

## Runtime mutation model

Stated in prose rather than a table. Hand-padded markdown tables are the repeated cause of `format:check` failures on this file, and `format:check` runs inside `quality` as a hard gate.

- W1, builder cache correctness (A3 cached failures, A5 owner-blind key): merged, [#109](https://github.com/chahyasantoso/motion5/pull/109).
- W2, transactional `adopt` and `destroyAdopted` (P1, A1): merged, [#110](https://github.com/chahyasantoso/motion5/pull/110).
- W3, freeze and validate adopted tracks (A2): merged, [#111](https://github.com/chahyasantoso/motion5/pull/111).
- W4, runtime `addMotion` and `destroyMotion` (P2): merged, [#112](https://github.com/chahyasantoso/motion5/pull/112).
- W5, unified store, capability handles, `replaceTrack` (P3): merged into this base, [#113](https://github.com/chahyasantoso/motion5/pull/113).

## Trigger drivers

`T0` through `T3` have landed. `T3` covered scroll and time trigger definitions, drivers, and the seam fixes for the root `T3` defects, in PR [#124](https://github.com/chahyasantoso/motion5/pull/124), 7/7 green on run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864).

The trigger-validation half of `T4` landed with ADR-028. What remained was creation and destruction ordering plus the parity evidence nobody had written.

## Compiled Track ownership (option C)

Merged into this base through PR [#126](https://github.com/chahyasantoso/motion5/pull/126), which absorbed the review follow-up PR [#130](https://github.com/chahyasantoso/motion5/pull/130).

`MotionTrackEntry` carries `{ id, duration? }`. `MotionOptions` requires `resolveTrack: (id) => Track | undefined`, and `Motion` calls it at every point of use rather than storing a compiled `Track`. `Engine`'s `tracks` map is the single owner, so the `addMotionTrack` and `replaceMotionTrack` hooks no longer resolve Tracks on `Motion`'s behalf.

This is the long-term fix deferred by section 8.1 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` and by ADR-029. The near-term option A fix stays in place with a narrowed job: `Motion.replaceTrack` still preserves the array index, stagger timing, and current progress, so ADR-029's guarantee is unchanged and separately evidenced.

Review of PR [#126](https://github.com/chahyasantoso/motion5/pull/126) amended one locked decision. `disposeTracks` now defaults to `false`, because option C hands Track lifetime to the resolver's caller and a `Motion` must not dispose a Track it merely resolved. `Engine` passes `false` explicitly, so production behavior is unchanged either way. The rationale is in ADR-031 under `Disposal ownership`, and the amendment is recorded in the option C corrections doc so no reader trusts an earlier claim that C1 through C10 all landed verbatim.

The rest of the review is on this base: one flat evidence id series with a gate that enforces it, one entry shape from both construction paths, the hook-ordering comments in `ProjectRuntime`, and a single definition of "semantic files" in `docs/PR-WORKFLOW.md`.

## T4 runtime Motion creation ordering

In review on branch `fix/t4-runtime-motion-creation-ordering`. The decision record is ADR-032.

`ProjectRuntime.addMotion` published a motion id before it knew the Motion could be built. The order is now validate, reject, reject, `createMotion`, `replaceGraph` inside a `try`, roll back through the `destroyMotion` hook on rejection, then commit. `engine.ts` is unchanged; its hooks were already correct. `packages/core/src/domain/motion.ts` is untouched, so ADR-031's source guard stays green without being edited.

Evidence is `packages/core/test/integration/t4-runtime-motion-parity.test.ts`. Cases `T-3` (the ghost definition and the compiled, unmounted Track it let through) and `T-6` (the rollback, proved by the factory's creation and dispose counters) are the red-before-green evidence. `T-1` compares whole emitted progress sequences between a runtime-created and an authored `time` Motion.

The executable contract is the T4/T5 trigger parity plan, which still lives on branch `docs/t4-t5-trigger-parity-plan` and needs to land separately. Its amendment record is `docs/IMPLEMENTATION-PLAN-t4-t5-trigger-parity-corrections.md`, added here rather than promised. Twelve corrections are recorded there; the load-bearing ones are that `T5`'s manual-port grep gate would have failed on green code, that `T4-6` cannot inject a graph builder through `Engine` and does not need to, and that evidence case ids now use a `T-` series so they stop colliding with the `T4-n` locked decision ids.

## Current architecture

The runtime has one graph, one live observation state, one topology coordinator, one publisher, one patch registry, one project-wide clock subscription, and one owner of compiled Tracks. Authored and runtime Tracks share one removable store. Track mutation uses frozen definitions and capability handles with monotonic ABA protection; replacement preserves node identity and does not emit terminal destruction patches. No object outside `Engine` holds a compiled `Track` reference, so a recompiled node cannot leave a consumer driving a disposed instance. A runtime Motion is built before it is committed, so no public surface can name a Motion that failed to build.

Trigger definitions are resolved through a seam layer that unifies scroll and time triggers with the manual trigger path. Drivers are injected at Composition time and cached per host, allowing clock-advanced and scroll-position-based motion pipelines to coexist.

## React consumer migration

`apps/react-demo/src/App.tsx` now uses `handle.addTrack(track, { motionId: "walk" })` and stores returned `TrackHandle`s for reverse-order removal. The deprecated owner-based `handle.adopt()` and `handle.destroyAdopted()` calls and the caller-invented owner ref are retired from the current consumer.

The migration landed on this branch in commit [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf741e).

## Evidence

- W1-W5 final runtime CI: [31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456), all seven checks green.
- W5 PR: [#113](https://github.com/chahyasantoso/motion5/pull/113).
- T3 trigger drivers: PR [#124](https://github.com/chahyasantoso/motion5/pull/124), CI run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864).
- Option C: PR [#126](https://github.com/chahyasantoso/motion5/pull/126), CI run [32084286445](https://github.com/chahyasantoso/motion5/actions/runs/32084286445). Unit evidence is `packages/core/test/unit/domain/motion-track-resolution.test.ts` cases C-5 and C-6; integration evidence is `packages/core/test/integration/option-c-track-resolution.test.ts`.
- Option C disposal ownership: `packages/core/test/unit/domain/motion-dispose-ownership.test.ts`, cases C-14 through C-16.
- Follow-up gates: PR [#130](https://github.com/chahyasantoso/motion5/pull/130). `packages/core/test/unit/scripts/evidence-case-ids.test.ts` for id uniqueness, `packages/core/test/unit/engine/motion-entry-shape.test.ts` for entry shape.
- Red evidence for option C is durable rather than claimed: `logs/32036837861/` and `logs/32036952950/` on `ci-logs` capture the four `TS2353` hits and the six runtime failures naming `Motion requires a resolveTrack function.`
- T4 ordering: `packages/core/test/integration/t4-runtime-motion-parity.test.ts`, cases `T-3` and `T-6`.

## Known remaining scope

- `T5`, removal of inert trigger semantics, is the last trigger slice. The structural work is already done: `default.ts` has no inert fallback left. What remains is the source guard, the retirement of the three tests asserting that all three trigger types share the manual signal path, and the documentation.
- Loop semantics stay undesigned until `T5` lands. `repeat`, `yoyo`, and ping-pong are a new plan, not an extension of the trigger plan.
- The deprecated owner-based adoption wrappers remain available for compatibility, but the current consumer no longer uses them.
- Still open from section 8 of the trigger-driver plan: the `edgeKey` separator collision (8.2), `seek` bypassing the Motion (8.3), and the `signal()` versus manual-port range disagreement (8.4). None are touched by option C or `T4`.
- Open from the PR [#126](https://github.com/chahyasantoso/motion5/pull/126) review, deliberately not folded into any slice: a `#setProgress` sweep throw on the clock path is still laundered into a `flush-failure` diagnostic by `GraphRuntime.#onTick`, which blames the flush rather than the missing Track. That is issue [#114](https://github.com/chahyasantoso/motion5/issues/114) section 3.3's third consequence, unchanged, and it needs its own issue.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- An evidence case id names exactly one test in the whole suite.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
- No hand-padded markdown tables in this file. `format:check` is a hard gate inside `quality`, and it runs before the write-enabled `format` job can repair anything.
