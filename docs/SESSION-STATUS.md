# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `fix/w3-adopted-track-immutability`  
**Phase:** runtime mutation model remediation, W3 of five work packages. W1 and W2 are merged. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** review W3, then start W4 (runtime Motion lifecycle).

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model (current effort)

An editor use case (start from an empty project, add and remove motions, tracks, and observation edges at runtime) was pressure-tested against the existing mutation API. `docs/PROBLEM-STATEMENT-runtime-mutation-model.md` records the three problems found; the assessment verified them against the live code and found four more.

| Package | Scope                                                              | State                                                                |
| ------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| W1      | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109)    |
| W2      | Transactional `adopt`/`destroyAdopted` (P1, A1)                    | merged, [#110](https://github.com/chahyasantoso/motion5/pull/110)    |
| W3      | Freeze and validate adopted tracks (A2)                            | in review, [#111](https://github.com/chahyasantoso/motion5/pull/111) |
| W4      | Runtime `addMotion`/`destroyMotion` (P2)                           | not started                                                          |
| W5      | Unified store, capability handles, `replaceTrack` (P3)             | not started                                                          |

W1 precedes W2 deliberately: W2 makes a rejected mutation retryable, and against the unfixed cache a retry could succeed with a silently dropped observation edge. W1 is merged, so W2 safely installed retryability. W3 now closes the identity-cache hole for runtime-created tracks.

### Known defects, not yet fixed

- **P2** No runtime-callable way to create or destroy a `Motion`; `#buildProjectSnapshot` reads the frozen `#project.motions`, so the `Unknown motion` guard is load-bearing rather than merely defensive. W4.

## W3 invariant

Every runtime-created `TrackDefinition` is validated by the single contract validation owner and stored as a deep-frozen runtime-owned clone. Caller mutation cannot invalidate the incremental graph builder's identity cache or alter the compiled graph definition.

`validateTrackDefinition` reuses `validateTrackShape`, `clone`, and `deepFreeze` from `validate-v5.ts`. Project-level duplicate and graph rules remain owned by the candidate graph build. W3 adds no second validation owner.

## W3 evidence

- Red: [run 31987793436](https://github.com/chahyasantoso/motion5/actions/runs/31987793436), archived at `logs/31987793436/failed-jobs.log` on `ci-logs`. Integration: 4 failed, 119 passed. Quality: 4 failed, 356 passed. Three failures were expected W3 gaps; the fourth exposed an incorrect test assumption about whether the caller source itself should be frozen.
- Corrected test and implementation: [run 31988108996](https://github.com/chahyasantoso/motion5/actions/runs/31988108996), all seven checks passed. The caller source stays mutable by design; the runtime-owned clone stays frozen and composes the original value after source mutation.
- Implementation files: `packages/core/src/contract/validate-v5.ts`, `packages/core/src/runtime/project-runtime.ts`, and `packages/core/test/integration/adopted-track-immutability.test.ts`.

## Corrections to earlier claims

- `Engine.load()` never reads `MotionDefinition.trigger`. Every motion is constructed with `createManualTriggerPort()`, so `trigger.type` (`scroll`/`time`/`manual`) is inert in core and no scroll or time driver exists. A runtime `Motion` is worth creating for independent signaling, `stagger`, and its own `#position`, not for a trigger.
- `adopt()`'s pre-commit side effects were `compileTrack` and `#adopted.set`, not `mount()`, which runs after `replaceGraph`.
- W3 freezes a defensive clone, not the caller's object. This makes the public input safe to reuse or mutate while keeping the runtime's cache key immutable.

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
- P5-04 behavior PR [#102](https://github.com/chahyasantoso/motion5/pull/102) merged; lifecycle companion PR [#103](https://github.com/chahyasantoso/motion5/pull/103) merged. Exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
