# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `feat/adopt-motion-track`  
**Phase:** runtime mutation model (W1-W5) complete; trigger drivers (T3) complete. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** continue normal integration work from the updated base; scroll/time trigger availability is now implemented.

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

| Slice | Scope                                                                              | State                                                                  |
| ----- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| T3    | Scroll and time trigger definitions, drivers, and seam fixes for root T3 defects    | in this PR, [#124](https://github.com/chahyasantoso/motion5/pull/124)  |

**T3 breakdown:**
- Commit `e9fa902` (test): red suite covering T3 trigger drivers and seam requirements
- Commit `c1ee4ba` (seam): `resolveTriggerDefinition`, `ClockBinding` union, contract/diagnostics, expanded public exports, boundary validation
- Commit `da36dee` (demo): React consumer updated to inject source key for Scroll/Time triggers
- Commit `d8441b2` (adr): ADR-030 rewritten to document trigger driver architecture
- Commit `be0ef65` (archiver): CI log archiver fixed for all three defects (cancelled runs, race conditions, swallowed errors)

**T3 CI status:** 7/7 green on run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864). All required jobs pass. Format job added formatting child commit (prettier auto-fixed 3 cosmetic drift items). PR ready for review.

## Current architecture

The runtime has one graph, one live observation state, one topology coordinator, one publisher, one patch registry, and one project-wide clock subscription. Authored and runtime Tracks share one removable store. Track mutation uses frozen definitions and capability handles with monotonic ABA protection; replacement preserves node identity and does not emit terminal destruction patches.

Trigger definitions are resolved through a seam layer that unifies scroll and time triggers with the manual trigger path. Drivers are injected at Composition time and cached per host, allowing clock-advanced and scroll-position-based motion pipelines to coexist.

## React consumer migration

`apps/react-demo/src/App.tsx` now uses `handle.addTrack(track, { motionId: "walk" })` and stores returned `TrackHandle`s for reverse-order removal. The deprecated owner-based `handle.adopt()` / `handle.destroyAdopted()` calls and caller-invented owner ref are retired from the current consumer.

The migration landed on this branch in commit [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf741e). Follow-up CI should verify the base branch after the consumer change.

## Evidence

- W1-W5 final runtime CI: [31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456), all seven checks green.
- React consumer migration: [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf741e), on this branch.
- W5 PR: [#113](https://github.com/chahyasantoso/motion5/pull/113).
- T3 trigger drivers: PR [#124](https://github.com/chahyasantoso/motion5/pull/124), CI run [32026250864](https://github.com/chahyasantoso/motion5/actions/runs/32026250864).

## Known remaining scope

- Scroll/time trigger drivers are now implemented; Compositions with `trigger.type` of `scroll` or `time` will use the injected drivers.
- The deprecated owner-based adoption wrappers remain available for compatibility, but the current consumer no longer uses them.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
