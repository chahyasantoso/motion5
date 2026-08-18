# Session status

**Captured:** 2026-08-18, Asia/Jakarta  
**Branch:** `feat/adopt-motion-track`  
**Phase:** runtime mutation model (W1-W5) complete; trigger drivers (T3) complete; compiled Track ownership (option C) green and ready to squash. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** squash option C, then resume the remaining T4 runtime Motion parity work on top of it.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`.

## Runtime mutation model

| Package | Scope                                                              | State                                                                            |
| ------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| W1      | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109)                |
| W2      | Transactional `adopt`/`destroyAdopted` (P1, A1)                    | merged, [#110](https://github.com/chahyasantoso/motion5/pull/110)                |
| W3      | Freeze and validate adopted tracks (A2)                            | merged, [#111](https://github.com/chahyasantoso/motion5/pull/111)                |
| W4      | Runtime `addMotion`/`destroyMotion` (P2)                           | merged, [#112](https://github.com/chahyasantoso/motion5/pull/112)                |
| W5      | Unified store, capability handles, `replaceTrack` (P3)             | merged into this base, [#113](https://github.com/chahyasantoso/motion5/pull/113) |

## Trigger drivers (T3)

| Slice | Scope                                                                            | State                                                                 |
| ----- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| T3    | Scroll and time trigger definitions, drivers, and seam fixes for root T3 defects | in this PR, [#124](https://github.com/chahyasantoso/motion5/pull/124) |

**T3 breakdown:**

- Commit `e9fa902` (test): red suite covering T3 trigger drivers and seam requirements
- Commit `c1ee4ba` (seam): `resolveTriggerDefinition`, `ClockBinding` union, contract/diagnostics, expanded public exports, boundary validation
- Commit `da36dee` (demo): React consumer updated to inject source key for Scroll/Time triggers
- Commit `d8441b2` (adr): ADR-030 rewritten to document trigger driver architecture
- Commit `be0ef65` (archiver): CI log archiver fixed for all three defects (cancelled runs, race conditions, swallowed errors)

**T3 CI status:** 7/7 green on run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864). All required jobs pass. Format job added formatting child commit (prettier auto-fixed 3 cosmetic drift items). PR ready for review.

## Compiled Track ownership (option C)

**Slice:** Motion resolves compiled Tracks by id through an injected resolver. Green and ready to squash in PR [#126](https://github.com/chahyasantoso/motion5/pull/126). The review follow-up covering items 4 to 8 landed through PR [#130](https://github.com/chahyasantoso/motion5/pull/130) and is already part of that branch, so there is nothing outstanding behind it.

`MotionTrackEntry` carries `{ id, duration? }`. `MotionOptions` requires `resolveTrack: (id) => Track | undefined`, and `Motion` calls it at every point of use rather than storing a compiled `Track`. `Engine`'s `tracks` map is the single owner, so the `addMotionTrack` and `replaceMotionTrack` hooks no longer resolve Tracks on `Motion`'s behalf.

This is the long-term fix deferred by section 8.1 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` and by ADR-029. The near-term option A fix stays in place with a narrowed job: `Motion.replaceTrack` still preserves the array index, stagger timing, and current progress, so ADR-029's guarantee is unchanged and separately evidenced.

Review of #126 amended one locked decision. `disposeTracks` now defaults to `false`, because option C hands Track lifetime to the resolver's caller and a `Motion` must not dispose a Track it merely resolved. `Engine` passes `false` explicitly, so production behavior is unchanged either way. The rationale is in ADR-031 under `Disposal ownership`, and the amendment is recorded in the corrections doc so no reader trusts an earlier claim that C1 through C10 all landed verbatim.

The rest of the review is now on the branch: one flat evidence id series with a gate that enforces it, one entry shape from both construction paths, the hook-ordering comments in `ProjectRuntime`, and a single definition of "semantic files" in `docs/PR-WORKFLOW.md`. Review items 9 to 11 stay open by design; 9 and 11 are recorded in the corrections doc and below, and 10 needs its own issue.

