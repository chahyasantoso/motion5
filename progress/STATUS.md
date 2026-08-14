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
| P5-01      | Cross-motion references through membership      | In progress, red-green |

## Evidence

- PR [#95](https://github.com/chahyasantoso/motion5/pull/95) merged as [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b).
- M1 PR [#96](https://github.com/chahyasantoso/motion5/pull/96) merged as [`1a26bfe`](https://github.com/chahyasantoso/motion5/commit/1a26bfe50899d8cb3bd7d0bde87d3def2033692d).
- Assertion-level red: [`2681d1a`](https://github.com/chahyasantoso/motion5/commit/2681d1a5b9336dd8c4b08f8ab7b80d64a5817020).
- Final audited M1 head: [`c26a807`](https://github.com/chahyasantoso/motion5/commit/c26a807c8fe74dc6fc79ee4ef92907c6364c408b).
- Recovery audit [31767593680](https://github.com/chahyasantoso/motion5/actions/runs/31767593680) passed contract, mutation, acceptance, failing-first, and build/end-to-end jobs. Its only annotations were Node 20 action deprecation warnings.
- PR [#98](https://github.com/chahyasantoso/motion5/pull/98) attempted P5-01 and was closed without merge: it decided pending-vs-error by catching a runtime exception in `GraphPublisher` instead of a load-time owner, never landed a single owner for pending state, and needed two undocumented cache reverts in `GraphRuntime` to chase a bug that was actually a test fixture ambiguity. See `docs/PHASE5-DETAILED-PLAN.md` for the full breakdown.
- P5-01 retry base: `phase5/membership-base`, branch [`fix/p5-01-cross-motion-references-v2`](https://github.com/chahyasantoso/motion5/tree/fix/p5-01-cross-motion-references-v2).
- P5-01 red commits: [`70514cd`](https://github.com/chahyasantoso/motion5/commit/70514cd753924c2a45afccd419576494706fbc95) (cross-motion.test.ts, asserts a literal rule id so it is red without depending on the not-yet-created module), [`6258121`](https://github.com/chahyasantoso/motion5/commit/62581216a6a9880e6a514ddc315c9b708c451a1b) (references.test.ts, red because the module does not exist yet), [`4b6939b`](https://github.com/chahyasantoso/motion5/commit/4b6939b4944a46476dafbbb746adb37dce6d20f2) (updates the now-obsolete P2 smell-test expectation in the same red commit).
- P5-01 green commits: [`f87565d`](https://github.com/chahyasantoso/motion5/commit/f87565d4fdebd10ab3333ff941c7a00edb860dc0) (new `core/graph/references.ts`, the single owner of pending-versus-resolved classification), [`9ae4985`](https://github.com/chahyasantoso/motion5/commit/9ae49852568748e1a5ff2b9a8ccc1dc542cc7da0) (`GraphPublisher` consumes the classifier before attempting composition; no exception-based branching).

## P5-01 contract

An edge whose source is unknown anywhere in the project fails at load, in `graph/ir.ts`, as before. An edge whose source is known but has not published a value yet (typically because it is not currently a member) publishes `blocked` with a `observation-pending-reference` warning diagnostic, never a fabricated value, and republishes `ready` once the source is attached and flushed. Resolution does not depend on mount order because canonical topological order (computed once from the full node list) always processes a source before its observers regardless of attach call sequence. `core/graph/references.ts` owns the classification; `GraphPublisher` only consumes it.

## Current next action

Run the exact-head required CI matrix for the PR opened from `fix/p5-01-cross-motion-references-v2` into `phase5/membership-base`, then mark P5-01 status green and merge. P5-02 (adopted free tracks) stays blocked until that merge, per `docs/PHASE5-DETAILED-PLAN.md`.

## Review disposition

The historical `CODE-REVIEW-POST-E3.md` is closed for the rescue work. Phase 5 is the current membership tier; its detailed slice-by-slice plan and guardrails live in `docs/PHASE5-DETAILED-PLAN.md`.
