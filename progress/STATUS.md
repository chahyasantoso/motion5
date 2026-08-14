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
| P5-04         | Unmount/remount recovery                   | Done, merged    |

## Evidence

- P5-01 merged as PR [#99](https://github.com/chahyasantoso/motion5/pull/99) at [`c543c3a`](https://github.com/chahyasantoso/motion5/commit/c543c3a15864de3040061d7d1a1d29176c09d312); exact-head CI [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696) passed.
- P5-02 merged as PR [#100](https://github.com/chahyasantoso/motion5/pull/100) at [`ef40e02`](https://github.com/chahyasantoso/motion5/commit/ef40e026899e66ef7b2ef654c54ce05fe1af73df); final exact-head CI [31780297529](https://github.com/chahyasantoso/motion5/actions/runs/31780297529) passed.
- P5-03 merged as PR [#101](https://github.com/chahyasantoso/motion5/pull/101); red [`8ec4dd5`](https://github.com/chahyasantoso/motion5/commit/8ec4dd56528296fc4332598b0f3d134bfe2cf630), green [`68e1f21`](https://github.com/chahyasantoso/motion5/commit/68e1f21e5ec242a36f8630c766ce35bb0e1a7ec6) and [`f728e41`](https://github.com/chahyasantoso/motion5/commit/f728e412ccc56840701ac3c7f9b64ed3b3ed950e); exact-head CI [31780874122](https://github.com/chahyasantoso/motion5/actions/runs/31780874122) passed.
- P5-04 merged as PR [#102](https://github.com/chahyasantoso/motion5/pull/102) at merge commit [`c52293f`](https://github.com/chahyasantoso/motion5/commit/c52293f9554a771a366dd76ccc3890ffa0db580a). Red behavior test: [`a75da68`](https://github.com/chahyasantoso/motion5/commit/a75da68b358641bc45b3576a7212c0cdb550a641). Companion lifecycle fix merged as PR [#103](https://github.com/chahyasantoso/motion5/pull/103) at [`3b376ad`](https://github.com/chahyasantoso/motion5/commit/3b376ad59365aec0851f768207792929383a2ed7). Exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## Phase 5 contract

Authored, cross-motion, and adopted nodes share one graph path without flags. Unknown sources fail at load; known unavailable sources publish blocked pending patches and recover without fabricated values. Runtime-adopted free tracks use `~/trackId` and enforce owner-only destruction. Diagnostics share one bounded inspection buffer while patches and batch summaries remain the live delivery path. Unmounting evicts only the detached node's retained patch, preserves subscribers, reuses the P5-01 pending path, and remounts with a strictly newer downstream revision. Fifty churn cycles prove flat retention and exactly 100 notifications.

## Current next action

Phase 5 is complete on `phase5/membership-base`. Re-run the Phase 5 exit gate from the merged base before opening Phase 6.

## Review disposition

Phase 5 is closed. No unresolved P5-04 implementation gaps remain; the final allow-list correction is documented on PRs [#102](https://github.com/chahyasantoso/motion5/pull/102) and [#103](https://github.com/chahyasantoso/motion5/pull/103).
