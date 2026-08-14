# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID         | Slice                                           | Status                      |
| ---------- | ----------------------------------------------- | --------------------------- |
| W0         | Rescue loop and audit baseline                  | Done                        |
| A1         | Final-value memo consistency                    | Done, gate open             |
| A2         | Preserve subscriber errors                      | Done, gate open             |
| A3         | Guard subscriber-triggered reentrancy           | Done, gate open             |
| B1         | Prepare-stage plugin contribution               | Done                        |
| B2         | Real GSAP multi-stop compilation                | Done                        |
| C1         | React store resubscription                      | Done                        |
| C2         | React hook and public exports                   | Done, gate open             |
| C3         | DOM metadata, serialization, and clear coverage | Done, gate open             |
| D1         | Discover consumer packages                      | Done                        |
| D2         | Planted boundary self-test                      | Done                        |
| D3         | Acceptance evidence gates                       | Done, gate open             |
| E1         | Required declaration build                      | Done, gate open             |
| E2         | Real end-to-end product path                    | Done                        |
| E3         | Mutation baseline and ratchet                   | Done, gate open             |
| P0-1       | Clock and batch identity                        | Done                        |
| P0-2       | GSAP clock ownership                            | Done                        |
| P0-3       | Absolute multi-property stop compilation        | Done, audited               |
| P0-3b      | Authored-duration pinning                       | Done, audited               |
| P0-4       | DOM transform rendering and removal             | Done, audited               |
| X-1        | Flat projected input observations               | Done, merged                |
| P1-5       | Structural registry change detection            | Done, merged                |
| P1-6       | Listener snapshots before notification          | Done, merged                |
| P1-7       | Scheduler-driven deferred drain                 | Done, merged                |
| P1-8       | One reentrancy policy, one flush entry point    | Done, merged                |
| P1-9       | Narrow public project handle                    | Done, merged                |
| P1-10      | Product-load authored validation                | Done, merged                |
| P1-11      | Runtime composition/output-shape diagnostics    | Done, merged                |
| P1-12      | One observation-validation owner                | Done, merged                |
| S5         | Contribution completeness                       | Done, gate open             |
| S6         | Remove dead `use` contract                      | Done, gate open             |
| S7         | Recovery audit and durable evidence             | Done, audited               |
| P2/G-5/G-6 | Dirty-closure benchmark and mutation ratchet    | Done, audited               |
| M1         | Motion/trigger lifecycle wiring                 | Implemented, awaiting audit |

## S7 exit evidence

Recovery audit [31765798822](https://github.com/chahyasantoso/motion5/actions/runs/31765798822) passed on the PR 95 head. Mutation score was **75.89%**, above the **65.42%** threshold, with zero per-file regressions. The benchmark passed at dirty closure `500/1000` and ratio `0.5`.

## M1 evidence

PR [#96](https://github.com/chahyasantoso/motion5/pull/96) has assertion-level red evidence at [`2681d1a`](https://github.com/chahyasantoso/motion5/commit/2681d1a5b9336dd8c4b08f8ab7b80d64a5817020). Implementation commits [`093b4d2`](https://github.com/chahyasantoso/motion5/commit/093b4d2fac9c5308e5ff9e64536bdcbebe063274), [`8f22c4e`](https://github.com/chahyasantoso/motion5/commit/8f22c4ef827d0f0767c273f1882e305faeedae87), [`51536b0`](https://github.com/chahyasantoso/motion5/commit/51536b0c622d49ffcff2941ec263f6857bc4bb68), and [`9709d2c`](https://github.com/chahyasantoso/motion5/commit/9709d2c968a9abd00778ea75511b0360871643e3) cover lifecycle ownership, public signaling, one-clock enforcement, all trigger types, scheduler cancellation, disposal, and post-disposal guards. Required checks were green on the repaired head before the final test/doc commit.

## Current next action

Run the required checks on the final M1 head, dispatch Recovery audit with `ref=<final M1 SHA>`, `base=e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b`, blank exception, then merge PR 96 into rescue. After that, open rescue → main.

## Disposition of `CODE-REVIEW-POST-E3.md`

The historical review predates the P0/P1/X fixes and PR 95. Its remaining Motion/trigger decision is now implemented as M1 through the existing ProjectRuntime seek/invalidation path, scheduler, and one project clock. The review status addendum and implementor brief now point to M1 evidence and the final audit as the remaining release gate.

## Recovery evidence chain

- S6: [PR #92](https://github.com/chahyasantoso/motion5/pull/92), green workflow [#31718629183](https://github.com/chahyasantoso/motion5/actions/runs/31718629183).
- S7/P2: [PR #95](https://github.com/chahyasantoso/motion5/pull/95), audit [#31765798822](https://github.com/chahyasantoso/motion5/actions/runs/31765798822), rescue merge [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b).
- M1: [PR #96](https://github.com/chahyasantoso/motion5/pull/96), base `e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b`.

## Remaining work

- Run final exact-head CI and the Recovery audit for M1.
- Merge PR 96 into rescue, then open rescue → main after branch-protection verification.
