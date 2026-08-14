# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID         | Slice                                           | Status          |
| ---------- | ----------------------------------------------- | --------------- |
| W0         | Rescue loop and audit baseline                  | Done            |
| A1         | Final-value memo consistency                    | Done, gate open |
| A2         | Preserve subscriber errors                      | Done, gate open |
| A3         | Guard subscriber-triggered reentrancy           | Done, gate open |
| B1         | Prepare-stage plugin contribution               | Done            |
| B2         | Real GSAP multi-stop compilation                | Done            |
| C1         | React store resubscription                      | Done            |
| C2         | React hook and public exports                   | Done, gate open |
| C3         | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1         | Discover consumer packages                      | Done            |
| D2         | Planted boundary self-test                      | Done            |
| D3         | Acceptance evidence gates                       | Done, gate open |
| E1         | Required declaration build                      | Done, gate open |
| E2         | Real end-to-end product path                    | Done            |
| E3         | Mutation baseline and ratchet                   | Done, gate open |
| P0-1       | Clock and batch identity                        | Done            |
| P0-2       | GSAP clock ownership                            | Done            |
| P0-3       | Absolute multi-property stop compilation        | Done, audited   |
| P0-3b      | Authored-duration pinning                       | Done, audited   |
| P0-4       | DOM transform rendering and removal             | Done, audited   |
| X-1        | Flat projected input observations               | Done, merged    |
| P1-5       | Structural registry change detection            | Done, merged    |
| P1-6       | Listener snapshots before notification          | Done, merged    |
| P1-7       | Scheduler-driven deferred drain                 | Done, merged    |
| P1-8       | One reentrancy policy, one flush entry point    | Done, merged    |
| P1-9       | Narrow public project handle                    | Done, merged    |
| P1-10      | Product-load authored validation                | Done, merged    |
| P1-11      | Runtime composition/output-shape diagnostics    | Done, merged    |
| P1-12      | One observation-validation owner                | Done, merged    |
| S5         | Contribution completeness                       | Done, gate open |
| S6         | Remove dead `use` contract                      | Done, gate open |
| S7         | Recovery audit and durable evidence             | Done, audited   |
| P2/G-5/G-6 | Dirty-closure benchmark and mutation ratchet    | Done, audited   |
| M1         | Motion/trigger lifecycle wiring                 | Done, audited   |

## Evidence

- PR [#95](https://github.com/chahyasantoso/motion5/pull/95) merged as [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b).
- M1 PR [#96](https://github.com/chahyasantoso/motion5/pull/96) merged as [`1a26bfe`](https://github.com/chahyasantoso/motion5/commit/1a26bfe50899d8cb3bd7d0bde87d3def2033692d).
- Assertion-level red: [`2681d1a`](https://github.com/chahyasantoso/motion5/commit/2681d1a5b9336dd8c4b08f8ab7b80d64a5817020).
- Final audited M1 head: [`c26a807`](https://github.com/chahyasantoso/motion5/commit/c26a807c8fe74dc6fc79ee4ef92907c6364c408b).
- Recovery audit [31767593680](https://github.com/chahyasantoso/motion5/actions/runs/31767593680) passed contract, mutation, acceptance, failing-first, and build/end-to-end jobs. Its only annotations were Node 20 action deprecation warnings.

## Review disposition

The historical `CODE-REVIEW-POST-E3.md` was written against `f048a58`. P0-1 through P0-4, P1-5 through P1-12, X-1 through X-3, G-5/G-6, and the Motion/trigger lifecycle decision are now covered by implementation evidence and executable tests. The remaining items are release hygiene, not open runtime defects.

## Next action

Open rescue → main after branch-protection verification. Keep the Node 20 action warnings as a separate maintenance cleanup, not a reason to reopen M1.
