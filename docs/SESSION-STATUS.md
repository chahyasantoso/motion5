# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `feat/adopt-motion-track`  
**Phase:** runtime mutation model remediation complete through W5. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** continue normal integration work from the updated base; scroll/time trigger drivers remain separate scope.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model

| Package | Scope | State |
| --- | --- | --- |
| W1 | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109) |
| W2 | Transactional `adopt`/`destroyAdopted` (P1, A1) | merged, [#110](https://github.com/chahyasantoso/motion5/pull/110) |
| W3 | Freeze and validate adopted tracks (A2) | merged, [#111](https://github.com/chahyasantoso/motion5/pull/111) |
| W4 | Runtime `addMotion`/`destroyMotion` (P2) | merged, [#112](https://github.com/chahyasantoso/motion5/pull/112) |
| W5 | Unified store, capability handles, `replaceTrack` (P3) | merged into this base, [#113](https://github.com/chahyasantoso/motion5/pull/113) |

## Current architecture

The runtime has one graph, one live observation state, one topology coordinator, one publisher, one patch registry, and one project-wide clock subscription. Authored and runtime Tracks share one removable store. Track mutation uses frozen definitions and capability handles with monotonic ABA protection; replacement preserves node identity and does not emit terminal destruction patches.

## React consumer migration

`apps/react-demo/src/App.tsx` now uses `handle.addTrack(track, { motionId: "walk" })` and stores returned `TrackHandle`s for reverse-order removal. The deprecated owner-based `handle.adopt()` / `handle.destroyAdopted()` calls and caller-invented owner ref are retired from the current consumer.

The migration landed on this branch in commit [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf01e88a825e07cf741). Follow-up CI should verify the base branch after the consumer change.

## Evidence

- W1-W5 final runtime CI: [31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456), all seven checks green.
- React consumer migration: [`01cd580`](https://github.com/chahyasantoso/motion5/commit/01cd58078f594c11c0cc0bf741e), on this branch.
- W5 PR: [#113](https://github.com/chahyasantoso/motion5/pull/113).

## Known remaining scope

- Scroll/time trigger drivers remain separate work; core currently uses the manual trigger path even when schema `trigger.type` is `scroll` or `time`.
- The deprecated owner-based adoption wrappers remain available for compatibility, but the current consumer no longer uses them.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
