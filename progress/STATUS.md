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

## S7 exit evidence

Recovery audit [31765798822](https://github.com/chahyasantoso/motion5/actions/runs/31765798822) passed on ref [`a920613`](https://github.com/chahyasantoso/motion5/commit/a920613bfd4fa0cc8c38154b1ad84ba416bc791d): contract, mutation, acceptance, failing-first, and build all succeeded. Mutation score was **75.89%**, above the **65.42%** threshold, with zero per-file regressions. The benchmark passed at dirty closure `500/1000` and ratio `0.5`.

The final PR head [`d4428d1`](https://github.com/chahyasantoso/motion5/commit/d4428d10368554e8a53e7b38eaf2a1a1b246435d) is the formatter-only child of the audited commit. Its required matrix passed. PR [#95](https://github.com/chahyasantoso/motion5/pull/95) merged into rescue as [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b).

## Disposition of `CODE-REVIEW-POST-E3.md`

The historical review was written against `f048a58` before the P0/P1/X fixes landed. The current executable evidence supersedes its governance findings G-5 and G-6, and the P0/P1/X implementation slices are covered by the contract, integration, build, and end-to-end suites. PR 95 specifically closes the deferred dirty-closure benchmark and per-file mutation baseline work; it does **not** close every medium-severity P2 code smell listed in the historical review.

## Current next action

Open the final rescue → main PR only after branch protection confirms the required checks. Before calling parity complete, make the explicit Motion/trigger decision from the implementor brief: wire both through the existing `ProjectRuntime.seek` and scheduler path, or delete the dead APIs and update the brief/status to match.

## Recovery evidence chain

- S6: [PR #92](https://github.com/chahyasantoso/motion5/pull/92), green workflow [#31718629183](https://github.com/chahyasantoso/motion5/actions/runs/31718629183), head [`9b6e50e`](https://github.com/chahyasantoso/motion5/commit/9b6e50eeb58beeded1124604b9274a88007d7c0f).
- S7/P2: [PR #95](https://github.com/chahyasantoso/motion5/pull/95), audit [#31765798822](https://github.com/chahyasantoso/motion5/actions/runs/31765798822), audited head [`a920613`](https://github.com/chahyasantoso/motion5/commit/a920613bfd4fa0cc8c38154b1ad84ba416bc791d), final head [`d4428d1`](https://github.com/chahyasantoso/motion5/commit/d4428d10368554e8a53e7b38eaf2a1a1b246435d), rescue merge [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b).

## Remaining work

- Decide and implement or remove Motion/trigger wiring, with a failing-first test if implemented.
- Open rescue → main and update the historical review's status pointer after that PR is green.
