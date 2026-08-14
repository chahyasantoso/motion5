# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID | Slice | Status |
| --- | --- | --- |
| W0 | Rescue loop and audit baseline | Done |
| A1-A3 | Runtime hardening | Done, gate open |
| B1-B2 | Plugin and GSAP recovery | Done |
| C1-C3 | React and DOM recovery | Done, gate open |
| D1-D3 | Consumer and acceptance gates | Done, gate open |
| E1-E3 | Build, end-to-end, mutation gates | Done, gate open |
| P0-1 to P0-4 | Clock, timing, and rendering foundations | Done, audited |
| P1-5 to P1-12 | Graph/runtime invariants | Done, merged |
| S5-S7 | Recovery evidence | Done, audited |
| P2/G-5/G-6 | Benchmark and mutation ratchet | Done, audited |
| M1 | Motion/trigger lifecycle wiring | Done, audited |
| P5-01 to P5-04 | Phase 5 membership | Done, merged |
| P6-01 | API surface and declarations | Done, merged |
| P6-02 | Packed package consumer | In progress, red-first |
| P6-03 | Public documentation | Queued |
| P6-04 | Enforce benchmark budgets | Queued |
| P6-05 | Delete transitional code/docs | Queued |

## Evidence

- Phase 5 completed on `phase5/membership-base`; P5-04 exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed all required checks.
- Phase 6 base `phase6/hardening-base` was cut at [`5299e3a`](https://github.com/chahyasantoso/motion5/commit/5299e3aa18493dafac185607530627467c7a085d). CI filters were updated for `phase6/**` in [`734a80a`](https://github.com/chahyasantoso/motion5/commit/734a80ac75faa75d2c0973b8cb75fe64d91f16f4).
- P6-01 PR [#104](https://github.com/chahyasantoso/motion5/pull/104) merged at [`65586ba`](https://github.com/chahyasantoso/motion5/commit/65586ba2aac542c9cd7caed69f018ec49becf194). Red [`a42bf7f`](https://github.com/chahyasantoso/motion5/commit/a42bf7fe037dd44ef1f7c5d497d93c859518da07); final exact-head CI [31784090216](https://github.com/chahyasantoso/motion5/actions/runs/31784090216) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## Phase 6 contract

The public API is now enforced by a generated-declaration checker and committed value/type report; private runtime/graph declarations cannot leak through the public entrypoint, and `@motion5/core/internal` remains outside the public report. Phase 6 detailed intent and checklists live in [`docs/PHASE6-DETAILED-PLAN.md`](./PHASE6-DETAILED-PLAN.md).

## Current next action

P6-02 is starting from the merged P6-01 base: write the packed-consumer red test first, confirm the failure is the missing package-consumer seam, then implement only the package consumer/job and rerun the exact matrix.

## Review disposition

Phase 5 is closed. Phase 6 is active on `phase6/hardening-base`; P6-01 is closed and P6-02 is the current slice.