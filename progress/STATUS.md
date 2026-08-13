# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID    | Slice                                           | Status        |
| ----- | ----------------------------------------------- | ------------- |
| W0    | Rescue loop and audit baseline                  | Done          |
| A1    | Final-value memo consistency                    | Done, audited |
| A2    | Preserve subscriber errors                      | Done, audited |
| A3    | Guard subscriber-triggered reentrancy           | Done, audited |
| B1    | Prepare-stage plugin contribution               | Done, migrated and audited |
| B2    | Real GSAP multi-stop compilation                | Done, audited |
| C1    | React store resubscription                      | Done, audited |
| C2    | React hook and public exports                   | Done, audited |
| C3    | DOM metadata, serialization, and clear coverage | Done, audited |
| D1    | Discover consumer packages                      | Done, audited |
| D2    | Planted boundary self-test                      | Done, audited |
| D3    | Acceptance evidence gates                       | Done, audited |
| E1    | Required declaration build                      | Done, audited |
| E2    | Real end-to-end product path                    | Done, audited |
| E3    | Mutation baseline and ratchet                   | Done, audited |
| P0-1  | Clock and batch identity                        | Done, audited |
| P0-2  | GSAP clock ownership                            | Done, audited |
| P0-3  | Absolute multi-property stop compilation        | Done, audited |
| P0-3b | Authored-duration pinning                       | Done, audited |
| P0-4  | DOM transform rendering and removal             | Done, audited |
| X-1   | Flat projected input observations               | Done, audited |
| X-2   | Plugin metadata reaches the consumer edge       | Done, audited |
| X-3   | Explicit per-key contribution contract          | Done, audited |
| P1-5  | Structural registry change detection            | Done, audited |
| P1-6  | Listener snapshots before notification          | Done, audited |
| P1-7  | Scheduler-driven deferred drain                 | Done, audited |
| P1-8  | One reentrancy policy, one flush entry point    | Done, audited |
| P1-9  | Narrow public project handle                    | Done, audited |
| P1-10 | Product-load authored validation                | Done, audited |
| P1-11 | Runtime composition/output-shape diagnostics    | Done, audited |
| P1-12 | One observation-validation owner                | Done, audited |
| S5    | Contribution completeness                       | Done, audited |
| S6    | Remove dead `use` contract                      | Done, audited |
| S7    | Test debt and executable recovery audit         | Done, audited |
| S8    | Final ledger correction                         | In progress   |

## S7 exit evidence

- [PR #93](https://github.com/chahyasantoso/motion5/pull/93), merged as [`775d68f`](https://github.com/chahyasantoso/motion5/commit/775d68f146242cfcba7131a670df9268c07655cd), recreates the B1 registry-edge test, proves contribution agreement and deterministic ordering, sorts duplicate-output diagnostics, rebaselines mutation scope, and makes the recovery audit executable.
- [Recovery audit #61](https://github.com/chahyasantoso/motion5/actions/runs/31754608742) audited S7 head `6d2cda4716b50d81235dfe9d5e67178369bfa0f6` against completed rescue parent `07931088ad162ab37927a52b2c46b9f65ec0a50e`.
- Contract and consumer evidence, mutation baseline and ratchet, executed acceptance mapping, failing-first evidence, declaration build and end-to-end, and the final audit report all passed.
- The run produced durable artifacts for every gate plus the final `ci-logs` summary.

## Recovery evidence chain

- S2: [PR #88](https://github.com/chahyasantoso/motion5/pull/88), absolute per-property GSAP compilation and structured ease-collision evidence.
- S3: [PR #89](https://github.com/chahyasantoso/motion5/pull/89), registration-owned deterministic plugin ownership.
- S4: [PR #90](https://github.com/chahyasantoso/motion5/pull/90), one authored/contributed stop-validation owner.
- S5: [PR #91](https://github.com/chahyasantoso/motion5/pull/91), contribution completeness, cascade bounds, and reserved tween-var diagnostics.
- S6: [PR #92](https://github.com/chahyasantoso/motion5/pull/92), removal and rejection of the dead `use` contract.
- S7: [PR #93](https://github.com/chahyasantoso/motion5/pull/93), real-edge test debt and executable recovery audit.

## Current next action

Finish S8 by resolving this ledger PR against the completed rescue head and requiring its documentation-only matrix to pass. Then merge S8 and open rescue → main; no additional implementation slice is justified unless that final matrix exposes a concrete failure.

## Remaining work

- Run the required checks on S8 after branch synchronization.
- Merge S8 into `rescue/restore-motionpath-parity` when green.
- Open rescue → main only from that audited, green head.
