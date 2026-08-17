# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `fix/w2-transactional-runtime-mutation`  
**Phase:** runtime mutation model remediation, W2 of five work packages. W1 is merged. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** review W2, then start W3 (freeze and validate adopted tracks).

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model (current effort)

An editor use case (start from an empty project, add and remove motions, tracks, and observation edges at runtime) was pressure-tested against the existing mutation API. `docs/PROBLEM-STATEMENT-runtime-mutation-model.md` records the three problems found; the assessment verified them against the live code and found four more.

| Package | Scope                                                              | State                                                                |
| ------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| W1      | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109)    |
| W2      | Transactional `adopt`/`destroyAdopted` (P1, A1)                    | in review, [#110](https://github.com/chahyasantoso/motion5/pull/110) |
| W3      | Freeze and validate adopted tracks (A2)                            | not started                                                          |
| W4      | Runtime `addMotion`/`destroyMotion` (P2)                           | not started                                                          |
| W5      | Unified store, capability handles, `replaceTrack` (P3)             | not started                                                          |

W1 precedes W2 deliberately: W2 makes a rejected mutation retryable, and against the unfixed cache a retry could succeed with a silently dropped observation edge. W1 is now merged, so W2 can safely install retryability.

### Known defects, not yet fixed

- **A2** Adopted tracks are never frozen and bypass `validateV5`, so the builder cache identity invariant is unenforced on exactly the objects an editor mutates. W3.
- **P2** No runtime-callable way to create or destroy a `Motion`; `#buildProjectSnapshot` reads the frozen `#project.motions`, so the `Unknown motion` guard is load-bearing rather than merely defensive. W4.

## W2 invariant

A runtime mutation either fully succeeds or changes nothing observable. A rejected operation leaves the same graph, compiled tracks, adoption bookkeeping, mounted membership, and patch wire as before it was called.

`GraphBinding.replace()` remains the sole candidate validator. W2 does not add dependency tracking: a destroy with a live dependant is rejected by the existing `observation-unknown-source` diagnostic.

## W2 evidence

- Red: [run 31987357526](https://github.com/chahyasantoso/motion5/actions/runs/31987357526), archived at `logs/31987357526/` on `ci-logs`. Integration: 3 failed, 116 passed. Quality: 3 failed, 353 passed. Failures are assertion-level: false `destroyed` patch on rejected destroy, `Adopted track "~/child" already exists.`, and `Adopted track "~/self" already exists.`. No import-resolution or config failure.
- Implementation: `packages/core/src/runtime/project-runtime.ts`, with the pure explicit-map snapshot helper and validate-then-commit ordering for both mutation operations.

## Corrections to earlier claims

- `Engine.load()` never reads `MotionDefinition.trigger`. Every motion is constructed with `createManualTriggerPort()`, so `trigger.type` (`scroll`/`time`/`manual`) is inert in core and no scroll or time driver exists. A runtime `Motion` is worth creating for independent signaling, `stagger`, and its own `#position`, not for a trigger.
- `adopt()`'s pre-commit side effects were `compileTrack` and `#adopted.set`, not `mount()`, which runs after `replaceGraph`.

## Verified recovered behavior

- Cross-motion references use one classifier in `core/graph/references.ts`.
- Known but unavailable sources publish blocked pending patches and recover without fabricated values.
- Runtime-adopted free tracks join the graph under `~/trackId` through the shared `qualifyFreeTrack` helper with owner-only destruction.
- Diagnostics use one bounded inspection buffer while patches and batch summaries remain the live delivery path.
- Unmounting evicts detached nodes' retained patches through the registry owner, preserves subscribers, reuses the existing pending/blocked path, and recovers on remount with newer revisions.
- Node destruction is represented on the observation wire as a terminal `"destroyed"` patch ([#108](https://github.com/chahyasantoso/motion5/pull/108)). W2 prevents that terminal patch from firing when the destroy is rejected.

## Phase 5 evidence

- P5-01 exact-head CI: [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696).
- P5-02 exact-head CI: [31780297529](https://github.com/chahyasantoso/motion5/actions/runs/31780297529).
- P5-03 exact-head CI: [31780874122](https://github.com/chahyasantoso/motion5/actions/runs/31780874122).
- P5-04 behavior PR [#102](https://github.com/chahyasantoso/motion5/pull/102) merged at [`c52293f`](https://github.com/chahyasantoso/motion5/commit/c52293f9554a771a366dd76ccc3890ffa3a2ed7); lifecycle companion PR [#103](https://github.com/chahyasantoso/motion5/pull/103) merged at [`3b376ad`](https://github.com/chahyasantoso/motion5/commit/3b376ad59365bc4c1a20dbf5d8e7f7f3d7d7a3ed7). Exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
