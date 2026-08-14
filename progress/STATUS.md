# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID            | Slice                                      | Status          |
| ------------- | ------------------------------------------ | --------------- |
| W0            | Rescue loop and audit baseline             | Done            |
| A1-A3         | Runtime hardening                          | Done, gate open |
| B1-B2         | Plugin and GSAP recovery                   | Done            |
| C1-C3         | React and DOM recovery                     | Done, gate open |
| D1-D3         | Consumer and acceptance gates              | Done, gate open |
| E1-E3         | Build, end-to-end, mutation gates          | Done, gate open |
| P0-1 to P0-4  | Clock, timing, and rendering foundations   | Done, audited   |
| P1-5 to P1-12 | Graph/runtime invariants                   | Done, merged    |
| S5-S7         | Recovery evidence                          | Done, audited   |
| P2/G-5/G-6    | Benchmark and mutation ratchet             | Done, audited   |
| M1            | Motion/trigger lifecycle wiring            | Done, audited   |
| P5-01         | Cross-motion references through membership | Done, merged    |
| P5-02         | Adopted free tracks                        | Done, merged    |
| P5-03         | Unified inline diagnostics                 | Done, merged    |
| P5-04         | Unmount/remount recovery                   | Done, green     |

## Evidence

- P5-01 merged as PR [#99](https://github.com/chahyasantoso/motion5/pull/99) at [`c543c3a`](https://github.com/chahyasantoso/motion5/commit/c543c3a15864de3040061d7d1a1d29176c09d312); exact-head CI [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696) passed.
- P5-02 merged as PR [#100](https://github.com/chahyasantoso/motion5/pull/100) at [`ef40e02`](https://github.com/chahyasantoso/motion5/commit/ef40e026899e66ef7b2ef654c54ce05fe1af73df); final exact-head CI [31780297529](https://github.com/chahyasantoso/motion5/actions/runs/31780297529) passed.
- P5-03 merged as PR [#101](https://github.com/chahyasantoso/motion5/pull/101); red [`8ec4dd5`](https://github.com/chahyasantoso/motion5/commit/8ec4dd56528296fc4332598b0f3d134bfe2cf630), green [`68e1f21`](https://github.com/chahyasantoso/motion5/commit/68e1f21e5ec242a36f8630c766ce35bb0e1a7ec6) and [`f728e41`](https://github.com/chahyasantoso/motion5/commit/f728e412ccc56840701ac3c7f9b64ed3b3ed950e); exact-head CI [31780874122](https://github.com/chahyasantoso/motion5/actions/runs/31780874122) passed.
- P5-04 behavior PR [#102](https://github.com/chahyasantoso/motion5/pull/102) red test: [`a75da68`](https://github.com/chahyasantoso/motion5/commit/a75da68b358641bc45b3576a7212c0cdb550a641). Its companion WIP PR [#103](https://github.com/chahyasantoso/motion5/pull/103) added registry-owned eviction in [`50fb170`](https://github.com/chahyasantoso/motion5/commit/50fb1705ed31a1e44d142fdf7c1025448b6de0a0) and detach wiring in [`595c596`](https://github.com/chahyasantoso/motion5/commit/595c5968b064eb39380d9849a850af2581248d75). Exact-head CI [31781861401](https://github.com/chahyasantoso/motion5/actions/runs/31781861401) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## P5-04 contract

Unmounting evicts only the detached node's retained patch, preserves subscriber identity, and reuses P5-01's existing `observation-pending-reference` blocked path. Remounting and reseeking republishes the downstream as ready with a strictly newer revision. The 50-cycle integration test proves flat retention and exactly 100 consumer notifications.

## Current next action

P5-04 implementation is green in WIP PR [#103]. Merge the companion into the behavior branch, update PR #102's corrected allow-list, then merge the completed P5-04 slice into `phase5/membership-base` and rerun the Phase 5 exit gate.

## Review disposition

The historical rescue review is closed. Phase 5 is complete pending the final P5-04 merge; its detailed slice plan and guardrails live in `docs/PHASE5-DETAILED-PLAN.md`.
