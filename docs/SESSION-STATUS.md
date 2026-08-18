# Session status

**Captured:** 2026-08-18, Asia/Jakarta  
**Branch:** `feat/adopt-motion-track`  
**Phase:** runtime mutation model (W1-W5) complete; trigger drivers complete through `T4`; compiled Track ownership (option C) merged; trigger slice `T5` in review; the `edgeKey` separator collision fix in review. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** land `T5` and the edge identity fix, then land the T4/T5 parity plan document from its own branch so the tree stops carrying an amendment to a plan it does not hold.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`.

## Runtime mutation model

Stated in prose rather than a table. Hand-padded markdown tables are the repeated cause of `format:check` failures on this file, and `format:check` runs inside `quality` as a hard gate.

- W1, builder cache correctness (A3 cached failures, A5 owner-blind key): merged, [#109](https://github.com/chahyasantoso/motion5/pull/109).
- W2, transactional `adopt` and `destroyAdopted` (P1, A1): merged, [#110](https://github.com/chahyasantoso/motion5/pull/110).
- W3, freeze and validate adopted tracks (A2): merged, [#111](https://github.com/chahyasantoso/motion5/pull/111).
- W4, runtime `addMotion` and `destroyMotion` (P2): merged, [#112](https://github.com/chahyasantoso/motion5/pull/112).
- W5, unified store, capability handles, `replaceTrack` (P3): merged into this base, [#113](https://github.com/chahyasantoso/motion5/pull/113).

## Trigger drivers

`T0` through `T4` have landed. `T3` covered scroll and time trigger definitions, drivers, and the seam fixes for the root `T3` defects, in PR [#124](https://github.com/chahyasantoso/motion5/pull/124), 7/7 green on run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864).

The trigger-validation half of `T4` landed with ADR-028, and the creation-ordering half landed with ADR-032. `T5` is the last slice.

## Compiled Track ownership (option C)

Merged into this base through PR [#126](https://github.com/chahyasantoso/motion5/pull/126), which absorbed the review follow-up PR [#130](https://github.com/chahyasantoso/motion5/pull/130).

`MotionTrackEntry` carries `{ id, duration? }`. `MotionOptions` requires `resolveTrack: (id) => Track | undefined`, and `Motion` calls it at every point of use rather than storing a compiled `Track`. `Engine`'s `tracks` map is the single owner, so the `addMotionTrack` and `replaceMotionTrack` hooks no longer resolve Tracks on `Motion`'s behalf.

This is the long-term fix deferred by section 8.1 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` and by ADR-029. The near-term option A fix stays in place with a narrowed job: `Motion.replaceTrack` still preserves the array index, stagger timing, and current progress, so ADR-029's guarantee is unchanged and separately evidenced.

