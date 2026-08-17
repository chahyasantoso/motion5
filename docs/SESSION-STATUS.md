# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `feat/w5-unified-mutation-surface`  
**Phase:** runtime mutation model remediation, W5 of five work packages. W1 through W4 are merged. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** run W5 implementation CI, then review the final mutation surface.

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model (current effort)

An editor use case (start from an empty project, add and remove motions, tracks, and observation edges at runtime) was pressure-tested against the existing mutation API. `docs/PROBLEM-STATEMENT-runtime-mutation-model.md` records the three problems found; the assessment verified them against the live code and found four more.

| Package | Scope | State |
| --- | --- | --- |
| W1 | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109) |
| W2 | Transactional `adopt`/`destroyAdopted` (P1, A1) | merged, [#110](https://github.com/chahyasantoso/motion5/pull/110) |
| W3 | Freeze and validate adopted tracks (A2) | merged, [#111](https://github.com/chahyasantoso/motion5/pull/111) |
| W4 | Runtime `addMotion`/`destroyMotion` (P2) | merged, [#112](https://github.com/chahyasantoso/motion5/pull/112) |
| W5 | Unified store, capability handles, `replaceTrack` (P3) | in progress, [#113](https://github.com/chahyasantoso/motion5/pull/113) |

## W5 invariant

The editor sees one removable store for authored and runtime tracks. `TrackHandle` capabilities are scoped to one node instance with monotonic ABA protection. Track replacement preserves node identity and subscribers, so edits never emit terminal `"destroyed"` patches. `dependantsOf` reads committed GraphIR for preflight while graph validation remains the only deletion enforcement.

Schema ingestion preserves validated authored track identity and does not auto-mount nodes. This intentionally removes the old structural permanence guarantee for schema-declared tracks, which is the accepted editor tradeoff.

## W5 red evidence

- Red: [run 31989169706](https://github.com/chahyasantoso/motion5/actions/runs/31989169706), with GitHub annotations showing the expected missing `track`, `addTrack`, `dependantsOf`, and capability API, plus the expected runtime `handle.addTrack is not a function` failures. The detailed annotations are on the run page; the archive branch may lag the run folder.
- Implementation files: `packages/core/src/runtime/project-runtime.ts`, `packages/core/src/engine.ts`, `packages/core/src/index.ts`, `packages/core/test/integration/unified-mutation-surface.test.ts`, and `packages/core/test/integration/project-handle-surface.test.ts`.

## Known defects, not yet fixed

None from the planned runtime mutation model. W5 still needs the implementation CI gate and review; scroll/time trigger drivers remain separate work because core currently treats `trigger.type` as inert.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
