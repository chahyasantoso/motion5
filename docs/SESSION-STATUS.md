# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `feat/w5-unified-mutation-surface`  
**Phase:** runtime mutation model remediation, W5 of five work packages. W1 through W4 are merged. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** review and merge W5, then treat the runtime mutation model as complete.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model

| Package | Scope                                                              | State                                                                       |
| ------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| W1      | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109)           |
| W2      | Transactional `adopt`/`destroyAdopted` (P1, A1)                    | merged, [#110](https://github.com/chahyasantoso/motion5/pull/110)           |
| W3      | Freeze and validate adopted tracks (A2)                            | merged, [#111](https://github.com/chahyasantoso/motion5/pull/111)           |
| W4      | Runtime `addMotion`/`destroyMotion` (P2)                           | merged, [#112](https://github.com/chahyasantoso/motion5/pull/112)           |
| W5      | Unified store, capability handles, `replaceTrack` (P3)             | ready for review, [#113](https://github.com/chahyasantoso/motion5/pull/113) |

## W5 invariant

The editor sees one removable store for authored and runtime tracks. `TrackHandle` capabilities are scoped to one node instance with monotonic ABA protection. Track replacement preserves node identity and subscribers, so edits never emit terminal `"destroyed"` patches. `dependantsOf` reads committed GraphIR for preflight while graph validation remains the only deletion enforcement.

Schema ingestion preserves validated authored track identity and does not auto-mount nodes. This intentionally removes the old structural permanence guarantee for schema-declared tracks, which is the accepted editor tradeoff.

## W5 implementation

- `ProjectRuntime` now owns the unified track store, motion store, schema owner sentinel, and monotonic capability tokens.
- `Engine` exposes `addTrack`, `track`, and `dependantsOf` through `ProjectHandle`; `TrackHandle` stays at the public engine boundary so runtime/graph declarations do not leak through package typings.
- `GraphRuntime` exposes the committed GraphIR read-only for `dependantsOf`; topology mutation remains owned by `GraphBinding`.
- `replace` is non-destructive, and `addObserve` / `removeObserve` are observer-track replacement helpers.
- `docs/DECISIONS.md` records the deliberate store collapse, handle/ABA semantics, replacement behavior, and graph-validation deletion enforcement.

## W5 evidence

- Initial red: [run 31989169706](https://github.com/chahyasantoso/motion5/actions/runs/31989169706), expected missing public mutation APIs and capability methods.
- First implementation red: [run 31989480150](https://github.com/chahyasantoso/motion5/actions/runs/31989480150), caught the handle getter's incorrect `this`, the missing GraphIR accessor, and declaration/boundary leaks.
- Second implementation red: [run 31989631561](https://github.com/chahyasantoso/motion5/actions/runs/31989631561), caught the source-removal assertion and public boundary allowlists.
- Final green: [run 31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456), all seven checks pass: quality, integration, boundaries, build, end-to-end, performance, prettier.

## Known remaining scope

The planned runtime mutation model is complete after W5. Scroll/time trigger drivers remain separate work because core currently treats `trigger.type` as inert.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
