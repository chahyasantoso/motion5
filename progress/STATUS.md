# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and executable evidence.

Last reviewed: 2026-08-14

## Board

| ID         | Slice                                           | Status                 |
| ---------- | ----------------------------------------------- | ---------------------- |
| W0         | Rescue loop and audit baseline                  | Done                   |
| A1         | Final-value memo consistency                    | Done, gate open        |
| A2         | Preserve subscriber errors                      | Done, gate open        |
| A3         | Guard subscriber-triggered reentrancy           | Done, gate open        |
| B1         | Prepare-stage plugin contribution               | Done                   |
| B2         | Real GSAP multi-stop compilation                | Done                   |
| C1         | React store resubscription                      | Done                   |
| C2         | React hook and public exports                   | Done, gate open        |
| C3         | DOM metadata, serialization, and clear coverage | Done, gate open        |
| D1         | Discover consumer packages                      | Done                   |
| D2         | Planted boundary self-test                      | Done                   |
| D3         | Acceptance evidence gates                       | Done, gate open        |
| E1         | Required declaration build                      | Done, gate open        |
| E2         | Real end-to-end product path                    | Done                   |
| E3         | Mutation baseline and ratchet                   | Done, gate open        |
| P0-1       | Clock and batch identity                        | Done                   |
| P0-2       | GSAP clock ownership                            | Done                   |
| P0-3       | Absolute multi-property stop compilation        | Done, audited          |
| P0-3b      | Authored-duration pinning                       | Done, audited          |
| P0-4       | DOM transform rendering and removal             | Done, audited          |
| X-1        | Flat projected input observations               | Done, merged           |
| P1-5       | Structural registry change detection            | Done, merged           |
| P1-6       | Listener snapshots before notification          | Done, merged           |
| P1-7       | Scheduler-driven deferred drain                 | Done, merged           |
| P1-8       | One reentrancy policy, one flush entry point    | Done, merged           |
| P1-9       | Narrow public project handle                    | Done, merged           |
| P1-10      | Product-load authored validation                | Done, merged           |
| P1-11      | Runtime composition/output-shape diagnostics    | Done, merged           |
| P1-12      | One observation-validation owner                | Done, merged           |
| S5         | Contribution completeness                       | Done, gate open        |
| S6         | Remove dead `use` contract                      | Done, gate open        |
| S7         | Recovery audit and durable evidence             | Done, audited          |
| P2/G-5/G-6 | Dirty-closure benchmark and mutation ratchet    | Done, audited          |
| M1         | Motion/trigger lifecycle wiring                 | Done, audited          |
| P5-01      | Cross-motion references through membership      | In progress, red-green |

## Evidence

- PR [#95](https://github.com/chahyasantoso/motion5/pull/95) merged as [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b).
- M1 PR [#96](https://github.com/chahyasantoso/motion5/pull/96) merged as [`1a26bfe`](https://github.com/chahyasantoso/motion5/commit/1a26bfe50899d8cb3bd7d0bde87d3def2033692d).
- P5 base: [`phase5/membership-base`](https://github.com/chahyasantoso/motion5/tree/phase5/membership-base).
- P5-01 PR [#98](https://github.com/chahyasantoso/motion5/pull/98).
- P5-01 red test: [`5435bbb`](https://github.com/chahyasantoso/motion5/commit/5435bbb89addaf5b4d2d8594b8e0b33882a3f716).
- P5-01 red run: [31774711722](https://github.com/chahyasantoso/motion5/actions/runs/31774711722), failing because unavailable cross-motion input published `error` instead of `blocked/pending-reference`.
- P5-01 implementation: [`c496a04`](https://github.com/chahyasantoso/motion5/commit/c496a04fff49c1fd93203346740cddf53c49d239), with source-first coverage [`6e65ada`](https://github.com/chahyasantoso/motion5/commit/6e65ada7a6d816f6a283f0d33a5845278ababba3) and invalid/immutable coverage [`153bb5c`](https://github.com/chahyasantoso/motion5/commit/153bb5c8a1df21b1162ea7b3af20b35a65fc922d).

## P5-01 contract

Valid but unavailable sources are pending membership, not composition failures: publish `blocked` with warning `pending-reference`, never fabricate values, and republish ready when the source mounts. Unknown references remain load-time errors. GraphBinding owns topology, GraphPublisher owns publication, and ProjectRuntime owns membership; no flags or second node model.

## Current next action

Run the full exact-head matrix for PR #98, then update P5-01 status only after green. P5-02 must wait for P5-01 merge.

## Review disposition

The historical `CODE-REVIEW-POST-E3.md` is closed for the rescue work. Phase 5 is now the next planned membership tier; its oracle references and acceptance criteria are documented in PR #98.