**CI status:** 7/7 green on run [32084286445](https://github.com/chahyasantoso/motion5/actions/runs/32084286445), including the write-enabled `format` job, which found no drift. The branch carries 26 commits, past the twenty-five-commit recut tripwire in `docs/PR-WORKFLOW.md`. It is not being recut: the overrun is push granularity from an API-driven workflow plus one absorbed follow-up PR, not a second revert or a widened slice, and the squash collapses it to one commit. Recorded rather than waived silently.

The executable contract is `docs/IMPLEMENTATION-PLAN-motion-track-resolution.md`, amended by `docs/IMPLEMENTATION-PLAN-motion-track-resolution-corrections.md`. The decision record is ADR-031.

## Current architecture

The runtime has one graph, one live observation state, one topology coordinator, one publisher, one patch registry, one project-wide clock subscription, and one owner of compiled Tracks. Authored and runtime Tracks share one removable store. Track mutation uses frozen definitions and capability handles with monotonic ABA protection; replacement preserves node identity and does not emit terminal destruction patches. No object outside `Engine` holds a compiled `Track` reference, so a recompiled node cannot leave a consumer driving a disposed instance.

Trigger definitions are resolved through a seam layer that unifies scroll and time triggers with the manual trigger path. Drivers are injected at Composition time and cached per host, allowing clock-advanced and scroll-position-based motion pipelines to coexist.

## React consumer migration

`apps/react-demo/src/App.tsx` now uses `handle.addTrack(track, { motionId: "walk" })` and stores returned `TrackHandle`s for reverse-order removal. The deprecated owner-based `handle.adopt()` / `handle.destroyAdopted()` calls and caller-invented owner ref are retired from the current consumer.

The migration landed on this branch in commit [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf741e). Follow-up CI should verify the base branch after the consumer change.

## Evidence

- W1-W5 final runtime CI: [31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456), all seven checks green.
- React consumer migration: [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf741e), on this branch.
- W5 PR: [#113](https://github.com/chahyasantoso/motion5/pull/113).
- T3 trigger drivers: PR [#124](https://github.com/chahyasantoso/motion5/pull/124), CI run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864).
- Option C: PR [#126](https://github.com/chahyasantoso/motion5/pull/126), CI run [32084286445](https://github.com/chahyasantoso/motion5/actions/runs/32084286445). Unit evidence is `packages/core/test/unit/domain/motion-track-resolution.test.ts` cases C-5 and C-6; integration evidence is `packages/core/test/integration/option-c-track-resolution.test.ts`.
- Option C disposal ownership: `packages/core/test/unit/domain/motion-dispose-ownership.test.ts`, cases C-14 through C-16.
- Follow-up gates: PR [#130](https://github.com/chahyasantoso/motion5/pull/130). `packages/core/test/unit/scripts/evidence-case-ids.test.ts` for id uniqueness, `packages/core/test/unit/engine/motion-entry-shape.test.ts` for entry shape.
- Red evidence for option C is durable rather than claimed: `logs/32036837861/` and `logs/32036952950/` on `ci-logs` capture the four `TS2353` hits and the six runtime failures naming `Motion requires a resolveTrack function.`

## Known remaining scope

- Scroll/time trigger drivers are now implemented; Compositions with `trigger.type` of `scroll` or `time` will use the injected drivers.
- The deprecated owner-based adoption wrappers remain available for compatibility, but the current consumer no longer uses them.
- Still open from section 8 of the trigger-driver plan: the `edgeKey` separator collision (8.2), `seek` bypassing the Motion (8.3), and the `signal()` versus manual-port range disagreement (8.4). None are touched by option C.
- Open from the #126 review, deliberately not folded into either PR: a `#setProgress` sweep throw on the clock path is still laundered into a `flush-failure` diagnostic by `GraphRuntime.#onTick`, which blames the flush rather than the missing Track. That is issue #114 section 3.3's third consequence, unchanged, and it needs its own issue.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- An evidence case id names exactly one test in the whole suite.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
