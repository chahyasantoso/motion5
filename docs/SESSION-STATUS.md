# Session status

**Captured:** 2026-08-14, Asia/Jakarta  
**Branch:** `phase5/membership-base`  
**Phase:** Phase 5 is complete. P5-01 through P5-04 are merged, including the owner-correct retained-patch lifecycle fix from [PR #103](https://github.com/chahyasantoso/motion5/pull/103).  
**Next action:** rerun the Phase 5 exit gate from this merged base before opening Phase 6.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`.

## Verified recovered behavior

- Cross-motion references use one classifier in `core/graph/references.ts`.
- Known but unavailable sources publish blocked pending patches and recover without fabricated values.
- Runtime-adopted free tracks join the graph under `~/trackId` through the shared `qualifyFreeTrack` helper with owner-only destruction.
- Diagnostics use one bounded inspection buffer while patches and batch summaries remain the live delivery path.
- Unmounting evicts detached nodes' retained patches through the registry owner, preserves subscribers, reuses the existing pending/blocked path, and recovers on remount with newer revisions.

## Phase 5 evidence

- P5-01 exact-head CI: [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696).
- P5-02 exact-head CI: [31780297529](https://github.com/chahyasantoso/motion5/actions/runs/31780297529).
- P5-03 exact-head CI: [31780874122](https://github.com/chahyasantoso/motion5/actions/runs/31780874122).
- P5-04 behavior PR [#102](https://github.com/chahyasantoso/motion5/pull/102) merged at [`c52293f`](https://github.com/chahyasantoso/motion5/commit/c52293f9554a771a366dd76ccc3890ffa0db580a); lifecycle companion PR [#103](https://github.com/chahyasantoso/motion5/pull/103) merged at [`3b376ad`](https://github.com/chahyasantoso/motion5/commit/3b376ad59365aec0851f768207792929383a2ed7). Exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.
- P5-04 red-first behavior test: [`a75da68`](https://github.com/chahyasantoso/motion5/commit/a75da68b358641bc45b3576a7212c0cdb550a641). Focused registry red test: [`942c2f8`](https://github.com/chahyasantoso/motion5/commit/942c2f80a67753f6259b12a664156a8ba039095c).

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
