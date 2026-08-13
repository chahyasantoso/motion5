# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

## Board

| ID    | Slice                                           | Status          |
| ----- | ----------------------------------------------- | --------------- |
| W0    | Rescue loop and audit baseline                  | Done            |
| A1    | Final-value memo consistency                    | Done, gate open |
| A2    | Preserve subscriber errors                      | Done, gate open |
| A3    | Guard subscriber-triggered reentrancy           | Done, gate open |
| B1    | Prepare-stage plugin contribution               | Done            |
| B2    | Real GSAP multi-stop compilation                | Done            |
| C1    | React store resubscription                      | Done            |
| C2    | React hook and public exports                   | Done, gate open |
| C3    | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1    | Discover consumer packages                      | Done            |
| D2    | Planted boundary self-test                      | Done            |
| D3    | Acceptance evidence gates                       | Done, gate open |
| E1    | Required declaration build                      | Done, gate open |
| E2    | Real end-to-end product path                    | Done            |
| E3    | Mutation baseline and ratchet                   | Done, gate open |
| P0-1  | Clock and batch identity                        | Done            |
| P0-2  | GSAP clock ownership                            | Done            |
| P0-3  | Absolute multi-property stop compilation        | Done, audited   |
| P0-3b | Authored-duration pinning                       | Done, audited   |
| P0-4  | DOM transform rendering and removal             | Done, audited   |
| X-1   | Flat projected input observations               | Done, merged    |
| P1-5  | Structural registry change detection            | Done, merged    |
| P1-6  | Listener snapshots before notification          | Done, merged    |
| P1-10 | Product-load authored validation                | Done, merged    |
| P1-11 | Runtime composition/output-shape diagnostics    | Done, merged    |
| P1-7  | Scheduler-driven deferred drain                 | Done, merged    |
| P1-8  | One reentrancy policy, one flush entry point    | Done, merged    |
| P1-9  | Narrow public project handle                    | Done, merged    |
| P1-12 | One observation-validation owner                | Done, merged    |
| S5    | Contribution completeness                       | Done, gate open |
| S6    | Remove dead `use` contract                      | In progress     |

## Current next action

**S6:** finish the dead `use` contract slice, then rerun the recovery audit on the final head. Do not open rescue → main until the full required matrix is green.

## Evidence

- S5: PR #91, merged and awaiting the recovery audit.
- S6: PR #92, failing-first coverage and implementation are on this branch; final evidence is pending the required matrix.

## Reopened gates

- C3/X-2: plugin metadata and the full `contribute()` contract remain open.
- G-1/G-3/G-4/G-5/G-6/G-7: unified governance implementation is merged; rerun the recovery audit on the merged rescue head before calling the rescue complete.

## Remaining work

- S6: complete the dead `use` contract and record the green required matrix.
- Rerun the recovery audit against the merged rescue head and fix any evidence-only failures.
- Open rescue → main after the audit is clean.