Review of PR [#126](https://github.com/chahyasantoso/motion5/pull/126) amended one locked decision. `disposeTracks` now defaults to `false`, because option C hands Track lifetime to the resolver's caller and a `Motion` must not dispose a Track it merely resolved. `Engine` passes `false` explicitly, so production behavior is unchanged either way. The rationale is in ADR-031 under `Disposal ownership`, and the amendment is recorded in the option C corrections doc so no reader trusts an earlier claim that C1 through C10 all landed verbatim.

The rest of the review is on this base: one flat evidence id series with a gate that enforces it, one entry shape from both construction paths, the hook-ordering comments in `ProjectRuntime`, and a single definition of "semantic files" in `docs/PR-WORKFLOW.md`.

## T4 runtime Motion creation ordering

Merged through PR [#131](https://github.com/chahyasantoso/motion5/pull/131), 7/7 green on run [32087189826](https://github.com/chahyasantoso/motion5/actions/runs/32087189826), including the write-enabled `format` job, which found no drift. The decision record is ADR-032.

`ProjectRuntime.addMotion` published a motion id before it knew the Motion could be built. The order is now validate, reject, reject, `createMotion`, `replaceGraph` inside a `try`, roll back through the `destroyMotion` hook on rejection, then commit. `engine.ts` is unchanged; its hooks were already correct. `packages/core/src/domain/motion.ts` is untouched, so ADR-031's source guard stays green without being edited.

Evidence is `packages/core/test/integration/t4-runtime-motion-parity.test.ts`. Cases `T-3` (the ghost definition and the compiled, unmounted Track it let through) and `T-6` (the rollback, proved by the factory's creation and dispose counters) are the red-before-green evidence. `T-1` compares whole emitted progress sequences between a runtime-created and an authored `time` Motion.

That red is executed and archived rather than derived. All three original commits were pushed together, so the test-only commit `44a2296` never had a run of its own; branch `test/t4-red-evidence` and PR [#132](https://github.com/chahyasantoso/motion5/pull/132) apply the suite alone to the unmodified parent `a57634f` to close that gap. Run [32096251602](https://github.com/chahyasantoso/motion5/actions/runs/32096251602), archived at `logs/32096251602/`, reports `2 failed | 442 passed` with the two being exactly `T-3` and `T-6`, which also confirms the five guards are green on the parent. That branch is not for merge and should be closed now that this slice has landed.

Two defects were filed rather than folded in: issue [#133](https://github.com/chahyasantoso/motion5/issues/133), a rollback failure can outrank the failure that triggered it, in both `addMotion` and `#addTrack`; and issue [#134](https://github.com/chahyasantoso/motion5/issues/134), `buildMotion`'s `catch` releases the trigger but never disposes the Motion.

## T5 removal of inert trigger semantics

In review on branch `test/t5-no-manual-trigger-fallback`. The decision record is ADR-033.

The structural work was already done before this slice started: `default.ts` has no inert fallback left, `ClockBinding` is total, and unsupported playback fields are rejected at validation. What survived was the claim. Three integration cases asserted that `manual`, `scroll`, and `time` "use the same scheduled progress path" while constructing `Motion` directly around a manual port, so they would have stayed green no matter what the factory did. Four documents still described a contract with a fallback in it, and `docs/AUTHORED-SCHEMA.md` went further: its flagship example authored `trigger: { type: "time", autoplay: false }` with no `duration`, which the runtime it documents rejects twice over.

So `T5` removes a claim rather than a behavior, and its proof is structural. `packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts` carries `T-8`, the positional source guard proving the factory reaches the manual port exactly once and only after both driver branches return; `T-9`, tying the time driver's `acceptsExternalSignal: false` and `driver` binding to the third call site so the guard bans a fallback rather than a transport; and `T-10`, proving `engine.ts` and every sibling under `src/adapters/trigger-factory/` build none. `packages/core/test/integration/motion-trigger-types.test.ts` retires the three misleading cases and replaces them with `T-11`, one side-by-side contrast across all three types through the real factory, plus `T-12`, which pins the `seek` interaction: a seek applies on a driver-backed node and the next driver tick overwrites it.

No red-before-green evidence is required or claimed for this slice, and none is invented. Every case passes on the parent by construction, because the behavior they describe already shipped. Saying so is the honest form of the failing-first guardrail here.

The trigger suites also drop their last `as never` track doubles for `createFakeTrackRegistry` plus `vi.spyOn` on real Track instances. That is test infrastructure, not a behavior opt-in, and it is the only way the `as never` gate and the "retained cases stay unchanged" instruction can both hold.

Seven further corrections to the T5 half of the plan are recorded in `docs/IMPLEMENTATION-PLAN-t4-t5-trigger-parity-corrections.md`. The load-bearing ones: `T5-2` and `T5-3` are already proved by `packages/core/test/contract/trigger-factory.test.ts`, so restating them in a second file would duplicate ownership of evidence; section 5.2's three replacement cases would have duplicated `trigger-time.test.ts` and `trigger-scroll.test.ts`; a cited case id has to be a plain `it` declaration or the evidence gate cannot see it; and section 5.6 needs no new ADR number because ADR-021 already owns the `seek` boundary.

## Edge identity, ordering, and labels (finding 8.2)

In review on branch `fix/edge-key-separator-collision`, from issue [#137](https://github.com/chahyasantoso/motion5/issues/137). The decision record is ADR-034.

`edgeKey` is the single canonical edge identity, and it was not injective. It joined its fields with `|`, which is legal in a motion id, a track id, and a target, so a value could forge a field boundary. `canonicalizeProjection` had the same hole with `,` and `=`. Two genuinely different edges, `m/x` observing `m|y/z` and `m/x|m` observing `y/z`, both encoded to `m/x|m|y/z|input||`, and every id involved passes `validateV5`. The loud symptom was `Engine.load()` rejecting a legal project for a duplicate edge nobody authored twice; the silent ones were a dropped delta and a `removeObserve` that could remove the wrong observation.

Fields are now length-prefixed, so the encoding is prefix-free and injective, and an absent target encodes as `-` rather than as an empty field. Because a length prefix reorders keys, ordering stopped being derived from identity: `compareEdges` is the single comparator, replacing `compareEdgeKeys` in the publisher and the private duplicate that `ObservationState` kept. That comparator decides published values, not only diagnostic text, since output merge precedence is whatever it says it is. `describeEdge` owns the readable label that used to be an encoded key inside four messages.

## Current architecture

The runtime has one graph, one live observation state, one topology coordinator, one publisher, one patch registry, one project-wide clock subscription, and one owner of compiled Tracks. Authored and runtime Tracks share one removable store. Track mutation uses frozen definitions and capability handles with monotonic ABA protection; replacement preserves node identity and does not emit terminal destruction patches. No object outside `Engine` holds a compiled `Track` reference, so a recompiled node cannot leave a consumer driving a disposed instance. A runtime Motion is built before it is committed, so no public surface can name a Motion that failed to build.

An observation edge has one identity, one ordering, and one label, and they are three functions rather than one string: `edgeKey` is prefix-free and therefore injective, `compareEdges` is the only comparator, and `describeEdge` is the only readable form. Nothing derives order from identity, so no published value depends on how long an id is.

A declared trigger type selects a real driver or fails loudly. `time` gets a clock-fed driver that latches at `1`, `scroll` resolves an application-injected progress source or rejects with `trigger-driver-unavailable`, `manual` gets a manual port, and nothing falls back. The trigger factory is the only object that reads a trigger kind. A Motion's relationship to the one project clock is the three-state `ClockBinding`, so clock-advanced and push-driven pipelines coexist without any Motion holding both a driver and its own advance.

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
- T4 ordering: PR [#131](https://github.com/chahyasantoso/motion5/pull/131), CI run [32087189826](https://github.com/chahyasantoso/motion5/actions/runs/32087189826), 7/7 green. Integration evidence is `packages/core/test/integration/t4-runtime-motion-parity.test.ts`, cases `T-3` and `T-6`.
- Red evidence for T4 is durable rather than claimed: PR [#132](https://github.com/chahyasantoso/motion5/pull/132), run [32096251602](https://github.com/chahyasantoso/motion5/actions/runs/32096251602), archived at `logs/32096251602/` on `ci-logs`, capturing `expected [Function] to throw an error` for `T-3` and `expected [] to deeply equal [ 'bad/id' ]` for `T-6` on the unmodified parent.
- T5 no manual fallback: `packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts` cases `T-8` through `T-10`, and `packages/core/test/integration/motion-trigger-types.test.ts` cases `T-11` and `T-12`. No red run is cited, because this slice removes a claim rather than changing a behavior.
- Edge identity and ordering: `packages/core/test/unit/graph/edge-key-separator.test.ts` cases `E-1`, `E-2`, `E-3`, `E-5`, `E-6`, and `packages/core/test/unit/graph/edge-order.test.ts` cases `E-4` and `E-7`.
- Red evidence for the edge identity fix is durable rather than claimed: PR [#139](https://github.com/chahyasantoso/motion5/pull/139), run [32129021992](https://github.com/chahyasantoso/motion5/actions/runs/32129021992), archived at `logs/32129021992/` on `ci-logs`, reporting `4 failed | 447 passed` where the four are exactly `E-1`, `E-2`, `E-3`, and `E-6`, and where `E-5` passes on the unmodified parent `dba6cfd`. The archived log carries the collision verbatim: `Duplicate observation edge "m/x|m|y/z|input||"`.

## Known remaining scope

- The T4/T5 parity plan document still lives only on branch `docs/t4-t5-trigger-parity-plan`. Two slices have now landed amendments to a plan the tree does not hold. It should land from its own branch, and it has never been format-checked because `CI`'s `push:` trigger covers only `main`, `rescue/**`, `phase*/**`, and `feat/adopt-motion-track` and that branch has no pull request open.
- Loop semantics may now be designed, as a new plan rather than an extension of the trigger plan. `repeat`, `yoyo`, and ping-pong are rejected at validation until one exists.
- The deprecated owner-based adoption wrappers remain available for compatibility, but the current consumer no longer uses them.
- Still open from section 8 of the trigger-driver plan: `seek` bypassing the Motion beyond documenting it (8.3), and the `signal()` versus manual-port range disagreement (8.4). `T5` documents 8.3 and pins it with a test; it does not close it. The `edgeKey` separator collision (8.2) is closed by ADR-034, recorded above.
- Open from the PR [#126](https://github.com/chahyasantoso/motion5/pull/126) review, deliberately not folded into any slice: a `#setProgress` sweep throw on the clock path is still laundered into a `flush-failure` diagnostic by `GraphRuntime.#onTick`, which blames the flush rather than the missing Track. That is issue [#114](https://github.com/chahyasantoso/motion5/issues/114) section 3.3's third consequence, unchanged, and it needs its own issue.
- Open from the `T4` review, filed rather than folded in: issue [#133](https://github.com/chahyasantoso/motion5/issues/133), a rollback failure can outrank the failure that triggered it, in both `addMotion` and `#addTrack`; and issue [#134](https://github.com/chahyasantoso/motion5/issues/134), `buildMotion`'s `catch` releases the trigger but never disposes the Motion, so a throw after construction leaks an instance no map can reach.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core.
- Every recovery slice starts with a failing-first test on its parent commit, and the failing run is archived on `ci-logs` rather than described in prose. A slice that removes a claim rather than a behavior says so instead of inventing a red run.
- Docs, types, tests, and status move together.
- An evidence case id names exactly one test in the whole suite, and it is declared with a plain `it` so the gate can see it.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
- No hand-padded markdown tables in this file. `format:check` is a hard gate inside `quality`, and it runs before the write-enabled `format` job can repair anything.
