# Session status

**Captured:** 2026-08-14, Asia/Jakarta  
**Branch:** `wip/p5-04-patch-retention-lifecycle`  
**Phase:** Phase 5 is complete pending the final P5-04 merge. The behavior contract is on [PR #102](https://github.com/chahyasantoso/motion5/pull/102); the owner-correct lifecycle implementation is on [WIP PR #103](https://github.com/chahyasantoso/motion5/pull/103).  
**Next action:** merge #103 into the P5-04 behavior branch, update #102's allow-list, then merge the completed slice into `phase5/membership-base`.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`.

## Verified recovered behavior

- Cross-motion references use one classifier in `core/graph/references.ts`.
- Known but unavailable sources publish blocked pending patches and recover without fabricated values.
- Runtime-adopted free tracks join the graph under `~/trackId` through the shared `qualifyFreeTrack` helper with owner-only destruction.
- Diagnostics use one bounded inspection buffer while patches and batch summaries remain the live delivery path.
- P5-04 evicts detached nodes' retained patches through the registry owner, preserves subscribers, reuses the existing pending/blocked path, and recovers on remount with newer revisions.

## P5-04 evidence

- Red behavior test: [`a75da68`](https://github.com/chahyasantoso/motion5/commit/a75da68b358641bc45b3576a7212c0cdb550a641).
- Red focused registry test: [`942c2f8`](https://github.com/chahyasantoso/motion5/commit/942c2f80a67753f6259b12a664156a8ba039095c).
- Implementation: [`50fb170`](https://github.com/chahyasantoso/motion5/commit/50fb1705ed31a1e44d142fdf7c1025448b6de0a0) and [`595c596`](https://github.com/chahyasantoso/motion5/commit/595c5968b064eb39380d9849a850af2581248d75).
- Exact-head CI [31781861401](https://github.com/chahyasantoso/motion5/actions/runs/31781861401) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
