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
| P6-02 | Packed package consumer | Done, merged |
| P6-03 | Public documentation | In progress, red-first |
| P6-04 | Enforce benchmark budgets | Queued |
| P6-05 | Delete transitional code/docs | Queued |

## Evidence

- Phase 5 completed on `phase5/membership-base`; P5-04 exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed all required checks.
- Phase 6 base `phase6/hardening-base` was cut at [`5299e3a`](https://github.com/chahyasantoso/motion5/commit/5299e3aa18493dafac185607530627467c7a085d). CI filters were updated for `phase6/**` in [`734a80a`](https://github.com/chahyasantoso/motion5/commit/734a80ac75faa75d2c0973b8cb75fe64d91f16f4).
- P6-01 PR [#104](https://github.com/chahyasantoso/motion5/pull/104) merged at [`65586ba`](https://github.com/chahyasantoso/motion5/commit/65586ba2aac542c9cd7caed69f018ec49becf194); final exact-head CI [31784090216](https://github.com/chahyasantoso/motion5/actions/runs/31784090216) passed.
- P6-02 PR [#105](https://github.com/chahyasantoso/motion5/pull/105) merged at [`48dc861`](https://github.com/chahyasantoso/motion5/commit/48dc8611bab49dc24cd91b07c29d0e8b73e37fe); red [`214afa7`](https://github.com/chahyasantoso/motion5/commit/214afa75826b9c496b09d138cdc4dec33d0adb94); final exact-head CI [31785888346](https://github.com/chahyasantoso/motion5/actions/runs/31785888346) passed quality, integration, boundaries, build, end-to-end, performance, package consumer, and prettier.

## Phase 6 contract

The public API is enforced by generated declarations and a committed value/type report. Packed ESM and TypeScript consumers now pass from the tarball, deep imports fail, and `dist` is shipped with the package. Phase 6 detailed intent and checklists live in [`docs/PHASE6-DETAILED-PLAN.md`](./PHASE6-DETAILED-PLAN.md).

## Current next action

P6-03 is starting from the merged P6-02 base: write the documentation consistency red test first, confirm stale claims are the intended failure, then reconcile docs only in the documentation slice.

## Review disposition

Phase 5 is closed. Phase 6 is active on `phase6/hardening-base`; P6-01 and P6-02 are closed, P6-03 is current.