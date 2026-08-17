# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `feat/w4-runtime-motion-lifecycle`  
**Phase:** runtime mutation model remediation, W4 of five work packages. W1, W2, and W3 are merged. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** review W4, then start W5 (unified store, capability handles, non-destructive replaceTrack).

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model (current effort)

An editor use case (start from an empty project, add and remove motions, tracks, and observation edges at runtime) was pressure-tested against the existing mutation API. `docs/PROBLEM-STATEMENT-runtime-mutation-model.md` records the three problems found; the assessment verified them against the live code and found four more.

| Package | Scope                                                              | State                                                                |
| ------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| W1      | Builder cache correctness (A3 cached failures, A5 owner-blind key) | merged, [#109](https://github.com/chahyasantoso/motion5/pull/109)    |
| W2      | Transactional `adopt`/`destroyAdopted` (P1, A1)                    | merged, [#110](https://github.com/chahyasantoso/motion5/pull/110)    |
| W3      | Freeze and validate adopted tracks (A2)                            | merged, [#111](https://github.com/chahyasantoso/motion5/pull/111)    |
| W4      | Runtime `addMotion`/`destroyMotion` (P2)                           | in review, [#112](https://github.com/chahyasantoso/motion5/pull/112) |
| W5      | Unified store, capability handles, `replaceTrack` (P3)             | not started                                                          |

## W4 invariant

A runtime-created Motion is a first-class lifecycle object: it can be created empty, receive tracks through `adopt(track, owner, { motionId })`, signal progress, and be destroyed only after its tracks are removed. No cascade deletion is introduced.

`ProjectRuntime` owns a mutable MotionDefinition store seeded from the validated project. Graph candidates are validated before the motion construction/destruction hooks run. `Engine` owns the actual Motion instances and uses one `buildMotion` path for authored and runtime-created motions.

Core currently constructs every Motion with a manual trigger port and does not interpret `trigger.type`; scroll/time drivers remain separate work.

## W4 evidence

- Red: [run 31988363699](https://github.com/chahyasantoso/motion5/actions/runs/31988363699), check runs show quality and integration failed while build, boundaries, end-to-end, and performance passed. The archive branch has not materialized this run folder yet; the check-run IDs are the durable source until the archive workflow catches up.
- Red test commit: [`6693bf8`](https://github.com/chahyasantoso/motion5/commit/6693bf8e92deac4989d9e11bf0417bebacca114e). The expected failure is the missing `ProjectHandle.addMotion` / `destroyMotion` surface on the merged W3 parent.
- Implementation: [`0dade4a`](https://github.com/chahyasantoso/motion5/commit/0dade4a5f959e3856a612714bd48abd5bf8210a1), adding the mutable motion store, atomic lifecycle operations, handle surface, and shared Engine Motion factory.

## Known defects, not yet fixed

- **P3** The schema baseline and runtime overlay remain separate, owner tokens are still caller-invented references, and no non-destructive track replacement or dependants read exists. W5.

## Verified recovered behavior

- Cross-motion references use one classifier in `core/graph/references.ts`.
- Known but unavailable sources publish blocked pending patches and recover without fabricated values.
- Runtime-adopted free tracks join the graph under `~/trackId` through the shared `qualifyFreeTrack` helper with owner-only destruction.
- Diagnostics use one bounded inspection buffer while patches and batch summaries remain the live delivery path.
- Unmounting evicts detached nodes' retained patches through the registry owner, preserves subscribers, reuses the existing pending/blocked path, and recovers on remount with newer revisions.
- Node destruction is represented on the observation wire as a terminal `"destroyed"` patch ([#108](https://github.com/chahyasantoso/motion5/pull/108)). W2 prevents that terminal patch from firing when the destroy is rejected.

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
